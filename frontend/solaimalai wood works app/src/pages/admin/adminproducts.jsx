import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/navbar.jsx";
import Footer from "../../components/footer.jsx";
import api from "../../api/api";
import {
  PlusCircle,
  Package,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Hammer,
  Phone,
  ExternalLink,
  Shield,
  Loader2,
  UploadCloud,
  Link2,
  Image as ImageIcon,
  X,
  FileImage,
} from "lucide-react";

const STAGES = [
  { id: "Advance_Received", label: "1. Advance Paid & Verified", defaultPercent: 15 },
  { id: "Timber_Selection", label: "2. Matured Teak Selection & Seasoning", defaultPercent: 30 },
  { id: "Carpentry_Joinery", label: "3. Handcrafted Carpentry & Frame Joinery", defaultPercent: 50 },
  { id: "Hand_Carving", label: "4. Traditional Hand-Carving & Artistry", defaultPercent: 70 },
  { id: "Polishing_Finishing", label: "5. Hand Sanding & Natural Teak Polish", defaultPercent: 85 },
  { id: "Quality_Inspection", label: "6. Quality Check & Brass Fitting", defaultPercent: 95 },
  { id: "Ready_Delivery", label: "7. Ready for Delivery & Dispatched", defaultPercent: 100 },
  { id: "Delivered", label: "8. Delivered & Installed", defaultPercent: 100 },
];

function AdminProduct() {
  const [activeTab, setActiveTab] = useState("orders"); // "orders" or "products"

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stageForm, setStageForm] = useState({
    stage: "Advance_Received",
    progressPercent: 20,
    workshopNotes: "",
    estimatedDeliveryDate: "",
    paymentStatus: "Advance_Verified",
  });
  const [updatingProcess, setUpdatingProcess] = useState(false);

  // Products State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Chairs");
  const [material, setMaterial] = useState("100% Solid Teak");
  const [tag, setTag] = useState("Handcrafted");
  const [description, setDescription] = useState("");
  const [productSubmitting, setProductSubmitting] = useState(false);

  // Dual Image Upload States (File or URL)
  const [imageUploadMode, setImageUploadMode] = useState("file"); // "file" or "url"
  const [imageUrl, setImageUrl] = useState("");
  const [imageFilePreview, setImageFilePreview] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageFileSize, setImageFileSize] = useState("");
  const fileInputRef = useRef(null);

  // Notifications
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const showNotification = (msg, isErr = false) => {
    if (isErr) {
      setError(msg);
      setMessage("");
    } else {
      setMessage(msg);
      setError("");
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 4000);
  };

  // Fetch Orders
  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
      try {
        const local = JSON.parse(localStorage.getItem("orders")) || [];
        setOrders(local);
      } catch {}
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Products
  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  // Handle Local File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Please select an image file (JPG, PNG, WebP) ❌", true);
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image file size should be less than 5MB ❌", true);
      return;
    }

    setImageFileName(file.name);
    setImageFileSize((file.size / 1024).toFixed(1) + " KB");

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFilePreview(reader.result);
      setImageUrl(""); // Clear text URL
    };
    reader.readAsDataURL(file);
  };

  // Remove Selected File
  const handleRemoveFile = () => {
    setImageFilePreview("");
    setImageFileName("");
    setImageFileSize("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Open Stage Update Drawer for an Order
  const openOrderProcessModal = (order) => {
    setSelectedOrder(order);
    setStageForm({
      stage: order.workingProcess?.currentStage || "Advance_Received",
      progressPercent: order.workingProcess?.progressPercent || 15,
      workshopNotes: order.workingProcess?.workshopNotes || "",
      estimatedDeliveryDate: order.workingProcess?.estimatedDeliveryDate || "",
      paymentStatus: order.paymentStatus || "Advance_Verified",
    });
  };

  // Submit Working Process Update
  const handleUpdateProcess = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingProcess(true);

    try {
      await api.put(`/orders/${selectedOrder._id || selectedOrder.id}/process`, {
        stage: stageForm.stage,
        progressPercent: Number(stageForm.progressPercent),
        workshopNotes: stageForm.workshopNotes,
        estimatedDeliveryDate: stageForm.estimatedDeliveryDate,
        paymentStatus: stageForm.paymentStatus,
      });

      showNotification(`✅ Working stage updated to ${stageForm.stage} successfully!`);
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      console.error("Error updating stage:", err);
      showNotification("Failed to update working process: " + (err.response?.data?.message || err.message), true);
    } finally {
      setUpdatingProcess(false);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      showNotification("Order deleted successfully ✅");
      loadOrders();
    } catch (err) {
      showNotification("Failed to delete order", true);
    }
  };

  // Add Product Submit (Supports File Base64 or URL)
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const finalImage = imageUploadMode === "file" ? imageFilePreview : imageUrl;

    if (!finalImage || !finalImage.trim()) {
      showNotification(
        imageUploadMode === "file"
          ? "Please choose an image file to upload ❌"
          : "Please enter an image URL ❌",
        true
      );
      return;
    }

    setProductSubmitting(true);

    try {
      await api.post("/products", {
        name,
        price: Number(price),
        category,
        image: finalImage.trim(),
        material,
        tag,
        description,
      });

      showNotification("✅ Product published to customer catalog successfully!");
      setName("");
      setPrice("");
      setImageUrl("");
      handleRemoveFile();
      setDescription("");
      loadProducts();
    } catch (err) {
      showNotification("Failed to add product: " + (err.response?.data?.message || err.message), true);
    } finally {
      setProductSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this product from catalog?")) return;
    try {
      await api.delete(`/products/${productId}`);
      showNotification("Product removed from catalog ✅");
      loadProducts();
    } catch (err) {
      showNotification("Failed to delete product", true);
    }
  };

  const activeImagePreview = imageUploadMode === "file" ? imageFilePreview : imageUrl;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#291811] flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#1C130D] text-[#F3E9D8] py-10 px-4 sm:px-6 lg:px-8 border-b border-[#C9873F]/30 relative">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9873F]/20 text-[#F0A35C] text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              Master Admin Control Center
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#F3E9D8]">
              Solaimalai Workshop Administration
            </h1>
            <p className="text-xs sm:text-sm text-[#D4C3AC] mt-1">
              Logged in as: <span className="font-mono text-[#F0A35C]">nanthakumar2006geetha02@gmail.com</span>
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="bg-[#26160d] p-1.5 rounded-2xl border border-[#C9873F]/30 flex items-center gap-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-[#C9873F] text-[#1C130D] shadow-md shadow-[#C9873F]/25"
                  : "text-[#D4C3AC] hover:text-white"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Customer Orders & Working Process ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeTab === "products"
                  ? "bg-[#C9873F] text-[#1C130D] shadow-md shadow-[#C9873F]/25"
                  : "text-[#D4C3AC] hover:text-white"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Product Catalog ({products.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        
        {/* Floating Notifications */}
        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-300 text-red-700 text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-md">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: ORDERS & WORKING PROCESS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-[#EBDCC8]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#291811]">
                  Live Customer Orders & Carpentry Tracking
                </h2>
                <p className="text-xs text-[#826754] mt-0.5">
                  Update working process stages (Timber Selection → Carpentry → Polishing → Delivery) for real-time customer visibility.
                </p>
              </div>

              <button
                onClick={loadOrders}
                className="px-4 py-2 bg-white border border-[#C9873F]/40 rounded-xl text-xs font-semibold text-[#9E5A1C] hover:bg-[#FAF3E7] transition cursor-pointer"
              >
                Refresh Orders
              </button>
            </div>

            {ordersLoading ? (
              <div className="text-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#C9873F] mx-auto" />
                <p className="text-xs text-[#826754] mt-2">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#EBDCC8] p-8 max-w-md mx-auto">
                <Clock className="w-12 h-12 text-[#C9873F] mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold">No Orders Placed Yet</h3>
                <p className="text-xs text-[#826754] mt-1">When customers place orders with advance payment, they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((ord) => (
                  <div
                    key={ord._id || ord.id || ord.orderId}
                    className="bg-white rounded-3xl p-6 border border-[#EBDCC8] shadow-md hover:shadow-xl transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Left Info */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-[#1C130D] text-[#F0A35C] px-3 py-1 rounded-full">
                          {ord.orderId || ord.id}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          ord.paymentStatus === "Advance_Verified"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : "bg-amber-50 text-amber-700 border-amber-300"
                        }`}>
                          {ord.paymentStatus || "Advance Registered"}
                        </span>
                        <span className="text-xs text-[#826754]">
                          {new Date(ord.createdAt || ord.placedAt || Date.now()).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-[#826754] font-semibold">Customer:</p>
                          <p className="font-bold text-[#1C130D] text-sm">{ord.customer?.name}</p>
                          <p className="text-[#6E4F39] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <a href={`tel:${ord.customer?.phone}`} className="hover:underline">{ord.customer?.phone}</a>
                          </p>
                        </div>

                        <div>
                          <p className="text-[#826754] font-semibold">Financials & UPI Ref:</p>
                          <p className="font-bold text-sm text-[#1C130D]">
                            Total: ₹{Number(ord.totalAmount || ord.total || 0).toLocaleString()}
                          </p>
                          <p className="text-emerald-700 font-semibold">
                            Advance: ₹{Number(ord.advancePaid || ord.advance || 0).toLocaleString()}
                          </p>
                          <p className="font-mono text-[11px] text-[#9E5A1C] mt-0.5">
                            UTR: {ord.upiRefNo || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[#826754] font-semibold">Current Working Stage:</p>
                          <p className="font-bold text-sm text-[#9E5A1C]">
                            {ord.workingProcess?.currentStageLabel || "Advance Received"} ({ord.workingProcess?.progressPercent || 15}%)
                          </p>
                          <p className="text-[#735A47] text-[11px] italic mt-0.5 line-clamp-1">
                            "{ord.workingProcess?.workshopNotes || "Order registered."}"
                          </p>
                        </div>
                      </div>

                      {/* Items Pill */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F0E6D8]">
                        {ord.items?.map((it, idx) => (
                          <span key={idx} className="text-[11px] bg-[#FAF6F0] px-2.5 py-1 rounded-lg border border-[#EBDCC8] text-[#291811]">
                            {it.name} (₹{Number(it.price).toLocaleString()})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 border-t lg:border-t-0 lg:border-l border-[#F0E6D8] pt-4 lg:pt-0 lg:pl-6">
                      <button
                        onClick={() => openOrderProcessModal(ord)}
                        className="py-3 px-5 rounded-xl font-bold text-xs text-[#1C130D] bg-gradient-to-r from-[#F0A35C] to-[#C9873F] hover:brightness-110 shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Hammer className="w-4 h-4" />
                        <span>Update Working Process</span>
                      </button>

                      <a
                        href={`/tracking?orderId=${ord.orderId || ord.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-4 rounded-xl font-semibold text-xs text-[#735A47] border border-[#C9873F]/40 hover:bg-[#FAF3E7] transition flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Customer Tracking</span>
                      </a>

                      <button
                        onClick={() => handleDeleteOrder(ord._id || ord.id)}
                        className="py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: UPDATE WORKING PROCESS STAGE */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#EBDCC8] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0E6D8]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#291811]">
                    Update Live Working Stage
                  </h3>
                  <p className="text-xs text-[#826754]">
                    Order: <span className="font-mono font-bold text-[#1C130D]">{selectedOrder.orderId || selectedOrder.id}</span> — {selectedOrder.customer?.name}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateProcess} className="space-y-4">
                {/* Stage Select */}
                <div>
                  <label className="block text-xs font-bold text-[#6E4F39] mb-1.5">
                    Carpentry Stage *
                  </label>
                  <select
                    value={stageForm.stage}
                    onChange={(e) => {
                      const st = e.target.value;
                      const conf = STAGES.find((s) => s.id === st);
                      setStageForm({
                        ...stageForm,
                        stage: st,
                        progressPercent: conf ? conf.defaultPercent : stageForm.progressPercent,
                      });
                    }}
                    className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-sm font-semibold outline-none focus:border-[#C9873F]"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.defaultPercent}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Progress Percentage */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-[#6E4F39]">
                      Progress Percentage ({stageForm.progressPercent}%)
                    </label>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={stageForm.progressPercent}
                    onChange={(e) => setStageForm({ ...stageForm, progressPercent: Number(e.target.value) })}
                    className="w-full accent-[#C9873F]"
                  />
                </div>

                {/* Master Carpenter Workshop Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#6E4F39] mb-1.5">
                    Workshop Carpenter Live Note (Visible to Customer)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Solid teak logs sliced and seasoned. Frame joinery is being chiseled today."
                    value={stageForm.workshopNotes}
                    onChange={(e) => setStageForm({ ...stageForm, workshopNotes: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-xs sm:text-sm outline-none focus:border-[#C9873F]"
                  />
                </div>

                {/* Estimated Delivery Date & Payment Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6E4F39] mb-1.5">
                      Estimated Completion Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 28 Aug 2026 / 10 Days"
                      value={stageForm.estimatedDeliveryDate}
                      onChange={(e) => setStageForm({ ...stageForm, estimatedDeliveryDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-xs sm:text-sm outline-none focus:border-[#C9873F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6E4F39] mb-1.5">
                      Advance / Payment Status
                    </label>
                    <select
                      value={stageForm.paymentStatus}
                      onChange={(e) => setStageForm({ ...stageForm, paymentStatus: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-xs sm:text-sm outline-none focus:border-[#C9873F]"
                    >
                      <option value="Advance_Verified">Advance Verified ✅</option>
                      <option value="Advance_Pending">Advance Pending ⏳</option>
                      <option value="Fully_Paid">Fully Paid 💰</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F0E6D8]">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updatingProcess}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-[#1C130D] bg-gradient-to-r from-[#F0A35C] to-[#C9873F] hover:brightness-110 shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {updatingProcess ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Save & Notify Tracking</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Add Product Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCC8] shadow-lg space-y-5 sticky top-28">
              <div className="pb-3 border-b border-[#F0E6D8]">
                <h3 className="font-serif text-xl font-bold text-[#291811]">
                  Add New Product Design
                </h3>
                <p className="text-xs text-[#826754] mt-0.5">
                  Upload image from device or paste web image link
                </p>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#6E4F39] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Teak Pooja Door"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-xs sm:text-sm outline-none focus:border-[#C9873F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#6E4F39] mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-xs outline-none focus:border-[#C9873F]"
                    >
                      <option value="Chairs">Chairs & Benches</option>
                      <option value="Sofas">Sofas & Suites</option>
                      <option value="Wardrobes">Wardrobes & Bero</option>
                      <option value="Tables">Dining & Dressing</option>
                      <option value="Doors">Carved Doors</option>
                      <option value="Interiors">Interiors</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6E4F39] mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 35000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-xs outline-none focus:border-[#C9873F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6E4F39] mb-1">
                    Wood Specification / Material
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Solid Teak with Natural Honey Polish"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-xs outline-none focus:border-[#C9873F]"
                  />
                </div>

                {/* DUAL IMAGE UPLOAD SELECTOR (FILE OR URL) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#6E4F39]">
                      Product Image *
                    </label>
                    <div className="flex items-center gap-1 bg-[#FAF6F0] p-0.5 rounded-lg border border-[#E0D0BC]">
                      <button
                        type="button"
                        onClick={() => setImageUploadMode("file")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${
                          imageUploadMode === "file"
                            ? "bg-[#C9873F] text-[#1C130D] shadow-xs"
                            : "text-[#826754] hover:text-[#291811]"
                        }`}
                      >
                        <UploadCloud className="w-3 h-3" />
                        <span>Upload File</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageUploadMode("url")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${
                          imageUploadMode === "url"
                            ? "bg-[#C9873F] text-[#1C130D] shadow-xs"
                            : "text-[#826754] hover:text-[#291811]"
                        }`}
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Paste URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: File Upload */}
                  {imageUploadMode === "file" && (
                    <div>
                      {!imageFilePreview ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#C9873F]/60 hover:border-[#C9873F] bg-[#FAF6F0] hover:bg-[#FAF3E7] p-6 rounded-2xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#C9873F]/20 text-[#9E5A1C] flex items-center justify-center group-hover:scale-110 transition">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#291811]">
                              Click to choose image file from device
                            </p>
                            <p className="text-[11px] text-[#826754] mt-0.5">
                              Supports JPG, PNG, WEBP (Max 5MB)
                            </p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#E0D0BC] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={imageFilePreview}
                              alt="File preview"
                              className="w-14 h-14 object-cover rounded-xl border border-[#EBDCC8] bg-white shadow-xs"
                            />
                            <div>
                              <p className="text-xs font-bold text-[#291811] line-clamp-1">
                                {imageFileName}
                              </p>
                              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                Ready to upload ({imageFileSize})
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode 2: URL Input */}
                  {imageUploadMode === "url" && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-xs sm:text-sm outline-none focus:border-[#C9873F]"
                      />
                      {imageUrl && (
                        <div className="p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E0D0BC] flex items-center gap-3">
                          <img
                            src={imageUrl}
                            alt="URL preview"
                            className="w-12 h-12 object-cover rounded-lg border bg-white"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          <p className="text-xs text-[#826754]">Web URL preview loaded</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={productSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-[#1C130D] bg-gradient-to-r from-[#F0A35C] to-[#C9873F] hover:brightness-110 shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{productSubmitting ? "Uploading Product..." : "Add Product to Database"}</span>
                </button>
              </form>
            </div>

            {/* Current Products List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EBDCC8]">
                <h3 className="font-serif text-xl font-bold text-[#291811]">
                  Live Products in Catalog ({products.length})
                </h3>
                <button
                  onClick={loadProducts}
                  className="text-xs font-semibold text-[#9E5A1C] hover:underline cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              {productsLoading ? (
                <div className="text-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-[#C9873F] mx-auto" />
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((p) => (
                    <div
                      key={p._id || p.id}
                      className="bg-white p-4 rounded-2xl border border-[#EBDCC8] shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-14 h-14 object-cover rounded-xl border bg-gray-50 shrink-0 shadow-xs"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E5A1C] bg-[#FAF3E7] px-2 py-0.5 rounded">
                            {p.category}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-[#291811] mt-0.5 line-clamp-1">
                            {p.name}
                          </h4>
                          <p className="text-xs font-bold text-[#1C130D]">
                            ₹{Number(p.price).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(p._id || p.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default AdminProduct;
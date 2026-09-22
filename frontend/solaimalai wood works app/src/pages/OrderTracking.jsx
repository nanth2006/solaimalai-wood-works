import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import api from "../api/api";
import {
  Search,
  CheckCircle2,
  Clock,
  Hammer,
  TreePine,
  Sparkles,
  Truck,
  ShieldCheck,
  Phone,
  FileText,
  AlertCircle,
  Loader2,
  Package,
} from "lucide-react";

const STAGES = [
  { id: "Advance_Received", label: "Advance Paid & Verified", icon: ShieldCheck },
  { id: "Timber_Selection", label: "Matured Teak Selection", icon: TreePine },
  { id: "Carpentry_Joinery", label: "Handcrafted Carpentry & Joinery", icon: Hammer },
  { id: "Hand_Carving", label: "Traditional Hand-Carving", icon: Sparkles },
  { id: "Polishing_Finishing", label: "Hand Sanding & Natural Polish", icon: Package },
  { id: "Quality_Inspection", label: "Quality Check & Brass Fitting", icon: CheckCircle2 },
  { id: "Ready_Delivery", label: "Ready for Delivery", icon: Truck },
];

function OrderTracking() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("orderId") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async (identifier) => {
    if (!identifier) return;
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/orders/track/${identifier.trim()}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Order tracking error:", err);
      // Fallback to local storage if offline
      try {
        const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const found = localOrders.find(
          (o) =>
            o.id === identifier ||
            o.orderId === identifier ||
            o.customer?.phone === identifier
        );
        if (found) {
          setOrder(found);
          return;
        }
      } catch {}
      setError(
        err.response?.data?.message ||
          "No order found with this Order ID or Phone Number. Please verify."
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    if (orderIdParam) {
      setQuery(orderIdParam);
      fetchOrder(orderIdParam);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchOrder(query.trim());
  };

  const getStageIndex = (currentStage) => {
    const index = STAGES.findIndex((s) => s.id === currentStage);
    return index !== -1 ? index : 0;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#291811] flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-[#1C130D] text-[#F3E9D8] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#C9873F]/30 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9873F]/20 text-[#F0A35C] text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            Live Workshop Tracking
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F3E9D8]">
            Track Your Furniture's Craftsmanship
          </h1>
          <p className="text-xs sm:text-sm text-[#D4C3AC]">
            Follow the live 7-stage creation of your solid teak wood order in real time.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="mt-6 max-w-lg mx-auto flex items-center bg-[#291811] p-1.5 rounded-2xl border border-[#C9873F]/40 shadow-xl"
          >
            <div className="pl-3 text-[#C9873F]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Enter Order ID (e.g. SWW-104928) or Phone Number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-white placeholder-[#8a7260] outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-[#1C130D] bg-gradient-to-r from-[#F0A35C] to-[#C9873F] hover:brightness-110 shrink-0 transition"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        {loading && (
          <div className="text-center py-16 space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#C9873F] mx-auto" />
            <p className="text-sm font-semibold text-[#826754]">
              Connecting to workshop database...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-lg mx-auto p-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center space-y-2 animate-fade-in">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="font-serif font-bold text-base">Order Not Found</p>
            <p className="text-xs">{error}</p>
          </div>
        )}

        {order && !loading && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Order Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCC8] shadow-md flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9E5A1C] bg-[#FAF3E7] px-3 py-1 rounded-full border border-[#C9873F]/20">
                    Order ID: {order.orderId || order.id}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {order.paymentStatus === "Advance_Verified"
                      ? "Advance Verified ✅"
                      : "Advance Registered via UPI"}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#291811] mt-2">
                  Customer: {order.customer?.name}
                </h2>
                <p className="text-xs text-[#826754] mt-0.5">
                  Booked on: {new Date(order.createdAt || order.placedAt || Date.now()).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Progress Dial */}
              <div className="text-right">
                <p className="text-xs font-semibold text-[#826754]">Overall Progress</p>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#9E5A1C]">
                  {order.workingProcess?.progressPercent || 25}%
                </p>
                <p className="text-[11px] text-[#A68F7A]">
                  Est. Completion: {order.workingProcess?.estimatedDeliveryDate || "10–14 Days"}
                </p>
              </div>
            </div>

            {/* Visual Working Process Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EBDCC8] shadow-lg space-y-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#291811]">
                  Live Carpentry Stage Tracker
                </h3>
                <p className="text-xs text-[#826754] mt-0.5">
                  Current Stage: <span className="font-bold text-[#9E5A1C]">{order.workingProcess?.currentStageLabel || "Advance Verified & Wood Allocation"}</span>
                </p>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full bg-[#FAF3E7] h-3 rounded-full overflow-hidden border border-[#EBDCC8]">
                <div
                  className="h-full bg-gradient-to-r from-[#F0A35C] to-[#9E5A1C] rounded-full transition-all duration-700"
                  style={{ width: `${order.workingProcess?.progressPercent || 25}%` }}
                />
              </div>

              {/* Step Icons & Labels */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {STAGES.map((stage, index) => {
                  const Icon = stage.icon;
                  const currentIndex = getStageIndex(order.workingProcess?.currentStage);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div
                      key={stage.id}
                      className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-between gap-2 ${
                        isCurrent
                          ? "bg-[#FAF3E7] border-[#C9873F] shadow-md ring-2 ring-[#C9873F]/30"
                          : isCompleted
                          ? "bg-white border-emerald-300 text-[#291811]"
                          : "bg-[#FCF9F4] border-[#EBDCC8]/60 text-gray-400 opacity-60"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isCurrent
                            ? "bg-[#C9873F] text-[#1C130D] animate-bounce"
                            : isCompleted
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-[#ECE2D5] text-[#A68F7A]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold leading-snug">
                          {stage.label}
                        </p>
                        <p className="text-[10px] mt-1 text-[#826754]">
                          {isCurrent ? "In Progress" : isCompleted ? "Completed ✔" : "Upcoming"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Workshop Carpenter Notes */}
              {order.workingProcess?.workshopNotes && (
                <div className="p-5 rounded-2xl bg-[#FAF3E7] border border-[#C9873F]/30 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white text-[#9E5A1C] shadow-sm shrink-0 mt-0.5">
                    <Hammer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#291811]">
                      Master Carpenter Note
                    </h4>
                    <p className="text-xs sm:text-sm text-[#735A47] mt-1 leading-relaxed">
                      "{order.workingProcess.workshopNotes}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items & Financials */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Items */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#EBDCC8] shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#291811] pb-2 border-b border-[#F0E6D8]">
                  Ordered Woodwork Pieces ({order.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-3 bg-[#FAF6F0] rounded-2xl border border-[#EBDCC8]">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl bg-white border"
                          />
                        )}
                        <div>
                          <p className="text-sm font-bold text-[#291811] capitalize">{item.name}</p>
                          <p className="text-[11px] text-[#826754]">{item.material || "100% Solid Teak"}</p>
                        </div>
                      </div>
                      <span className="font-serif text-sm font-bold text-[#1C130D]">
                        ₹{Number(item.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#EBDCC8] shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#291811] pb-2 border-b border-[#F0E6D8]">
                  Payment & Delivery Breakdown
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm text-[#735A47]">
                  <div className="flex justify-between">
                    <span>Total Order Value:</span>
                    <span className="font-bold text-[#291811]">₹{Number(order.totalAmount || order.total || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Advance Paid (via UPI):</span>
                    <span>₹{Number(order.advancePaid || order.advance || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#9E5A1C] pt-2 border-t border-[#F0E6D8]">
                    <span>Balance on Delivery:</span>
                    <span className="font-serif text-base">
                      ₹{Number((order.totalAmount || order.total || 0) - (order.advancePaid || order.advance || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0E6D8] space-y-1 text-xs text-[#826754]">
                  <p><span className="font-semibold text-[#291811]">UPI Reference:</span> {order.upiRefNo || "Registered"}</p>
                  <p><span className="font-semibold text-[#291811]">Delivery Address:</span> {order.customer?.address}</p>
                  <p><span className="font-semibold text-[#291811]">Contact Phone:</span> +91 {order.customer?.phone}</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default OrderTracking;

import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import api from "../api/api";
import {
  ShieldCheck,
  QrCode,
  Smartphone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShoppingBag,
  Loader2,
  Lock,
} from "lucide-react";

// Master Workshop UPI details
const UPI_ID = "7094297761@upi";
const PAYEE_NAME = "Solaimalai Wood Works";

function buildUpiLink(amount, note) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: amount > 0 ? amount.toFixed(2) : "1.00",
    cu: "INR",
    tn: note || "Advance for custom solid wood order - Solaimalai Wood Works",
  });
  return `upi://pay?${params.toString()}`;
}

function Checkout() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = useMemo(
    () => cart.reduce((sum, p) => sum + Number(p.price || 0), 0),
    [cart]
  );

  const suggestedAdvance = Math.round(total * 0.2) || 500;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    notes: "",
  });
  const [advance, setAdvance] = useState(suggestedAdvance);
  const [upiRefNo, setUpiRefNo] = useState("");
  const [paymentClicked, setPaymentClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const upiLink = buildUpiLink(
    advance,
    `Advance for ${form.name || "Customer"} - Solaimalai Wood Works`
  );

  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    upiLink
  )}`;

  const handleGPayClick = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your Full Name & Phone Number first!");
      return;
    }
    if (!advance || advance <= 0) {
      setError("Please enter a valid advance amount!");
      return;
    }
    setError("");
    setPaymentClicked(true);
    // Deep-link to open UPI app on mobile devices
    window.location.href = upiLink;
  };

  const handleConfirmOrder = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Please fill in Name, Phone Number, and Delivery Address!");
      return;
    }

    if (!upiRefNo.trim()) {
      setError(
        "⚠️ Advance payment is mandatory. Please pay via UPI and enter your UPI Transaction Reference / UTR Number below to verify booking!"
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Submit order to Node/MongoDB backend
      const res = await api.post("/orders", {
        customer: form,
        items: cart,
        totalAmount: total,
        advancePaid: advance,
        upiRefNo: upiRefNo.trim(),
      });

      const orderData = res.data.order;

      // Clear local cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage"));

      // Redirect to Order Tracking with live order ID
      navigate(`/tracking?orderId=${orderData.orderId}`);
    } catch (err) {
      console.error("Order submission error:", err);
      // If offline/backend issue, save locally and direct
      const localId = "SWW-" + Math.floor(100000 + Math.random() * 900000);
      const fallbackOrder = {
        orderId: localId,
        customer: form,
        items: cart,
        totalAmount: total,
        advancePaid: advance,
        upiRefNo: upiRefNo.trim(),
        paymentStatus: "Advance_Pending",
        workingProcess: {
          currentStage: "Advance_Received",
          currentStageLabel: "Advance Paid & Order Placed",
          progressPercent: 15,
          workshopNotes: "Order registered. Workshop carpenter will verify UPI advance.",
        },
      };

      const oldOrders = JSON.parse(localStorage.getItem("orders")) || [];
      localStorage.setItem("orders", JSON.stringify([...oldOrders, fallbackOrder]));
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage"));

      navigate(`/tracking?orderId=${localId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#291811] flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-[#EBDCC8]">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#291811]">
            Order Checkout & Advance Booking
          </h1>
          <p className="text-xs sm:text-sm text-[#826754] mt-1">
            Pay advance via UPI / GPay (`{UPI_ID}`) to start custom woodwork carpentry.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#EBDCC8] p-8 max-w-lg mx-auto shadow-sm">
            <ShoppingBag className="w-12 h-12 text-[#C9873F] mx-auto mb-3" />
            <h2 className="font-serif text-xl font-bold">No Items in Cart</h2>
            <p className="text-xs text-[#826754] mt-1 mb-5">Your cart is currently empty.</p>
            <Link
              to="/product"
              className="px-6 py-2.5 rounded-full font-bold text-xs bg-[#C9873F] text-[#1C130D]"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Details & Items */}
            <div className="lg:col-span-7 space-y-6">
              {/* Order Items Preview */}
              <div className="bg-white rounded-3xl p-6 border border-[#EBDCC8] shadow-sm">
                <h2 className="font-serif text-lg font-bold text-[#291811] mb-4 pb-2 border-b border-[#F0E6D8] flex items-center justify-between">
                  <span>Selected Furniture ({cart.length})</span>
                  <Link
                    to="/cart"
                    className="text-xs text-[#C9873F] hover:underline font-sans font-semibold"
                  >
                    Edit Cart
                  </Link>
                </h2>

                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-[#291811] capitalize">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#826754]">
                            {item.material || "100% Solid Teak"}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#1C130D]">
                        ₹{Number(item.price).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-[#F0E6D8] flex justify-between font-bold text-sm text-[#291811]">
                    <span>Total Value:</span>
                    <span className="font-serif text-lg text-[#1C130D]">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Details Form */}
              <div className="bg-white rounded-3xl p-6 border border-[#EBDCC8] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#291811] pb-2 border-b border-[#F0E6D8]">
                  Delivery & Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6E4F39] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Nanthakumar"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-sm outline-none focus:border-[#C9873F] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6E4F39] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-sm outline-none focus:border-[#C9873F] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6E4F39] mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    placeholder="House / Street / City / Landmark"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-sm outline-none focus:border-[#C9873F] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6E4F39] mb-1">
                    Custom Wood Stain / Dimension Notes (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="e.g. Natural Teak Polish, Door size 7x3.5 ft"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-sm outline-none focus:border-[#C9873F] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Advance UPI Payment */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBDCC8] shadow-lg sticky top-28 text-center space-y-5">
                <div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C9873F]/15 text-[#9E5A1C] text-[11px] font-semibold uppercase tracking-wider mb-2">
                    <QrCode className="w-3.5 h-3.5" />
                    Direct UPI Advance Payment
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#291811]">
                    Pay Advance with GPay / PhonePe
                  </h2>
                  <p className="text-xs text-[#826754] mt-0.5">
                    UPI ID: <span className="font-mono font-bold text-[#1C130D]">{UPI_ID}</span>
                  </p>
                </div>

                {/* Advance Amount Selector */}
                <div className="p-3.5 bg-[#FAF3E7] rounded-2xl border border-[#EBDCC8] inline-flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#6E4F39]">Advance (₹):</span>
                  <input
                    type="number"
                    min="100"
                    value={advance}
                    onChange={(e) => setAdvance(Number(e.target.value))}
                    className="w-28 text-center font-bold text-base px-2 py-1 bg-white border border-[#C9873F]/40 rounded-lg outline-none focus:ring-2 focus:ring-[#C9873F]"
                  />
                </div>

                {/* QR Code Container */}
                <div className="flex justify-center">
                  <div className="p-3 bg-white border-2 border-[#C9873F]/40 rounded-2xl shadow-md inline-block">
                    <img
                      src={qrImage}
                      alt="UPI QR Code"
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGPayClick}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-[#1C130D] bg-gradient-to-r from-[#F0A35C] to-[#C9873F] hover:brightness-110 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Open UPI / GPay App on Mobile</span>
                  </button>

                  {/* Mandatory UTR / UPI Ref Input */}
                  <div className="text-left bg-[#FAF6F0] p-4 rounded-2xl border border-[#E0D0BC] space-y-1.5">
                    <label className="block text-xs font-bold text-[#291811]">
                      UPI Transaction Ref / UTR Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 423985721901 (from your GPay/PhonePe receipt)"
                      value={upiRefNo}
                      onChange={(e) => {
                        setUpiRefNo(e.target.value);
                        if (error) setError("");
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#C9873F]/50 rounded-xl text-xs sm:text-sm font-mono outline-none focus:ring-2 focus:ring-[#C9873F]"
                    />
                    <p className="text-[11px] text-[#826754]">
                      Pay advance to <span className="font-semibold text-[#1C130D]">{UPI_ID}</span>, then enter the 12-digit UTR / Reference ID above.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2 text-left">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Final Confirm Button */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleConfirmOrder}
                  className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-[#1C130D] hover:bg-[#301c12] shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F0A35C]" />
                      <span>Submitting Order to Workshop...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#F0A35C]" />
                      <span>Confirm & Track Live Woodwork</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#A68F7A]">
                  🔒 Direct order with Solaimalai Wood Works. Balance payable upon delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Checkout;

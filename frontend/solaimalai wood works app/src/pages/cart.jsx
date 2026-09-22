import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus, ArrowLeft } from "lucide-react";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCartState = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const removeProduct = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCartState(newCart);
  };

  const clearCart = () => {
    updateCartState([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const estimatedAdvance = Math.round(subtotal * 0.2);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#291811] flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#EBDCC8]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#291811]">
              Your Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-[#826754] mt-1">
              Review your customized solid teak furniture selections
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-600 hover:text-red-800 transition flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#EBDCC8] p-8 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F4ECE1] text-[#C9873F] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#291811]">
              Your Cart is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#826754] mt-2 mb-6">
              Looks like you haven't added any handcrafted wood furniture yet.
            </p>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-[#1C130D] bg-gradient-to-r from-[#F0A35C] to-[#C9873F] hover:brightness-110 shadow-md transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EBDCC8] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-center gap-5"
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-28 h-28 bg-[#F5EFE6] rounded-xl overflow-hidden shrink-0 border border-[#EBDCC8]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C9873F]">
                      {product.category || "Solid Teak Wood"}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#291811] capitalize">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#826754] mt-0.5">
                      {product.material || "Custom Seasoned Teak"}
                    </p>
                    <p className="font-serif text-lg font-bold text-[#1C130D] mt-2">
                      ₹{Number(product.price).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => removeProduct(index)}
                      className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  to="/product"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E5A1C] hover:text-[#C9873F] transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping for More Designs</span>
                </Link>
              </div>
            </div>

            {/* Right: Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBDCC8] shadow-md sticky top-28 space-y-5">
                <h2 className="font-serif text-xl font-bold text-[#291811] pb-3 border-b border-[#F0E6D8]">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs sm:text-sm text-[#735A47]">
                  <div className="flex justify-between">
                    <span>Items Subtotal ({cart.length})</span>
                    <span className="font-semibold text-[#291811]">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Hand-Polishing & Fitting</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Custom Wood Protection Coat</span>
                    <span className="font-semibold text-emerald-600">Included</span>
                  </div>

                  <div className="pt-3 border-t border-[#F0E6D8] flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-bold text-[#291811]">Total Value</span>
                      <p className="text-[11px] text-[#A68F7A]">Full payment on delivery</p>
                    </div>
                    <span className="font-serif text-2xl font-bold text-[#1C130D]">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF3E7] rounded-xl border border-[#EBDCC8] text-xs text-[#8B5A35] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#C9873F]" />
                    <span>Pay only 20% advance (₹{estimatedAdvance.toLocaleString()}) via UPI to start carpentry.</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-[#1C130D] bg-gradient-to-r from-[#F0A35C] via-[#C9873F] to-[#E0A05A] hover:brightness-110 shadow-lg shadow-[#C9873F]/25 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default Cart;
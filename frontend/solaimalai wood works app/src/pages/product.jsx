import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import api, { getImageUrl } from "../api/api";
import { ShoppingBag, CheckCircle2, Sparkles, Filter, Eye, ArrowRight, Loader2 } from "lucide-react";

const fallbackProducts = [
  {
    _id: "1",
    name: "Royal Teakwood Dining Chair",
    category: "Chairs",
    price: 25000,
    material: "First Grade Solid Teak",
    image: "https://i.etsystatic.com/38749849/r/il/75f2f9/6031313505/il_fullxfull.6031313505_brtd.jpg",
    tag: "Bestseller",
  },
  {
    _id: "2",
    name: "Luxury Solid Wood Sofa Set",
    category: "Sofas",
    price: 65000,
    material: "Seasoned Teak + Cushioned Fabric",
    image: "https://i.pinimg.com/originals/6e/be/3b/6ebe3b679bb0ea7630a2db1f924da32b.jpg",
    tag: "Artisanal",
  },
  {
    _id: "3",
    name: "Grand Traditional Teak Bero / Wardrobe",
    category: "Wardrobes",
    price: 48000,
    material: "100% Solid Teak with Brass Fittings",
    image: "https://5.imimg.com/data5/ANDROID/Default/2022/8/KX/WS/IE/76698605/product-jpeg-1000x1000.jpg",
    tag: "Heavy Duty",
  },
  {
    _id: "4",
    name: "Carved Teak Dressing Table with Mirror",
    category: "Tables",
    price: 28000,
    material: "Hand-Carved Teakwood Finish",
    image: "https://i.ytimg.com/vi/Ovni-EX7WlU/maxresdefault.jpg",
    tag: "Custom Made",
  },
  {
    _id: "5",
    name: "Ornate Hand-Carved Entrance Door",
    category: "Doors",
    price: 42000,
    material: "Pure Teakwood Traditional Carving",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    tag: "Temple & Home",
  },
  {
    _id: "6",
    name: "Handcrafted Teak Center Coffee Table",
    category: "Tables",
    price: 18500,
    material: "Natural Wood Grain Polish",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    tag: "Modern Heritage",
  },
];

const categories = ["All", "Chairs", "Sofas", "Wardrobes", "Tables", "Doors"];

function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("API error loading products, using defaults:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product, redirectToCart = false) => {
    const oldCart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCart = [...oldCart, product];
    localStorage.setItem("cart", JSON.stringify(newCart));

    // Notify other components like navbar
    window.dispatchEvent(new Event("storage"));

    setAddedItem(product.name);
    setTimeout(() => setAddedItem(null), 2500);

    if (redirectToCart) {
      navigate("/cart");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#291811] flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-[#1C130D] text-[#F3E9D8] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#C9873F]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9873F]/20 text-[#F0A35C] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Handcrafted Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F3E9D8]">
            Masterpiece Wood Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#D4C3AC] max-w-xl mx-auto mt-2">
            Every piece is built to order using genuine solid teak wood, dried and seasoned for lifelong stability.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        
        {/* Toast Notification */}
        {addedItem && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1C130D] text-white border border-[#C9873F] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-sm text-[#F3E9D8]">Added to Cart!</p>
              <p className="text-xs text-[#D4C3AC]">{addedItem}</p>
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="ml-3 px-3 py-1 rounded-lg bg-[#C9873F] text-[#1C130D] text-xs font-bold hover:bg-[#E0A05A] transition cursor-pointer"
            >
              View Cart
            </button>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-[#EBDCC8]">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-[#9E5A1C] shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#C9873F] text-[#1C130D] shadow-md shadow-[#C9873F]/25"
                    : "bg-[#F4ECE1] text-[#6E4F39] hover:bg-[#EAE0D3]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-xs text-[#826754] font-medium">
            Showing <span className="font-bold text-[#291811]">{filteredProducts.length}</span> handcrafted items
          </p>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#C9873F] mx-auto" />
            <p className="text-xs text-[#826754] mt-2">Loading catalog from database...</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#EBDCC8] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-[#F5EFE6] overflow-hidden">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                
                {/* Tag Badge */}
                {product.tag && (
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#1C130D]/80 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-[#F0A35C] border border-[#C9873F]/40 shadow-sm">
                    {product.tag}
                  </span>
                )}

                {/* Category Pill */}
                <span className="absolute bottom-3.5 right-3.5 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[11px] font-semibold text-[#6E4F39] shadow-sm">
                  {product.category}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#291811] group-hover:text-[#9E5A1C] transition duration-200 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#826754] mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9873F]" />
                    {product.material || "100% Solid Teak Wood"}
                  </p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-serif text-[#1C130D]">
                      ₹{Number(product.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-[#826754]">Incl. Custom Polish</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#F0E6D8]">
                  <button
                    onClick={() => handleAddToCart(product, false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#C9873F]/60 text-[#9E5A1C] hover:bg-[#F4ECE1] text-xs font-semibold transition cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => handleAddToCart(product, true)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#F0A35C] to-[#C9873F] text-[#1C130D] hover:brightness-110 text-xs font-bold shadow-md shadow-[#C9873F]/20 transition cursor-pointer"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Product;

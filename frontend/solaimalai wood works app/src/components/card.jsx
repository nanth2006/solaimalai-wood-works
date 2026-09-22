import { ShoppingBag } from "lucide-react";

function Card({ product, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#EBDCC8] shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
      <div className="w-full h-40 bg-[#FAF6F0] rounded-xl overflow-hidden mb-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title || product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#826754]">
            No Image
          </div>
        )}
      </div>

      <div>
        <h3 className="font-serif text-lg font-bold text-[#291811]">
          {product.title || product.name}
        </h3>
        <p className="text-xs text-[#735A47] mt-1 line-clamp-2">
          {product.description || "100% Seasoned Solid Teak"}
        </p>
        <p className="font-serif text-xl font-bold text-[#1C130D] mt-3">
          ₹{Number(product.price || 0).toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => onAddToCart && onAddToCart(product)}
        className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F0A35C] to-[#C9873F] text-[#1C130D] text-xs font-bold shadow-sm hover:brightness-110 transition flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}

export default Card;
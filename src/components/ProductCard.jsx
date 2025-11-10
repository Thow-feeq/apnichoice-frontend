import React from "react";
import { useAppContext } from "../context/AppContext";
import { FaStar, FaCartPlus, FaMinus, FaPlus, FaEye } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  const handleClick = () => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    scrollTo(0, 0);
  };

  const rating = product.rating || 4.2;

  return product && (
    <div
      onClick={handleClick}
      className="group relative rounded-xl overflow-hidden border border-[#b30000]/40 bg-white max-w-xs w-full cursor-pointer shadow-md hover:shadow-2xl transform transition-all duration-500 hover:scale-105"
    >
      {/* Maroon Gradient Background on hover */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#800000] via-[#b30000] to-[#ff4d4d] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl" />

      {/* Offer badge with pulse */}
      <div className="absolute top-3 left-3 bg-[#800000] text-white text-xs font-semibold px-3 py-1 rounded-full z-20 shadow-lg select-none animate-pulse">
        OFF: {currency}{product.offerPrice}
      </div>

      {/* Out of stock overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 bg-gray-300/60 z-30 rounded-xl flex justify-center items-center pointer-events-none">
          <div className="bg-black text-white px-5 py-2 rounded text-sm font-semibold shadow-lg uppercase tracking-widest">
            Out of Stock
          </div>
        </div>
      )}

      {/* Product Image */}
      <img
        src={product?.images?.[0] || "/placeholder.png"}
        alt={product.name}
        className="relative z-10 w-full h-52 object-contain transition-transform duration-500 group-hover:scale-110"
      />

      {/* Quick View Button */}
      <button
        onClick={e => { e.stopPropagation(); alert("Quick view not implemented."); }}
        className="absolute bottom-20 right-4 z-30 bg-[#800000] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:bg-[#b30000]"
        aria-label="Quick View"
      >
        <FaEye />
      </button>

      {/* Info Section */}
      <div className="p-5 flex flex-col space-y-2 relative z-10">
        <p className="text-xs text-[#b30000] font-semibold uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-xl truncate text-gray-900">{product.name}</h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`text-sm ${i < Math.floor(rating) ? "text-[#ff4d4d]" : "text-gray-300"}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">({rating.toFixed(1)})</span>
        </div>

        {/* Price & Savings */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold text-[#b30000]">{currency}{product.offerPrice}</span>
          <span className="line-through text-gray-400 text-sm">{currency}{product.price}</span>
          <span className="text-sm text-green-600 font-semibold">
            Save {currency}{(product.price - product.offerPrice).toFixed(2)}
          </span>
        </div>

        {/* Add to Cart / Quantity Selector */}
        <div onClick={e => e.stopPropagation()} className="mt-auto">
          {!cartItems?.[product._id] ? (
            <button
              onClick={() => addToCart(product._id)}
              disabled={!product.inStock}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition 
                ${product.inStock
                  ? "bg-[#800000] text-white hover:bg-[#b30000] shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <FaCartPlus />
              Add to cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#ffebeb]/40 rounded-full px-3 py-1 shadow-inner">
              <button
                onClick={() => removeFromCart(product._id)}
                className="text-[#b30000] font-bold px-4 py-1 rounded-full hover:bg-[#ffd6d6] transition"
              >
                <FaMinus />
              </button>
              <span className="font-semibold text-[#800000]">{cartItems[product._id]}</span>
              <button
                onClick={() => addToCart(product._id)}
                disabled={!product.inStock}
                className={`text-[#b30000] font-bold px-4 py-1 rounded-full hover:bg-[#ffd6d6] transition ${!product.inStock ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <FaPlus />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

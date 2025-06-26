import React from "react";
import { useAppContext } from "../context/AppContext";
import { FaStar, FaCartPlus, FaMinus, FaPlus, FaEye } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  const handleClick = () => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    scrollTo(0, 0);
  };

  // Fake rating for demo (you can replace with actual rating)
  const rating = product.rating || 4.2;

  return product && (
    <div
      onClick={handleClick}
      className="group relative rounded-xl overflow-hidden border border-gray-300 bg-white max-w-xs w-full cursor-pointer shadow-md hover:shadow-2xl transform transition-all duration-500 hover:scale-105"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-500 via-pink-500 to-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl" />

      {/* Offer price badge with pulse animation */}
      <div className="absolute top-3 left-3 bg-purple-700 text-white text-xs font-semibold px-3 py-1 rounded-full z-20 shadow-lg select-none animate-pulse">
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

      {/* Image with zoom */}
      <img
        src={product.image[0]}
        alt={product.name}
        className="relative z-10 w-full h-52 object-contain transition-transform duration-500 group-hover:scale-110"
      />

      {/* Quick View Button (on hover) */}
      <button
        onClick={e => { e.stopPropagation(); alert("Quick view not implemented."); }}
        className="absolute bottom-20 right-4 z-30 bg-purple-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:bg-purple-800"
        aria-label="Quick View"
      >
        <FaEye />
      </button>

      {/* Info Section */}
      <div className="p-5 flex flex-col space-y-2 relative z-10">
        <p className="text-xs text-purple-700 font-semibold uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-xl truncate text-gray-900">{product.name}</h3>

        {/* Rating stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`text-sm ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">({rating.toFixed(1)})</span>
        </div>

        {/* Price with discount */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold text-purple-700">{currency}{product.offerPrice}</span>
          <span className="line-through text-gray-400 text-sm">{currency}{product.price}</span>
          <span className="text-sm text-green-600 font-semibold">
            Save {currency}{(product.price - product.offerPrice).toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Section */}
        <div onClick={e => e.stopPropagation()} className="mt-auto">
          {!cartItems?.[product._id] ? (
            <button
              onClick={() => addToCart(product._id)}
              disabled={!product.inStock}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition 
                ${product.inStock
                  ? "bg-purple-700 text-white hover:bg-purple-800 shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <FaCartPlus />
              Add to cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-purple-100 rounded-full px-3 py-1 shadow-inner">
              <button
                onClick={() => removeFromCart(product._id)}
                className="text-purple-700 font-bold px-4 py-1 rounded-full hover:bg-purple-200 transition"
              >
                <FaMinus />
              </button>
              <span className="font-semibold text-purple-900">{cartItems[product._id]}</span>
              <button
                onClick={() => addToCart(product._id)}
                disabled={!product.inStock}
                className={`text-purple-700 font-bold px-4 py-1 rounded-full hover:bg-purple-200 transition ${!product.inStock ? "cursor-not-allowed opacity-50" : ""}`}
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

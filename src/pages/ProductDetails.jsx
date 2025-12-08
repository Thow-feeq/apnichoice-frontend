import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  const product = products.find((p) => p._id === id);

  useEffect(() => {
    if (!product) return;
    setThumbnail(product.images?.[0] || null);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const filtered = products.filter(
      (item) => item.category === product.category && item._id !== product._id
    );
    setRelatedProducts(filtered.slice(0, 14));
  }, [product, products]);

  if (!product) {
    return (
      <p className="text-center mt-20 text-lg text-gray-500">
        Product not found.
      </p>
    );
  }

  const selectedColor = product.variants[selectedColorIndex];
  const sizes = selectedColor?.sizes || [];

  // ✔ Total quantity across all variants
  const totalStock = product.variants.reduce(
    (sum, v) => sum + v.sizes.reduce((s, sz) => s + sz.quantity, 0),
    0
  );

  // ✔ Combine Admin toggle + total size qty
  const isAdminDisabled = product?.inStock === false;
  const isOutOfStock = isAdminDisabled || totalStock <= 0;

  const selectedSizeObj =
    selectedColor?.sizes?.find((s) => s.size === selectedSize) || null;
  const selectedSizeQty = selectedSizeObj?.quantity || 0;

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select size");
    if (selectedSizeQty <= 0) return;
    addToCart(product._id, {
      color: selectedColor.colorName,
      size: selectedSize,
    });
  };

  return (
    <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-26 ml-6">
      <p className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-[#800000]">Home</Link> /
        <Link to="/products" className="hover:text-[#800000]"> Products</Link> /
        <span className="text-[#b30000] font-medium">{product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-24">
        {/* IMAGES */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {(selectedColor?.images?.length ? selectedColor.images : product.images).map((img, i) => (
              <div
                key={i}
                onClick={() => setThumbnail(img)}
                className="border max-w-24 border-[#b30000]/30 rounded overflow-hidden cursor-pointer"
              >
                <img src={img} alt="thumb" />
              </div>
            ))}
          </div>

          <div className="border border-[#b30000]/30 max-w-100 rounded overflow-hidden">
            <img
              src={thumbnail}
              alt="main"
              className="transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-zoom-in"
            />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium flex items-center gap-3 flex-wrap">
            {product.name}
          </h1>

          {/* Prices */}
          <div className="mt-6">
            <p className="text-gray-500/70 line-through">
              MRP: {currency}{product.price}
            </p>
            <p className="text-2xl font-medium text-[#800000]">
              MRP: {currency}{product.offerPrice}
            </p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          {/* Stock Status */}
          <p
            className={`mt-4 font-semibold ${
              isOutOfStock ? "text-red-600" : "text-[#b30000]"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </p>

          {/* Colors */}
          <p className="text-base font-medium mt-6">Color</p>
          <div className="flex gap-3 mt-2">
            {product.variants.map((v, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedColorIndex(i);
                  setSelectedSize(null);
                  setThumbnail(v.images?.[0] || product.images[0]);
                }}
                className={`w-8 h-8 rounded-full border ${
                  selectedColorIndex === i
                    ? "border-[#800000]"
                    : "border-[#b30000]/50"
                }`}
                style={{ backgroundColor: v.colorCode }}
              />
            ))}
          </div>

          {/* Sizes */}
          <p className="text-base font-medium mt-6">Size</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {sizes.map((s, i) => (
              <button
                key={i}
                onClick={() => s.quantity > 0 && setSelectedSize(s.size)}
                disabled={s.quantity <= 0 || isAdminDisabled}
                className={`px-4 py-2 border rounded ${
                  s.quantity <= 0 || isAdminDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                    : selectedSize === s.size
                    ? "bg-[#800000] text-white"
                    : "hover:bg-[#b30000]/10"
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || !selectedSize || selectedSizeQty <= 0}
              className={`w-full py-3.5 font-medium transition ${
                isOutOfStock || selectedSizeQty <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#ffebeb] text-[#800000] hover:bg-[#ffd6d6]"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                handleAddToCart();
                navigate("/cart");
              }}
              disabled={isOutOfStock || !selectedSize || selectedSizeQty <= 0}
              className={`w-full py-3.5 font-medium transition ${
                isOutOfStock || selectedSizeQty <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#800000] text-white hover:bg-[#b30000]"
              }`}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

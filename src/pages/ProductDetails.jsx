import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const related = products.filter(
        (item) => product.category === item.category && item._id !== product._id
      );
      setRelatedProducts(related.slice(0, 14));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image[0] || null);
  }, [product]);

  if (!product) {
    return <p className="text-center mt-20 text-lg text-gray-500">Product not found.</p>;
  }

  const isOutOfStock = !product.inStock;

  return (
    <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-26 ml-6">
      {/* Breadcrumbs */}
      <p className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-primary">Home</Link> /
        <Link to="/products" className="hover:text-primary"> Products</Link> /
        <Link to={`/products/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary">
          {product.category}
        </Link> /
        <span className="text-primary font-medium">{product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-24">
        {/* Images */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.image.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
            <img
              src={thumbnail}
              alt="Selected product"
              className="transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-zoom-in"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium flex items-center gap-3 flex-wrap">
            {product.name}
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
              ⏱️ Get it in 30 mins
            </span>
          </h1>

          <div className="flex items-center gap-0.5 mt-1">
            {Array(5).fill("").map((_, i) => (
              <img
                key={i}
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt=""
                className="md:w-4 w-3.5"
              />
            ))}
            <p className="text-base ml-2">(4)</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
            <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <p className={`mt-4 font-semibold ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </p>

          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {product.description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>

          {/* Product Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              ✅ <span>Non-Returnable</span>
            </div>
            <div className="flex items-center gap-2">
              🚚 <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              ⭐ <span>Top Brand</span>
            </div>
            <div className="flex items-center gap-2">
              🔒 <span>Secure transaction</span>
            </div>
          </div>

          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={() => addToCart(product._id)}
              disabled={isOutOfStock}
              className={`w-full py-3.5 font-medium transition ${isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                }`}
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              disabled={isOutOfStock}
              className={`w-full py-3.5 font-medium transition ${isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-dull cursor-pointer"
                }`}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="flex flex-col items-center mt-20 w-full relative">
        <div className="flex flex-col items-center w-max mb-4">
          <p className="text-3xl font-medium">Related Products</p>
          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>

        <div className="relative w-full px-4 md:px-10">
          {/* Left Arrow */}
          <button
            onClick={() => {
              document.getElementById("related-slider").scrollBy({ left: -300, behavior: "smooth" });
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-300 shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
          >
            ‹
          </button>

          {/* Scrollable list */}
          <div
            id="related-slider"
            className="flex overflow-x-auto no-scrollbar scroll-smooth gap-4 py-4 px-6"
          >
            {relatedProducts.map((product, index) => (
              <div key={product._id || index} className="min-w-[180px] max-w-[180px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => {
              document.getElementById("related-slider").scrollBy({ left: 300, behavior: "smooth" });
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-300 shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
          >
            ›
          </button>
        </div>

        {/* See more */}
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

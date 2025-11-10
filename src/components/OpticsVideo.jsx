import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; // Correct path to assets.js

// Left banner categories: main textile categories
const leftCategories = [
  { title: "Menswear", url: "menswear", image: assets.textile_one },
  { title: "Womenswear", url: "womenswear", image: assets.textile_two },
  { title: "Kidswear", url: "kidswear", image: assets.textile_three },
  { title: "Ethnic Wear", url: "ethnic-wear", image: assets.textile_one },
];

// Right banner categories: accessories & fabric add-ons
const rightCategories = [
  { title: "Silk Fabrics", url: "silk-fabrics", image: assets.textile_two },
  { title: "Cotton Fabrics", url: "cotton-fabrics", image: assets.textile_three },
  { title: "Linen Fabrics", url: "linen-fabrics", image: assets.textile_one },
  { title: "Buttons & Embellishments", url: "buttons-embellishments", image: assets.textile_two },
  { title: "Threads & Trims", url: "threads-trims", image: assets.textile_three },
  { title: "Exclusive Prints", url: "exclusive-prints", image: assets.textile_one },
];

const TextileShowcaseSection = () => {
  const navigate = useNavigate();
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 200;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Optional autoplay scroll
  useEffect(() => {
    const interval = setInterval(() => {
      scroll(leftScrollRef, "right");
      scroll(rightScrollRef, "left");
    }, 6000); // every 6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-24 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Banner */}
        <div className="w-full md:w-1/2 bg-green-900/90 text-white rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Gradient overlays */}
          <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-green-900/60 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-green-900/60 to-transparent z-10 pointer-events-none"></div>

          <div className="relative z-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Premium Textile Collections</h2>
            <p className="text-lg md:text-xl font-medium mb-6">High-quality fabrics for every occasion</p>
          </div>

          <div className="relative mb-6">
            <button
              onClick={() => scroll(leftScrollRef, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-20"
            >
              &#8592;
            </button>

            <div
              ref={leftScrollRef}
              className="scrollbar-hide overflow-x-auto flex gap-4 snap-x snap-mandatory px-6 scroll-smooth"
            >
              {leftCategories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/products/${cat.url}`)}
                  className="min-w-[100px] h-28 bg-green-800 rounded-xl cursor-pointer snap-center flex flex-col items-center justify-center hover:scale-105 hover:shadow-xl transition transform duration-300"
                >
                  <img src={cat.image} alt={cat.title} className="w-12 h-12 object-cover mb-2 rounded-full" />
                  <span className="text-xs font-semibold text-center">{cat.title}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll(leftScrollRef, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-20"
            >
              &#8594;
            </button>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-green-500 to-green-400 text-white font-bold px-6 py-2 rounded-full hover:opacity-90 transition self-start text-sm"
          >
            Explore Fabrics
          </button>
        </div>

        {/* Right Banner */}
        <div className="w-full md:w-1/2 bg-yellow-50 text-gray-800 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-yellow-100/70 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-yellow-100/70 to-transparent z-10 pointer-events-none"></div>

          <div className="relative z-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-yellow-700">Textile Accessories</h2>
            <p className="text-lg md:text-xl font-medium mb-6">Everything you need for your custom designs</p>
          </div>

          <div className="relative mb-6">
            <button
              onClick={() => scroll(rightScrollRef, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-20"
            >
              &#8592;
            </button>

            <div
              ref={rightScrollRef}
              className="scrollbar-hide overflow-x-auto flex gap-4 snap-x snap-mandatory px-6 scroll-smooth"
            >
              {rightCategories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/products/${cat.url}`)}
                  className="min-w-[100px] h-28 bg-white rounded-xl border border-yellow-200 cursor-pointer snap-center flex flex-col items-center justify-center hover:scale-105 hover:shadow-xl transition transform duration-300"
                >
                  <img src={cat.image} alt={cat.title} className="w-12 h-12 object-cover mb-2 rounded-full" />
                  <span className="text-xs font-semibold text-center">{cat.title}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll(rightScrollRef, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-20"
            >
              &#8594;
            </button>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold px-6 py-2 rounded-full hover:opacity-90 transition self-start text-sm"
          >
            Browse Accessories
          </button>
        </div>

      </div>
    </section>
  );
};

export default TextileShowcaseSection;

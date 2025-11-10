import React from 'react';
import { assets } from '../assets/assets';

// Textile categories — replace with your actual textile images
const categories = [
  {
    title: "Mens Wear",
    image: assets.textile_one, // replace with your textile image
    url: "/products/menswear",
  },
  {
    title: "Womens Wear",
    image: assets.textile_two,
    url: "/products/womenswear",
  },
  {
    title: "Kids Wear",
    image: assets.kidswear_one,
    url: "/products/kidswear",
  },
  {
    title: "Ethnic Wear",
    image: assets.womenswear_one,
    url: "/products/ethnicwear",
  },
];

const ShopByCategory = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-12 sm:mt-16 max-w-screen-2xl mx-auto px-4">
      
      {/* Section Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900">Shop by Textile Category</h2>
        <p className="mt-2 text-gray-600 text-lg">Explore premium fabrics and trending fashion styles</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {categories.map((cat, index) => (
          <a
            key={index}
            href={cat.url}
            className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:-translate-y-2 hover:scale-105"
          >
            {/* Category Image */}
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition duration-500" />

            {/* Category Title */}
            <div className="absolute bottom-4 left-4 text-white text-lg md:text-xl font-semibold z-10 drop-shadow-lg">
              {cat.title}
            </div>

            {/* Optional "Shop Now" badge */}
            <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs px-2 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition">
              Shop Now
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;

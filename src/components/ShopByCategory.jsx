import React from 'react';
import { assets } from '../assets/assets';

// Category data — use correct paths from assets
const categories = [
  {
    title: "Bluetooth Neckband",
    image: assets.blu_neck_cat_1,
    url: "/products/bluetooth-neckband",
  },
  {
    title: "CC Board",
    image: assets.cc_board_cat_1,
    url: "/products/cc-board",
  },
  {
    title: "Ear Buds",
    image: assets.ear_bud_cat_1,
    url: "/products/earbuds",
  },
  {
    title: "Mobile Stand",
    image: assets.car_mob_cat_1,
    url: "/products/mobile-stand",
  }
];

const ShopByCategory = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-12 sm:mt-16 max-w-screen-2xl mx-auto px-4">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900">Shop by Category</h2>
        <p className="mt-2 text-gray-600 text-lg">Browse top picks from trending categories</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {categories.map((cat, index) => (
          <a
            key={index}
            href={cat.url}
            className="relative group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
          >
            {/* Image */}
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition" />

            {/* Title */}
            <div className="absolute bottom-4 left-4 text-white text-lg font-semibold z-10 drop-shadow">
              {cat.title}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;

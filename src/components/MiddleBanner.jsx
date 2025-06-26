import React from 'react';
import { assets } from '../assets/assets';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const bannerImages = [
  assets.bottom_banner_image,
  assets.banner_image,
  assets.optical_store,
];

const categories = [
  {
    title: 'Temper Glass',
    image: assets.galaxy_sam,
    url: '/products/mobile-temper-glass',
  },
  {
    title: 'Ear Buds',
    image: assets.noice,
    url: '/products/ear-phone',
  },
  {
    title: 'Bluetooth Speaker',
    image: assets.blutooth_speaker_cat_1,
    url: '/products/bluetooth-speaker',
  },
  {
    title: 'Flip Case',
    image: assets.Flip_case_cat_1,
    url: '/products/flip-case',
  },
];

const MiddleBanner = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-24 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* ✅ Left: Clickable Banner Carousel */}
        <a href="https://mobistorm.in/" target="_blank" rel="noopener noreferrer" className="w-full md:w-1/2 h-80 md:h-auto rounded-lg overflow-hidden shadow-md block">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="h-full"
          >
            {bannerImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </a>

        {/* ✅ Right: Shop by Category Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-white to-gray-50 p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
            Recently Viewed Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-5">
            {categories.map((cat, index) => (
              <a
                key={index}
                href={cat.url}
                className="group relative bg-white rounded-xl shadow-md border border-gray-200 p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary"
              >
                {/* Icon with glow ring */}
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-8 h-8 object-contain"
                  />
                </div>

                <span className="text-gray-800 font-semibold text-base group-hover:text-primary transition">
                  {cat.title}
                </span>

                {/* Optional: Badge or label */}
                <span className="absolute top-2 right-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full shadow-sm hidden group-hover:block">
                  View
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiddleBanner;

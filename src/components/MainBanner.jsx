import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const bannerImages = [
  assets.textile_one,
  assets.textile_two,
  assets.textile_three,
];

const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Boutique / Reflections Theme */}
      <div
        className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 
        w-full h-[180px] sm:h-[220px] md:h-[500px] lg:h-[300px]
        overflow-hidden mt-26 bg-[#f8f3ed]"
      >

        {/* Thin luxury top border */}
        <div className="absolute top-0 left-0 w-full h-[3px] 
          bg-gradient-to-r from-[#d7c4a4] via-[#f2e6d7] to-[#d7c4a4] z-20" />

        {/* Feather gradient overlay */}
        <div className="absolute inset-0 
          bg-gradient-to-b from-[#ffffff80] via-[#00000000] to-[#00000050] 
          z-10 pointer-events-none" />

        {/* Boutique soft vignette */}
        <div className="absolute inset-0 
          bg-[radial-gradient(circle,transparent_50%,#00000015_100%)]
          z-10 pointer-events-none" />

        {/* Swiper */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="h-full z-5"
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

      </div>

      {/* Reflections-style announcement bar */}
      <div
        className="relative w-screen left-1/2 -translate-x-1/2 
        bg-[#3a2f2a] text-[#fceedd] h-10 leading-10 text-sm sm:text-base
        overflow-hidden"
      >
        <div className="inline-block whitespace-nowrap animate-scroll-left">
          <span className="mx-6 sm:mx-12">Free Shipping on Orders Over ₹1500</span>
          <span className="mx-6 sm:mx-8">New Summer Collection Just Dropped</span>
          <span className="mx-6 sm:mx-8">4-Hour Delivery in Chennai</span>
        </div>
      </div>

      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-scroll-left {
            animation: scroll-left 20s linear infinite;
          }
        `}
      </style>
    </>
  );
};

export default MainBanner;

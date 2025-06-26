import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const bannerImages = [
  assets.bottom_banner_image,
  assets.banner_image,
  assets.optical_store,
];
const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentBanner = bannerImages[currentIndex];

  return (
    <>
      {/* Full width banner container fixed to viewport edges */}
      <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 w-full h-[180px] sm:h-[220px] md:h-[500px] lg:h-[300px] overflow-hidden mt-26">
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
      </div>

      {/* Scrolling text below the banner */}
      <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2  w-full bg-black text-white overflow-hidden h-10 leading-10 text-sm sm:text-base bg-gray-800">
        <div className="inline-block whitespace-nowrap animate-scroll-left">
          <span className="mx-6 sm:mx-12 text-green-400">Free Shipping on Orders Over ₹1500</span>
          <span className="mx-6 sm:mx-8 text-green-400">New Summer Collection Just Dropped</span>
          <span className="mx-6 sm:mx-8 text-green-400">4-Hour Delivery in Chennai</span>
        </div>
      </div>

      {/* Inline CSS for animation */}
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

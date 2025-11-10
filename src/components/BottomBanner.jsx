import React from 'react';
import { assets, features } from '../assets/assets';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const BottomBanner = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-24 w-full">
      <div className="flex flex-col md:flex-row w-full overflow-hidden">

        {/* ✅ Left: Textile Features Carousel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-yellow-50 to-yellow-100 px-6 py-12 md:py-20 flex flex-col justify-center items-start">
          <div className="max-w-xl w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-rose-700 mb-4 text-left">
              Why Choose Our Textiles?
            </h2>
            <p className="text-gray-700 mb-8 text-sm md:text-base leading-relaxed">
              Discover the finest fabrics, sustainable craftsmanship, and timeless designs. Here’s what makes our textiles stand out:
            </p>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
            >
              {features.map((feature, index) => (
                <SwiperSlide key={index}>
                  <div className="flex gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300">
                    <img 
                      src={feature.icon} 
                      alt={feature.title} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-8">
              <button className="px-6 py-3 bg-rose-600 text-white font-medium rounded-full hover:bg-rose-500 transition shadow-md">
                Explore Our Fabrics
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Right: Textile Banner Image */}
        <div className="relative w-full md:w-1/2 h-[320px] md:h-auto overflow-hidden rounded-2xl shadow-xl">
          <picture>
            <source media="(min-width: 768px)" srcSet={assets.textile_one} />
            <img
              src={assets.textile_one}
              alt="Textile Showcase"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </picture>

          {/* Curved Bottom SVG */}
          <svg
            className="absolute bottom-0 left-0 w-full h-20 md:h-24"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#fff7f5"
              d="M0,224L80,192C160,160,320,96,480,96C640,96,800,160,960,181.3C1120,203,1280,181,1360,170.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </svg>

          {/* Optional overlay text */}
          <div className="absolute bottom-6 left-6 bg-rose-100/70 backdrop-blur-md px-4 py-2 rounded-md text-rose-800 font-semibold text-lg shadow-sm">
            Premium Handcrafted Fabrics
          </div>
        </div>

      </div>
    </section>
  );
};

export default BottomBanner;

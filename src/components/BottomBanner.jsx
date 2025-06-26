import React from 'react';
import { assets, features } from '../assets/assets';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

const BottomBanner = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-24 w-full">
      <div className="flex flex-col md:flex-row w-full overflow-hidden">

        {/* ✅ Left: Feature Carousel */}
        <div className="w-full md:w-1/2 bg-gray-50 px-6 py-12 md:py-20 flex flex-col justify-center items-start">
          <div className="max-w-xl w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-left">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 mb-8 text-sm md:text-base leading-relaxed">
              Experience unbeatable service, premium products, and trusted optical expertise. Here’s what sets us apart:
            </p>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
            >
              {features.map((feature, index) => (
                <SwiperSlide key={index}>
                  <div className="flex gap-4 p-4 bg-white rounded-xl shadow hover:shadow-md transition duration-300">
                    <img src={feature.icon} alt={feature.title} className="w-12 h-12" />
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
              <button className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Right: Banner Image with Curved Bottom */}
        <div className="relative w-full md:w-1/2 h-[320px] md:h-auto">
          <picture>
            <source media="(min-width: 768px)" srcSet={assets.bottom_banner_image} />
            <img
              src={assets.bottom_banner_image_sm}
              alt="Bottom Banner"
              className="w-full  object-cover"
            />
          </picture>

          {/* Curved Bottom SVG */}
          <svg
            className="absolute bottom-0 left-0 w-full h-20 md:h-24"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#f9fafb"
              d="M0,224L80,192C160,160,320,96,480,96C640,96,800,160,960,181.3C1120,203,1280,181,1360,170.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </svg>
        </div>

      </div>
    </section>
  );
};

export default BottomBanner;

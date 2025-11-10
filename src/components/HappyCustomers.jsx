import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Sample textile customer feedback icons
import customer1 from '../assets/feedback_1.svg';
import customer2 from '../assets/feedback_2.svg';
import customer3 from '../assets/feedback_3.svg';
import customer4 from '../assets/feedback_4.svg';
import customer5 from '../assets/feedback_5.svg';
import customer6 from '../assets/feedback_6.svg';

const feedbacks = [
  {
    icon: customer1,
    title: 'Ananya S',
    description: 'Beautiful fabric and excellent stitching quality. Love the vibrant colors! 🌸',
    rating: 5,
  },
  {
    icon: customer2,
    title: 'Raghav P',
    description: 'Premium quality textiles at very reasonable prices. Will buy again!',
    rating: 5,
  },
  {
    icon: customer3,
    title: 'Meera K',
    description: 'Perfect for gifting. Soft, elegant, and exactly as shown in the pictures.',
    rating: 5,
  },
  {
    icon: customer4,
    title: 'Arjun V',
    description: 'Amazing patterns and textures. Truly a delight for textile lovers!',
    rating: 5,
  },
  {
    icon: customer5,
    title: 'Sneha R',
    description: 'The colors and prints are superb. Delivery was also very fast!',
    rating: 5,
  },
  {
    icon: customer6,
    title: 'Karthik M',
    description: 'High-quality fabric with intricate designs. Perfect for festive wear.',
    rating: 5,
  },
];

const HappyCustomers = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 bg-gradient-to-b from-pink-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">
          What Our Customers Say
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {feedbacks.map((feedback, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col h-full border-t-4 border-pink-500">
                
                {/* Customer Info */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={feedback.icon}
                    alt={`${feedback.title} feedback`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-pink-500"
                  />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-800">{feedback.title}</h3>
                    <div className="text-yellow-400 text-sm mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < feedback.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Feedback Text */}
                <p className="text-gray-700 text-sm mt-auto leading-relaxed">
                  {feedback.description}
                </p>

                {/* Optional textile tag */}
                <span className="absolute top-3 right-3 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md hidden group-hover:block">
                  Textile Approved
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HappyCustomers;

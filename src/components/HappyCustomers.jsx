import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import customer1 from '../assets/feedback_1.svg';
import customer2 from '../assets/feedback_2.svg';
import customer3 from '../assets/feedback_3.svg';
import customer4 from '../assets/feedback_4.svg';
import customer5 from '../assets/feedback_5.svg';
import customer6 from '../assets/feedback_6.svg';

import 'swiper/css';

const feedbacks = [
  {
    icon: customer1,
    title: 'Ramboo',
    description:
      'Excellent service and very good customer care. I feel very comfortable with my eye glasses🙌🏻👌🏻',
    rating: 5,
  },
  {
    icon: customer2,
    title: 'Dhinesh',
    description: 'Best offer lower price super good showroom thanku so much for you',
    rating: 5,
  },
  {
    icon: customer3,
    title: 'Velu D',
    description: 'Perfect eye checkup and suggest good frame for me really super👌',
    rating: 5,
  },
  {
    icon: customer4,
    title: 'Rajesh S',
    description: 'I go for my glass service perfectly done good service 👌',
    rating: 5,
  },
  {
    icon: customer5,
    title: 'Srini R',
    description: 'Best price in east Tambaram very kind person must try',
    rating: 5,
  },
  {
    icon: customer6,
    title: 'Rajesh',
    description: 'Nice collection and very affordable cost',
    rating: 5,
  },
];

const HappyCustomers = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-primary mb-8">
          Our Happy Customers
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {feedbacks.map((feedback, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={feedback.icon}
                    alt={`${feedback.title} feedback`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                  />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-800">{feedback.title}</h3>
                    <div className="text-yellow-500 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < feedback.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-auto leading-relaxed">{feedback.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HappyCustomers;

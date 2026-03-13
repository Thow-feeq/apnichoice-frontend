import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import axios from "axios";

const HappyCustomers = () => {

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {

      const res = await axios.get("http://localhost:4000/api/reviews");

      if (res.data.success) {
        setFeedbacks(res.data.reviews);
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 bg-gradient-to-b from-[#f8f3ed] to-white py-16 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto text-center">

        <h2 className="text-3xl md:text-4xl font-extrabold text-[#800000] mb-10">
          What Our Customers Say
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 3500,
            disableOnInteraction: false
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
        >

          {feedbacks.map((feedback) => (

            <SwiperSlide key={feedback._id}>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col h-full border-t-4 border-[#800000] relative">

                {/* Customer Info */}
                <div className="flex items-center gap-4 mb-4">

                  <img
                    src={`http://localhost:4000${feedback.image}`}
                    alt={feedback.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#800000]"
                  />

                  <div className="text-left">

                    <h3 className="text-lg font-semibold text-[#4d0000]">
                      {feedback.name}
                    </h3>

                    <div className="text-yellow-400 text-sm mt-1">

                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < feedback.rating ? "★" : "☆"}
                        </span>
                      ))}

                    </div>

                  </div>

                </div>

                {/* Review Text */}
                <p className="text-[#4d0000] text-sm mt-auto leading-relaxed">
                  {feedback.review}
                </p>

              </div>

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

    </section>
  );
};

export default HappyCustomers;
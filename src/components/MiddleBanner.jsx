import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useAppContext } from "../context/AppContext";
import "swiper/css";

const categories = [
  {
    title: "Menswear",
    image: assets.menswear_one,
    url: "/products/menswear",
    badge: "New",
  },
  {
    title: "Womenswear",
    image: assets.womenswear_one,
    url: "/products/womenswear",
    badge: "Trending",
  },
  {
    title: "Kidswear",
    image: assets.kidswear_one,
    url: "/products/kidswear",
    badge: "Hot",
  },
  {
    title: "Ethnic Wear",
    image: assets.ethnicwear_one,
    url: "/products/ethnic-wear",
    badge: "New",
  },
];

const MiddleBanner = () => {

  const { axios } = useAppContext();
  const [banners, setBanners] = useState([]);

  const loadBanners = async () => {
    try {
      const res = await axios.get("/api/banner?position=middle");
      if (res.data.success) {
        setBanners(res.data.banners);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-24 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* LEFT BANNER SLIDER */}
        <a
          href="/products"
          className="w-full md:w-1/2 h-80 md:h-auto rounded-lg overflow-hidden shadow-xl block relative group"
        >
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000 }}
            className="h-full"
          >

            {banners.map((banner) => (

              <SwiperSlide key={banner._id}>

                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${banner.image}`}
                  alt="banner"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

              </SwiperSlide>

            ))}

          </Swiper>

          <div className="absolute bottom-4 left-6 bg-[#800000]/80 text-white px-4 py-2 rounded-md text-lg font-semibold">
            Premium Textile Collection
          </div>

        </a>

        {/* RIGHT CATEGORIES */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-white to-[#fff5f5] p-6 md:p-10 rounded-2xl shadow-xl border border-[#f0e5e5]">

          <h2 className="text-3xl font-bold text-[#800000] mb-8 text-center md:text-left">
            Explore Vastraa Dhee Fashions Categories
          </h2>

          <div className="grid grid-cols-2 gap-6">

            {categories.map((cat, index) => (

              <a
                key={index}
                href={cat.url}
                className="group relative bg-white rounded-xl shadow-md border border-[#f0e5e5] p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-[#800000]"
              >

                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#ffe5e5] to-[#ffc0c0]">

                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-10 h-10 object-contain"
                  />

                </div>

                <span className="text-[#800000] font-semibold text-base">
                  {cat.title}
                </span>

                {cat.badge && (

                  <span className="absolute top-2 right-2 text-xs bg-[#800000] text-white px-2 py-0.5 rounded-full">
                    {cat.badge}
                  </span>

                )}

              </a>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default MiddleBanner;
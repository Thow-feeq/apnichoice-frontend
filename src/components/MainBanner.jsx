import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const MainBanner = () => {

  const { axios } = useAppContext();

  const [banners, setBanners] = useState([]);

  const loadBanners = async () => {

    try {

      const res = await axios.get("/api/banner");

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

  if (banners.length === 0) return null;

  return (
    <>
      <div
        className="relative w-screen left-1/2 -translate-x-1/2 
        w-full h-[180px] sm:h-[220px] md:h-[500px] lg:h-[300px]
        overflow-hidden mt-26 bg-white"
      >

        {/* top border */}
        <div className="absolute top-0 left-0 w-full h-[3px] 
        bg-gradient-to-r from-[#800000]/50 via-[#ffffff]/30 to-[#800000]/50 z-20" />

        {/* overlay */}
        <div className="absolute inset-0 
        bg-gradient-to-b from-[#ffffff80] via-[#80000000] to-[#80000040] 
        z-10 pointer-events-none" />

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
                className="w-full h-full object-cover"
              />

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

      {/* announcement bar */}
      <div
        className="relative w-screen left-1/2 -translate-x-1/2 
        bg-[#800000] text-white h-10 leading-10 text-sm sm:text-base"
      >
      </div>
    </>
  );

};

export default MainBanner;
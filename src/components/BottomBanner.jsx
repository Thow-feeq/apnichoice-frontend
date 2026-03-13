import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { features } from "../assets/assets";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const BottomBanner = () => {

const { axios } = useAppContext();
const [banner,setBanner] = useState(null);

const loadBanner = async()=>{

const res = await axios.get("/api/banner?position=bottom");

if(res.data.success && res.data.banners.length>0){
setBanner(res.data.banners[0]);
}

};

useEffect(()=>{
loadBanner();
},[]);

return (

<section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-24 w-full">

<div className="flex flex-col md:flex-row w-full overflow-hidden">

{/* LEFT CONTENT */}

<div className="w-full md:w-1/2 bg-gradient-to-br from-[#fff0f0] to-[#ffe5e5] px-6 py-12 md:py-20 flex flex-col justify-center items-start">

<div className="max-w-xl w-full">

<h2 className="text-3xl md:text-4xl font-bold text-[#800000] mb-4">
Why Choose Our Vastraa Dhee Fashions?
</h2>

<p className="text-[#4d0000] mb-8 text-sm md:text-base">
Discover the finest fabrics, sustainable craftsmanship and timeless designs.
</p>

<Swiper
modules={[Autoplay]}
slidesPerView={1}
loop={true}
autoplay={{delay:3000}}
>

{features.map((feature,index)=>(
<SwiperSlide key={index}>

<div className="flex gap-4 p-4 bg-white rounded-xl shadow-md">

<img
src={feature.icon}
className="w-12 h-12"
/>

<div>

<h4 className="text-lg font-semibold text-[#800000]">
{feature.title}
</h4>

<p className="text-sm text-[#4d0000]">
{feature.description}
</p>

</div>

</div>

</SwiperSlide>
))}

</Swiper>

</div>

</div>


{/* RIGHT IMAGE */}

<div className="relative w-full md:w-1/2 h-[320px] md:h-auto overflow-hidden rounded-2xl shadow-xl">

{banner && (

<img
src={`${import.meta.env.VITE_BACKEND_URL}${banner.image}`}
className="w-full h-full object-cover"
/>

)}

</div>

</div>

</section>

);

};

export default BottomBanner;
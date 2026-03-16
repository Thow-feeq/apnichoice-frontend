import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <section className="mt-28 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 text-gray-700">

      {/* HERO SECTION */}
      <div className="grid md:grid-cols-2 gap-12 items-center">

        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold text-[#7b0f0f] leading-tight">
            About Vasthraa Dhee Fashions
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            At Vastraa Dhee Fashions, we believe every fabric tells a story – of elegance, comfort, and timeless style. Founded with a passion for textiles, our startup showroom brings together tradition and modern fashion under one roof. From daily essentials to festive collections, we handpick fabrics that blend quality, style, and affordability.

            Our vision is simple: to make premium textiles accessible to everyone while celebrating the rich heritage of Indian craftsmanship. Whether it’s a classic saree, a contemporary dress material, or trendy wear, every piece in our showroom is chosen with care to ensure you look and feel your best.
          </p>

          <p className="text-gray-600">
            From everyday wear to festive collections, our curated range of
            fabrics and garments is designed to make every moment stylish and
            memorable.
          </p>

          <button className="bg-[#7b0f0f] text-white px-6 py-3 rounded-lg shadow hover:bg-[#5c0b0b] transition">
            Explore Collections
          </button>
        </div>

        <img
          src={assets.banner_image}
          alt="Fashion"
          className="rounded-xl shadow-xl object-cover w-full h-96"
        />

      </div>


      {/* WHO WE ARE */}
      <div className="grid md:grid-cols-2 gap-12 items-center">

        <img
          src={assets.optical_store}
          alt="Textile Store"
          className="rounded-xl shadow-lg object-cover w-full h-80"
        />

        <div className="space-y-5">
          <h2 className="text-3xl font-bold text-[#7b0f0f]">
            Who We Are
          </h2>

          <p className="text-lg leading-relaxed text-gray-600">
            What sets us apart is not just our wide range of collections, but also our commitment to customer satisfaction. We see every visitor not just as a buyer, but as part of our extended family. With personalized service, honest pricing, and attention to detail, we strive to make every shopping experience memorable.



          </p>

          <p className="text-gray-600">
            At Vastraa Dhee fashions], we don’t just sell textiles – we create fashion experiences that last. Step into our showroom and discover fabrics that fit every mood, every moment, and every occasion.
          </p>
        </div>

      </div>


      {/* WHY CHOOSE US */}
      <div className="bg-[#fff5f5] rounded-2xl p-10 shadow-md">

        {/* <h2 className="text-3xl font-bold text-center text-[#7b0f0f] mb-10">
          Why Choose Vasthraa Dhee?
        </h2> */}

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-lg text-[#7b0f0f] mb-2">
              Our Mission
            </h4>
            <p className="text-gray-600">
              “To deliver premium-quality textiles that blend tradition and modern fashion, while ensuring affordability, variety, and customer satisfaction.”
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-lg text-[#7b0f0f] mb-2">
              Our Vision
            </h4>
            <p className="text-gray-600">
              “To become a trusted name in the textile industry by offering fabrics that inspire confidence, celebrate culture, and redefine everyday style.”
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-lg text-[#7b0f0f] mb-2">
              Our Values
            </h4>
            <p className="text-gray-600">
              Quality First – Every fabric is handpicked for durability and comfort.

              Customer-Centric – Your satisfaction is the fabric of our success.
            </p>
          </div>

        </div>

      </div>


      {/* OUR VALUES */}
      <div className="text-center space-y-10">

        <h2 className="text-3xl font-bold text-[#7b0f0f]">
          Our Values
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="p-6 rounded-xl border shadow hover:shadow-lg">
            <h3 className="font-semibold text-lg mb-2">Quality</h3>
            <p className="text-gray-600">
              Every product reflects our commitment to superior fabric quality.
            </p>
          </div>

          <div className="p-6 rounded-xl border shadow hover:shadow-lg">
            <h3 className="font-semibold text-lg mb-2">Craftsmanship</h3>
            <p className="text-gray-600">
              Designs crafted with attention to detail and textile excellence.
            </p>
          </div>

          <div className="p-6 rounded-xl border shadow hover:shadow-lg">
            <h3 className="font-semibold text-lg mb-2">Customer First</h3>
            <p className="text-gray-600">
              Your satisfaction and style needs are always our priority.
            </p>
          </div>

          <div className="p-6 rounded-xl border shadow hover:shadow-lg">
            <h3 className="font-semibold text-lg mb-2">Innovation</h3>
            <p className="text-gray-600">
              Combining traditional textile culture with modern fashion trends.
            </p>
          </div>

        </div>

      </div>


      {/* CTA SECTION */}
      <div className="text-center bg-[#7b0f0f] text-white py-12 px-6 rounded-2xl shadow-lg">

        <h3 className="text-3xl font-bold mb-4">
          Discover Fashion That Defines You
        </h3>

        <p className="mb-6 text-lg">
          Explore our latest textile collections and experience the elegance of
          Vasthraa Dhee Fashions.
        </p>

        <button className="bg-white text-[#7b0f0f] font-semibold px-6 py-3 rounded-lg shadow hover:scale-105 transition">
          Shop Now
        </button>

      </div>

    </section>
  );
};

export default About;
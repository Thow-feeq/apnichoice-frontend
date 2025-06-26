import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <section className="mt-28 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 text-gray-800">

      {/* 🚀 Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-blue-700">
          A Clearer Vision for a Brighter Tomorrow
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          At OptiView, we believe that great vision transforms lives. We're here to provide more than eyewear — we offer clarity, confidence, and comfort through every lens.
        </p>
        <img
          src={assets.optical_store}
          alt="Hero"
          className="w-full max-w-4xl mx-auto rounded-xl shadow-xl object-cover h-72 sm:h-96"
        />
      </div>

      {/* 👓 Who We Are */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <h2 className="text-3xl font-bold">Who We Are</h2>
          <p className="text-lg leading-relaxed text-gray-600">
            OptiView is a modern optical destination that blends the latest vision technology with timeless personal service. With years of experience in eye care and fashion-forward eyewear, we help customers feel confident and see clearly every day.
          </p>
        </div>
        <img
          src={assets.banner_image}
          alt="About Us"
          className="rounded-lg shadow-lg object-cover w-full h-72"
        />
      </div>

      {/* 💡 Our Values */}
      <div className="bg-blue-50 rounded-2xl p-10 shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center text-gray-700">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Integrity</h3>
            <p>Transparent pricing, ethical care, and honest advice.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Innovation</h3>
            <p>Modern tools, AI-based testing & lens crafting.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Care</h3>
            <p>We listen. We guide. We serve with empathy and patience.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Style</h3>
            <p>Trendy frames from global brands tailored to your look.</p>
          </div>
        </div>
      </div>

      {/* 🔍 Why Choose Us */}
      <div className="text-center space-y-8">
        <h2 className="text-3xl font-bold">What Sets Us Apart?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-xl shadow hover:shadow-xl border">
            <h4 className="font-semibold mb-2 text-blue-600">✅ Digital Eye Exams</h4>
            <p>Next-gen testing equipment for accurate prescriptions.</p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-xl border">
            <h4 className="font-semibold mb-2 text-blue-600">🕶 Curated Eyewear</h4>
            <p>Collections from Ray-Ban, Oakley, Prada, and more.</p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-xl border">
            <h4 className="font-semibold mb-2 text-blue-600">🧑‍⚕️ Optician-Led Team</h4>
            <p>Real humans guiding you to the right fit, always.</p>
          </div>
        </div>
      </div>

      {/* 📞 Call to Action */}
      <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-10 px-6 rounded-xl shadow-lg">
        <h3 className="text-2xl sm:text-3xl font-semibold mb-4">Book Your Free Eye Checkup Today!</h3>
        <p className="mb-6 text-lg">Walk-in or schedule online — your journey to better vision starts now.</p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:scale-105 transition">
          Schedule Appointment
        </button>
      </div>

    </section>
  );
};

export default About;

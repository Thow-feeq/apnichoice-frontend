import React from 'react';

const NewsLetter = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 relative mt-24 px-6 sm:px-10 md:px-16 xl:px-24">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-white to-gray-100 border border-gray-200 rounded-2xl shadow-sm p-8 md:p-12 text-center space-y-6">
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Never Miss a Deal!
        </h2>

        <p className="text-gray-600 text-sm md:text-base">
          Subscribe now and stay updated with our latest offers, new arrivals, and exclusive discounts delivered straight to your inbox.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="w-full sm:w-[60%] px-4 py-3 border border-gray-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary transition"
          />
          <button
            type="submit"
            className="px-6 py-3 w-full sm:w-auto bg-primary text-white font-medium rounded-full hover:bg-primary-dull transition"
          >
            Subscribe
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-2">
          We respect your privacy. No spam ever.
        </p>
      </div>
    </section>
  );
};

export default NewsLetter;

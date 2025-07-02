import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    try {
      setLoading(true);
      const { data } = await axios.post('/api/newsletter/subscribe', { email });
      if (data.success) {
        toast.success(data.message);
        setEmail('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-24 px-6 sm:px-10 md:px-16 xl:px-24">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-white to-gray-100 border border-gray-200 rounded-2xl shadow-sm p-8 md:p-12 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Never Miss a Deal!
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Subscribe now and stay updated with our latest offers, new arrivals, and exclusive discounts delivered straight to your inbox.
        </p>
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full sm:w-[60%] px-4 py-3 border border-gray-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 w-full sm:w-auto bg-primary text-white font-medium rounded-full hover:bg-primary-dull transition"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
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

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
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-pink-50 to-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">

        {/* Optional: Textile Pattern Background */}
        <div className="absolute inset-0 bg-[url('/assets/textile_pattern.svg')] bg-contain bg-center bg-no-repeat opacity-10 pointer-events-none"></div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Stay in Style with Our Textiles!
        </h2>

        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Subscribe to get the latest fabric collections, trending patterns, and exclusive offers delivered directly to your inbox.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full sm:w-[60%] px-5 py-3 border border-gray-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-pink-400 transition shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 w-full sm:w-auto bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold rounded-full hover:scale-105 transition transform shadow-lg"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-2">
          We respect your privacy. No spam ever. 🌿
        </p>

        {/* Optional: Decorative Fabric Motif */}
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[url('/assets/fabric_motif.svg')] bg-contain bg-no-repeat opacity-20 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default NewsLetter;

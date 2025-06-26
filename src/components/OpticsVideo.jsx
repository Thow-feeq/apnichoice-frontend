import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const leftCategories = [
  { title: 'CC Board', url: 'cc-board', image: 'http://localhost:4000/uploads/1749926935513.jpg' },
  { title: 'Touch Pad', url: 'touch-pad', image: 'http://localhost:4000/uploads/1749926037166.jpg' },
  { title: 'Ear Phone', url: 'ear-phone', image: 'http://localhost:4000/uploads/1749927082825.jpg' },
  { title: 'Mobile Stand', url: 'mobile-stand', image: 'http://localhost:4000/uploads/1749926130597.jpg' },
  { title: 'OCA Glass', url: 'oca-glass', image: 'http://localhost:4000/uploads/1749925945191.jpg' },
  { title: 'Middle Center Case', url: 'middle-center-case', image: 'http://localhost:4000/uploads/1749925853429.jpg' },
];

const rightCategories = [
  { title: 'Camera Glass', url: 'camera-glass', image: 'http://localhost:4000/uploads/1749926864845.jpg' },
  { title: 'Outer Button', url: 'outer-button', image: 'http://localhost:4000/uploads/1749926775836.jpg' },
  { title: 'Mobile Charger', url: 'mobile-charger', image: 'http://localhost:4000/uploads/1749924147149.jpg' },
  { title: 'Mobile Case Cover', url: 'mobile-case-cover', image: 'http://localhost:4000/uploads/1749924847659.jpg' },
  { title: 'Mobile Battery', url: 'mobile-battery', image: 'http://localhost:4000/uploads/1749924742089.jpg' },
  { title: 'On/off Stripe Button', url: 'onoff-stripe-button', image: 'http://localhost:4000/uploads/1749924633888.jpg' }
];

const SuperSonicBeautySection = () => {
  const navigate = useNavigate();
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 150;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-24 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Banner */}
        <div className="w-full md:w-1/2 bg-black text-white rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Gadget Galaxy Deals</h2>
            <p className="text-lg font-medium mb-6">Up to 70% OFF on Mobile Accessories</p>
          </div>

          <div className="relative mb-6">
            <button onClick={() => scroll(leftScrollRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white text-black p-1 rounded-full shadow hover:bg-gray-200 z-10">
              &#8592;
            </button>
            <div ref={leftScrollRef} className="scrollbar-hide overflow-x-auto flex gap-4 snap-x snap-mandatory px-6">
              {leftCategories.map((cat, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/products/${cat.url}`)}
                  className="min-w-[100px] h-24 bg-gray-800 rounded-xl cursor-pointer snap-center flex flex-col items-center justify-center hover:bg-gray-700 transition"
                >
                  <img src={cat.image} alt={cat.title} className="w-10 h-10 object-cover mb-1 rounded-full" />
                  <span className="text-xs font-semibold text-center">{cat.title}</span>
                </div>
              ))}
            </div>
            <button onClick={() => scroll(leftScrollRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white text-black p-1 rounded-full shadow hover:bg-gray-200 z-10">
              &#8594;
            </button>
          </div>

          <button
            onClick={() => navigate('/products')}
            className="bg-yellow-400 text-black font-bold px-4 py-1.5 rounded-full hover:bg-yellow-300 transition text-sm self-start"
          >
            Shop Now
          </button>
        </div>

        {/* Right Banner */}
        <div className="w-full md:w-1/2 bg-pink-50 text-gray-800 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-pink-700">Mobile Mania Fest</h2>
            <p className="text-lg font-medium mb-6">Unbeatable Offers Starting at ₹99</p>
          </div>

          <div className="relative mb-6">
            <button onClick={() => scroll(rightScrollRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white text-black p-1 rounded-full shadow hover:bg-gray-200 z-10">
              &#8592;
            </button>
            <div ref={rightScrollRef} className="scrollbar-hide overflow-x-auto flex gap-4 snap-x snap-mandatory px-6">
              {rightCategories.map((cat, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/products/${cat.url}`)}
                  className="min-w-[100px] h-24 bg-white rounded-xl border border-pink-200 cursor-pointer snap-center flex flex-col items-center justify-center hover:bg-pink-100 transition"
                >
                  <img src={cat.image} alt={cat.title} className="w-10 h-10 object-cover mb-1 rounded-full" />
                  <span className="text-xs font-semibold text-center">{cat.title}</span>
                </div>
              ))}
            </div>
            <button onClick={() => scroll(rightScrollRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white text-black p-1 rounded-full shadow hover:bg-gray-200 z-10">
              &#8594;
            </button>
          </div>

          <button
            onClick={() => navigate('/products')}
            className="bg-pink-600 text-white font-bold px-4 py-1.5 rounded-full hover:bg-pink-500 transition text-sm self-start"
          >
            Explore Now
          </button>
        </div>

      </div>
    </section>
  );
};

export default SuperSonicBeautySection;

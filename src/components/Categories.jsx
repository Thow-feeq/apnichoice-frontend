import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Categories = () => {
  const { navigate, axios } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token'); // adjust key if needed

        const { data } = await axios.get('/api/seller/category/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error('Failed to fetch categories:', data.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [axios]);


  const handleNavigate = useCallback(
    (path) => {
      navigate(`/products/${path.toLowerCase()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate]
  );

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 px-4 sm:px-6 lg:px-8 mt-16">
      <h2 className="text-3xl font-semibold mb-8 text-black">Shop by Category </h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                     bg-black text-white hover:bg-gray-800 
                     w-10 h-10 flex items-center justify-center 
                     rounded-full shadow transition duration-300"
          onClick={() => scroll('left')}
          aria-label="Scroll Left"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 scroll-smooth no-scrollbar"
        >
          {categories.map(({ _id, text, image, bgColor, path }, index) => (
            <button
              key={_id || index}
              type="button"
              onClick={() => handleNavigate(path)}
              className="group relative flex-shrink-0 w-28 sm:w-32 flex flex-col items-center rounded-lg p-4 overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: bgColor || '#f0f0f0' }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 z-0 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-500 transition-opacity duration-500 opacity-0 group-hover:opacity-20 rounded-lg" />

              {image ? (
                <img
                  src={`https://apnichoice-backend.onrender.com${image}`}
                  alt={text}
                  className="relative z-10 w-20 h-20 object-contain mb-2 transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <div className="relative z-10 w-20 h-20 bg-gray-200 flex items-center justify-center rounded mb-2">
                  No Image
                </div>
              )}
              <span className="relative z-10 text-sm font-medium text-gray-900">{text}</span>
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                     bg-black text-white hover:bg-gray-800 
                     w-10 h-10 flex items-center justify-center 
                     rounded-full shadow transition duration-300"
          onClick={() => scroll('right')}
          aria-label="Scroll Right"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Categories;

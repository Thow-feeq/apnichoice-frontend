import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const Categories = () => {
  const { navigate, axios } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/seller/category/list');

        if (data.success) {
          // ✅ ONLY MAIN CATEGORIES (level === 0)
          const mainOnly = data.categories.filter(cat => cat.level === 0);
          setCategories(mainOnly);
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
      navigate(`/products/${path}`);
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

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    return `${API_URL}/uploads/${img}`;
  };

  if (loading) {
    return <p className="text-[#800000] px-6">Loading categories...</p>;
  }

  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 px-4 sm:px-6 lg:px-8 mt-16">
      <h2 className="text-3xl font-semibold mb-8 text-[#800000]">
        Shop by Category
      </h2>

      <div className="relative">
        {/* LEFT ARROW */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#800000] text-white w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-[#660000]"
          onClick={() => scroll('left')}
        >
          ‹
        </button>

        {/* CATEGORY CARDS */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-4 scroll-smooth no-scrollbar"
        >
          {categories.map(({ _id, text, image, bgColor, path }) => (
            <button
              key={_id}
              onClick={() => handleNavigate(path)}
              className="group relative flex-shrink-0 w-44 h-56 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-md hover:shadow-xl transition"
              style={{ backgroundColor: bgColor || '#fdeaea' }}
            >
              {image ? (
                <img
                  src={getImageUrl(image)}
                  alt={text}
                  className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-90 transition"
                />
              ) : (
                <div className="absolute inset-0 bg-[#f3dddd]" />
              )}

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition" />

              {/* CATEGORY NAME */}
              <span className="relative z-10 text-white text-lg font-semibold tracking-wide">
                {text}
              </span>
            </button>
          ))}
        </div>

        {/* RIGHT ARROW */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#800000] text-white w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-[#660000]"
          onClick={() => scroll('right')}
        >
          ›
        </button>
      </div>
      
    </section>
  );
};

export default Categories;
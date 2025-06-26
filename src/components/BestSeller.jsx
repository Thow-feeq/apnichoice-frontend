import React, { useMemo, useRef } from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const BestSeller = () => {
  const { products } = useAppContext();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // Limit to 20 best sellers
  const bestSellers = useMemo(() => {
    return products.slice(0, 20);
  }, [products]);

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

  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-12 sm:mt-16 max-w-screen-2xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
         Best Seller
        </h2>
        <button
          onClick={() => navigate('/products/mobile-temper-glass')}
          className="text-sm text-green-600 hover:text-green-800 font-medium"
        >
          See All →
        </button>
      </div>

      {bestSellers.length > 0 ? (
        <div className="relative mt-6">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hidden sm:block"
          >
            ◀
          </button>

          {/* Scrollable Row */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 scroll-smooth scrollbar-hide px-2"
          >
            {bestSellers.map((product) => (
              <div key={product._id || product.id} className="min-w-[180px] max-w-[220px] flex-shrink-0">
                <ProductCard
                  product={product}
                  outOfStock={!product.inStock}
                />
              </div>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hidden sm:block"
          >
            ▶
          </button>
        </div>
      ) : (
        <p className="mt-8 text-center text-gray-600 text-lg">
          No best seller products available at the moment.
        </p>
      )}
    </section>
  );
};

export default BestSeller;

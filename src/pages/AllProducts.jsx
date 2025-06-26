import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AllProducts = () => {
  const { category } = useParams();
  const { products, searchQuery } = useAppContext();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/seller/category/list');
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchQuery.trim().length > 0) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, category]);

  const handleCategoryClick = (cat) => {
    if (category === cat.path) {
      navigate('/products');
    } else {
      navigate(`/products/${cat.path}`);
    }
    setShowMobileCategories(false); // auto-close on mobile
  };

  return (
    <section className="relative w-full mt-20 max-w-screen-2xl mx-auto px-4">
      {/* ✅ Mobile: Category Dropdown Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowMobileCategories((prev) => !prev)}
          className="w-full flex justify-between items-center px-4 py-2 bg-primary text-white rounded-md"
        >
          Categories
          {showMobileCategories ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {showMobileCategories && (
          <div className="bg-white border rounded-md shadow-sm mt-2 p-4 space-y-3">
            {categories.map((cat) => {
              const isSelected = category === cat.path;
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-md transition ${
                    isSelected
                      ? 'bg-primary text-white font-semibold'
                      : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: cat.bgColor }}
                  />
                  <span>{cat.text}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ✅ Sidebar (Desktop only) */}
        <aside className="hidden md:flex flex-col w-64 bg-white shadow-md rounded-lg sticky top-24 h-fit max-h-[80vh] overflow-y-auto p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-2">
            Categories
          </h2>
          <ul className="flex flex-col space-y-3">
            {categories.map((cat) => {
              const isSelected = category === cat.path;
              return (
                <li key={cat._id}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left flex items-center gap-3 p-2 rounded-md transition
                      ${
                        isSelected
                          ? 'bg-primary text-white font-semibold'
                          : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                      }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: cat.bgColor }}
                    />
                    <span className="truncate">{cat.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* ✅ Product Grid */}
        <main className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">All Products</h1>

          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 mt-8">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="flex justify-center">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default AllProducts;

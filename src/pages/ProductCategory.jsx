import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();
  const navigate = useNavigate();

  const uniqueCategories = useMemo(() => {
    const categoryMap = {};
    products.forEach((product) => {
      const catPath = slugify(product.category);
      if (!categoryMap[catPath]) {
        categoryMap[catPath] = {
          text: product.category,
          path: catPath,
        };
      }
    });
    return Object.values(categoryMap);
  }, [products]);

  const currentCategory = uniqueCategories.find(
    (cat) => cat.path === category?.toLowerCase()
  );

  const filteredProducts = category
    ? products.filter((p) => slugify(p.category) === category.toLowerCase())
    : products;

  const handleCategoryClick = (cat) => {
    if (category === cat.path) return; // no action if same category
    navigate(`/products/${cat.path}`);
  };

  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-12 sm:mt-16 max-w-screen-2xl mx-auto px-4">
      <div className="flex max-w-screen-xl mx-auto mt-10 px-4 md:px-8 gap-8">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white shadow-md rounded-lg sticky top-20 h-[calc(100vh-80px)] overflow-y-auto p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-2">
            Categories
          </h2>
          <ul className="flex flex-col space-y-3">
            {uniqueCategories.map((cat) => {
              const isActive = category === cat.path;
              return (
                <li key={cat.path}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left flex items-center gap-3 p-2 rounded-md transition
                      ${
                        isActive
                          ? 'bg-primary text-white font-semibold cursor-default'
                          : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                      }`}
                    disabled={isActive}
                  >
                    <span className="w-4 h-4 rounded-full border border-gray-300 bg-gray-300" />
                    <span className="truncate capitalize">{cat.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {currentCategory ? (
            <div className="flex flex-col items-start mb-6">
              <p className="text-2xl font-semibold">{currentCategory.text.toUpperCase()}</p>
              <div className="w-16 h-1 bg-primary rounded-full mt-1"></div>
            </div>
          ) : (
            <p className="text-2xl font-semibold mb-6">All Products</p>
          )}

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60vh]">
              <p className="text-2xl font-medium text-primary">
                No products found in this category.
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default ProductCategory;

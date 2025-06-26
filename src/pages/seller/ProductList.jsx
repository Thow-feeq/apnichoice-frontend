import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { HiPencil, HiTrash, HiOutlineSearch } from 'react-icons/hi';
import debounce from 'lodash/debounce';

const ProductList = () => {
  const { axios, currency } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Debounce the search input
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    handler();
    return () => handler.cancel();
  }, [searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/product/list?page=${currentPage}&limit=10&search=${debouncedSearchTerm}`
      );
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error('Failed to load products');
      }
    } catch (err) {
      setError('Error loading products');
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage, debouncedSearchTerm]);

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post('/api/product/stock', { id, inStock });
      if (data.success) {
        toast.success(data.message);
        loadProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { data } = await axios.delete(`/api/product/${id}`);
      if (data.success) {
        toast.success(data.message);
        loadProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditProduct = (id) => {
    navigate(`/seller/edit-product/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Product Inventory</h2>
        <div className="relative w-full md:w-72">
          <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-md">
        {products.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No products found.</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-gray-600 uppercase text-xs">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 hidden md:table-cell">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={product.image?.[0] || '/placeholder.png'}
                      alt="Product"
                      className="w-14 h-14 object-cover border rounded"
                    />
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 capitalize">{product.category}</td>
                  <td className="px-6 py-4 hidden md:table-cell font-medium text-gray-800">
                    {currency}
                    {product.offerPrice}
                  </td>
                  <td className="px-6 py-4">
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={product.inStock}
                        onChange={() => toggleStock(product._id, !product.inStock)}
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors" />
                      <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow" />
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-start gap-3">
                      <button
                        onClick={() => handleEditProduct(product._id)}
                        className="flex items-center px-3 py-1.5 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                      >
                        <HiPencil className="mr-1 text-base" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="flex items-center px-3 py-1.5 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition"
                      >
                        <HiTrash className="mr-1 text-base" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-6 flex-wrap gap-1 text-sm">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition 
            ${currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <span className="text-base">←</span> Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) =>
            page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, index, arr) => {
            const prev = arr[index - 1];
            const isGap = prev && page - prev > 1;
            return (
              <React.Fragment key={page}>
                {isGap && <span className="px-2 text-gray-400 font-medium">...</span>}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-1.5 rounded-full border transition font-medium 
                    ${currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}

        <button
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition 
            ${currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          Next <span className="text-base">→</span>
        </button>
      </div>
    </div>
  );
};

export default ProductList;

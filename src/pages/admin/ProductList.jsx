import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { HiPencil, HiTrash, HiOutlineSearch } from 'react-icons/hi';

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

  // Debounce for smoother search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
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
    navigate(`/admin/edit-product/${id}`);
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
            placeholder="Search fabrics..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            disabled={loading}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition disabled:opacity-50"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-300 rounded-2xl shadow-lg">
        {products.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No fabrics found.</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs border-b">
                <th className="px-6 py-4">Fabric</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 hidden md:table-cell">Color</th>
                <th className="px-6 py-4 hidden md:table-cell">Pattern</th>
                <th className="px-6 py-4 hidden md:table-cell">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 divide-y divide-gray-100">
              {products.map(fabric => (
                <tr
                  key={fabric._id}
                  className="hover:bg-gray-50 transition-all duration-150"
                >

                  {/* Product Image + Name */}
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="relative group">
                      <img
                        src={fabric.images?.[0] || "/placeholder.png"}
                        alt="Fabric"
                        className="w-14 h-14 object-cover border rounded-lg shadow-sm group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div>
                      <div className="font-medium text-gray-900">{fabric.name}</div>
                      <div className="text-gray-500 text-xs">
                        {fabric.variants?.length
                          ? `${fabric.variants.length} variants`
                          : "No variants"}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 capitalize">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs shadow-sm">
                      {fabric.category}
                    </span>
                  </td>

                  {/* First Color */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    {fabric?.variants?.[0] ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border shadow"
                          style={{ backgroundColor: fabric.variants[0].colorCode }}
                        ></span>
                        {fabric.variants[0].colorName}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Pattern */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    {fabric?.variants?.[0]?.pattern ? (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs shadow-sm">
                        {fabric.variants[0].pattern}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 hidden md:table-cell font-semibold text-gray-800">
                    <span className="inline-flex items-center">
                      {currency}
                      {fabric.offerPrice || fabric.price}
                    </span>
                  </td>

                  {/* Stock Toggle */}
                  <td className="px-6 py-4">
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={fabric.inStock}
                        onChange={() => toggleStock(fabric._id, !fabric.inStock)}
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors shadow-inner" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                    </label>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

                      <button
                        onClick={() => handleEditProduct(fabric._id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg shadow-sm transition flex items-center gap-1"
                      >
                        <HiPencil className="text-base" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => deleteProduct(fabric._id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg shadow-sm transition flex items-center gap-1"
                      >
                        <HiTrash className="text-base" />
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

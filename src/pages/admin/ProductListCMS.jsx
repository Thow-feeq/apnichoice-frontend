import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";

const ProductListCMS = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/product/list?limit=1000");
        if (res.data.success) {
          setProducts(res.data.products || []);
        } else {
          toast.error(res.data.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/seller/category/tree");
        if (res.data.success) {
          const flatCategories = flattenCategories(res.data.categories);
          setCategories(flatCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [axios]);

  const flattenCategories = (cats) => {
    let result = [];
    cats.forEach((cat) => {
      result.push(cat);
      if (cat.children) {
        result = result.concat(flattenCategories(cat.children));
      }
    });
    return result;
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id.includes(searchTerm)
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy] || "";
      let bVal = b[sortBy] || "";

      if (sortBy === "price" || sortBy === "stock") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, sortBy, sortOrder]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await axios.delete(`/api/product/${id}`);
      if (res.data.success) {
        toast.success("Product deleted");
        setProducts(products.filter((p) => p._id !== id));
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Select products first");
      return;
    }

    if (!window.confirm(`Delete ${selectedProducts.length} products?`)) {
      return;
    }

    try {
      for (const id of selectedProducts) {
        await axios.delete(`/api/product/${id}`);
      }
      toast.success(`${selectedProducts.length} products deleted`);
      setProducts(products.filter((p) => !selectedProducts.includes(p._id)));
      setSelectedProducts([]);
    } catch (error) {
      toast.error("Bulk delete failed");
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const getCategoryName = (slugOrId) => {
    // Try to match by ID first
    let cat = categories.find((c) => c._id === slugOrId);
    if (cat) return cat.name;

    // Try to match by slug
    cat = categories.find((c) => c.slug === slugOrId);
    if (cat) return cat.name;

    return slugOrId || "N/A";
  };

  const getTotalStock = (product) => {

    // SIMPLE PRODUCT
    if (!product.variants || product.variants.length === 0) {
      return product.stock || 0;
    }

    // VARIANT PRODUCT
    return product.variants.reduce((total, variant) => {
      return total + (variant.sizes?.reduce((sum, size) => sum + (size.quantity || 0), 0) || 0);
    }, 0);

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">Manage your product catalog</p>
          </div>
          <button
            onClick={() => navigate("/admin/add-product")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            + Add Product
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
              <option value="createdAt">Sort by Date</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              {sortOrder === "asc" ? (
                <>
                  <FaChevronUp /> Asc
                </>
              ) : (
                <>
                  <FaChevronDown /> Desc
                </>
              )}
            </button>
          </div>

          {/* Actions */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-4 pt-4 border-t">
              <span className="text-gray-600">
                {selectedProducts.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts.length === filteredProducts.length &&
                          filteredProducts.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="w-5 h-5 rounded"
                      />
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-700">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleSelect(product._id)}
                          className="w-5 h-5 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.images && product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product._id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {getCategoryName(product.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold text-gray-900">
                          ₹{product.price}
                        </div>
                        {product.offerPrice && (
                          <div className="text-xs text-green-600">
                            ₹{product.offerPrice}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getTotalStock(product) > 10
                              ? "bg-green-100 text-green-800"
                              : getTotalStock(product) > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {getTotalStock(product)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {/* <button
                            onClick={() =>
                              navigate(`/product/${product._id}`)
                            }
                            title="View"
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          >
                            <FaEye />
                          </button> */}
                          <button
                            onClick={() =>
                              navigate(`/admin/edit-product/${product._id}`)
                            }
                            title="Edit"
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            title="Delete"
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Stats */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between text-sm text-gray-600">
              <span>
                Showing <strong>{filteredProducts.length}</strong> of{" "}
                <strong>{products.length}</strong> products
              </span>
              <span>
                {selectedProducts.length > 0 && (
                  <strong>{selectedProducts.length} selected</strong>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListCMS;

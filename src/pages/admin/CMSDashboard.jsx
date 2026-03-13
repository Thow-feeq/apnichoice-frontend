import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  FaBox,
  FaTags,
  FaUsers,
  FaShoppingCart,
  FaTicketAlt,
  FaEnvelope,
  FaPlus,
  FaArrowRight,
  FaChartBar,
  FaClock,
} from "react-icons/fa";

const CMSDashboard = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    orders: 0,
    coupons: 0,
    subscribers: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch counts
        const [
          productsRes,
          categoriesRes,
          usersRes,
          ordersRes,
          couponsRes,
          subscribersRes,
          recentProductsRes,
          recentOrdersRes,
        ] = await Promise.all([
          axios.get("/api/product/count"),
          axios.get("/api/category/count"),
          axios.get("/api/user/count"),
          axios.get("/api/order/count"),
          axios.get("/api/coupon/count"),
          axios.get("/api/newsletter/count"),
          axios.get("/api/product/list?limit=5"),
          axios.get("/api/order/list?limit=5"),
        ]);

        setStats({
          products: productsRes.data.count || 0,
          categories: categoriesRes.data.count || 0,
          users: usersRes.data.count || 0,
          orders: ordersRes.data.count || 0,
          coupons: couponsRes.data.count || 0,
          subscribers: subscribersRes.data.count || 0,
        });

        if (recentProductsRes.data.success) {
          setRecentProducts(recentProductsRes.data.products?.slice(0, 5) || []);
        }

        if (recentOrdersRes.data.success) {
          setRecentOrders(recentOrdersRes.data.orders?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [axios]);

  const StatCard = ({ icon: Icon, label, value, color, action, actionLabel }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className="text-3xl text-gray-300" />
      </div>
      {action && (
        <button
          onClick={action}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 group"
        >
          {actionLabel}
          <FaArrowRight className="group-hover:translate-x-1 transition" />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">CMS Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage all your content from one place</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/add-product")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center gap-3 transition"
          >
            <FaPlus /> Add New Product
          </button>
          <button
            onClick={() => navigate("/admin/product-list")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center gap-3 transition"
          >
            <FaBox /> Manage All Products
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FaBox}
            label="Total Products"
            value={stats.products}
            color="border-blue-500"
            action={() => navigate("/admin/product-list")}
            actionLabel="View All"
          />
          <StatCard
            icon={FaTags}
            label="Categories"
            value={stats.categories}
            color="border-green-500"
            action={() => navigate("/admin/category-list")}
            actionLabel="Manage"
          />
          <StatCard
            icon={FaUsers}
            label="Total Users"
            value={stats.users}
            color="border-purple-500"
          />
          <StatCard
            icon={FaShoppingCart}
            label="Total Orders"
            value={stats.orders}
            color="border-orange-500"
          />
          <StatCard
            icon={FaTicketAlt}
            label="Active Coupons"
            value={stats.coupons}
            color="border-yellow-500"
          />
          <StatCard
            icon={FaEnvelope}
            label="Newsletter Subscribers"
            value={stats.subscribers}
            color="border-pink-500"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaClock /> Recent Products
              </h2>
              <button
                onClick={() => navigate("/admin/product-list")}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
              >
                View All →
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : recentProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No products yet</p>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                    onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        (product.stock || 0) > 10
                          ? "bg-green-100 text-green-800"
                          : (product.stock || 0) > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock || 0} units
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <FaChartBar /> Content Status
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Products</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${Math.min(100, (stats.products / 100) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">
                    {stats.products}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Categories</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${Math.min(100, (stats.categories / 20) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">
                    {stats.categories}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Users</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${Math.min(100, (stats.users / 500) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">
                    {stats.users}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Orders</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${Math.min(100, (stats.orders / 200) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">
                    {stats.orders}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Subscribers</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500"
                      style={{ width: `${Math.min(100, (stats.subscribers / 300) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">
                    {stats.subscribers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CMS Features */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Available CMS Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-blue-50 transition cursor-pointer">
              <p className="font-semibold text-gray-900">📝 Product Management</p>
              <p className="text-sm text-gray-600 mt-1">
                Create, edit, and delete products with variants and images
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-blue-50 transition cursor-pointer">
              <p className="font-semibold text-gray-900">🏷️ Category Hierarchy</p>
              <p className="text-sm text-gray-600 mt-1">
                Organize products in multi-level category structure
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-blue-50 transition cursor-pointer">
              <p className="font-semibold text-gray-900">🔍 Advanced Search</p>
              <p className="text-sm text-gray-600 mt-1">
                Filter and sort products by various criteria
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-blue-50 transition cursor-pointer">
              <p className="font-semibold text-gray-900">📊 Inventory Management</p>
              <p className="text-sm text-gray-600 mt-1">
                Track stock levels and availability in real-time
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-blue-50 transition cursor-pointer">
              <p className="font-semibold text-gray-900">📈 Dashboard Analytics</p>
              <p className="text-sm text-gray-600 mt-1">
                View key metrics and content statistics
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-blue-50 transition cursor-pointer">
              <p className="font-semibold text-gray-900">⚡ Bulk Operations</p>
              <p className="text-sm text-gray-600 mt-1">
                Manage multiple items at once for faster workflows
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSDashboard;

import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaShoppingCart,
  FaTicketAlt,
  FaBoxOpen,
  FaTags,
  FaEnvelope,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const AdminDashboard = () => {
  const { axios } = useAppContext();

  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [couponCount, setCouponCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const userTrend = 5;
  const orderTrend = -2;
  const couponTrend = 0;
  const productTrend = 10;
  const categoryTrend = 8;
  const subscriberTrend = 12;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userRes = await axios.get("/api/user/count");
        if (userRes.data.success) setUserCount(userRes.data.count);

        const orderRes = await axios.get("/api/order/count");
        if (orderRes.data.success) setOrderCount(orderRes.data.count);

        const couponRes = await axios.get("/api/coupon/count");
        if (couponRes.data.success) setCouponCount(couponRes.data.count);

        const productRes = await axios.get("/api/product/count");
        if (productRes.data.success) setProductCount(productRes.data.count);

        const categoryRes = await axios.get("/api/category/count");
        if (categoryRes.data.success) setCategoryCount(categoryRes.data.count);

        const subscriberRes = await axios.get("/api/newsletter/count");
        if (subscriberRes.data.success) setSubscriberCount(subscriberRes.data.count);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      }
    };

    fetchCounts();
  }, [axios]);

  const pieData = {
    labels: ["Users", "Orders", "Coupons", "Products", "Categories", "Subscribers"],
    datasets: [
      {
        label: "Dashboard Distribution",
        data: [userCount, orderCount, couponCount, productCount, categoryCount, subscriberCount],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(234, 179, 8, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(220, 38, 38, 0.7)",
          "rgba(20, 184, 166, 0.7)"
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(220, 38, 38, 1)",
          "rgba(20, 184, 166, 1)"
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const analyticsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Users",
        data: [120, 140, 200, 180, 220, 240],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
      },
      {
        label: "Orders",
        data: [90, 100, 150, 130, 160, 180],
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: true,
      },
      {
        label: "Coupons",
        data: [20, 35, 25, 40, 30, 50],
        borderColor: "rgba(234, 179, 8, 1)",
        backgroundColor: "rgba(234, 179, 8, 0.2)",
        fill: true,
      },
      {
        label: "Products",
        data: [60, 70, 90, 85, 95, 110],
        borderColor: "rgba(168, 85, 247, 1)",
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        fill: true,
      },
      {
        label: "Categories",
        data: [5, 7, 6, 8, 10, 12],
        borderColor: "rgba(220, 38, 38, 1)",
        backgroundColor: "rgba(220, 38, 38, 0.2)",
        fill: true,
      },
      {
        label: "Subscribers",
        data: [10, 12, 18, 22, 27, 30],
        borderColor: "rgba(20, 184, 166, 1)",
        backgroundColor: "rgba(20, 184, 166, 0.2)",
        fill: true,
      },
    ],
  };

  const analyticsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Monthly Analytics Overview",
      },
    },
  };

  const renderTrendIcon = (trend) => {
    if (trend > 0) return <FaArrowUp className="inline text-green-500 ml-1" aria-label="up" />;
    if (trend < 0) return <FaArrowDown className="inline text-red-500 ml-1" aria-label="down" />;
    return null;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

      <div className="mt-10 flex flex-col md:flex-row gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">Overview Pie Chart</h3>
          <div className="w-48 h-48">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3">
          <h3 className="text-xl font-semibold mb-4">Analytics Graph</h3>
          <Line data={analyticsData} options={analyticsOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 mt-8">
        <MetricCard title="Total Users" icon={<FaUsers />} count={userCount} trend={userTrend} color="blue" />
        <MetricCard title="Total Orders" icon={<FaShoppingCart />} count={orderCount} trend={orderTrend} color="green" />
        <MetricCard title="Total Coupons" icon={<FaTicketAlt />} count={couponCount} trend={couponTrend} color="yellow" />
        <MetricCard title="Total Products" icon={<FaBoxOpen />} count={productCount} trend={productTrend} color="purple" />
        <MetricCard title="Total Categories" icon={<FaTags />} count={categoryCount} trend={categoryTrend} color="red" />
        <MetricCard title="Subscribers" icon={<FaEnvelope />} count={subscriberCount} trend={subscriberTrend} color="teal" />
      </div>
    </div>
  );
};

const MetricCard = ({ title, icon, count, trend, color }) => {
  const trendColor =
    trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-500";

  const colorClassMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    red: "text-red-600",
    teal: "text-teal-600",
  };

  const colorClass = colorClassMap[color] || "text-gray-600";
  const countColorClass = colorClass.replace("600", "700");

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
      <div className={`${colorClass} text-4xl mb-2`}>{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className={`text-4xl font-extrabold ${countColorClass}`}>{count}</p>
      <span className={`text-sm ${trendColor}`}>
        {trend > 0 ? "+" : ""}
        {trend}%
        {trend !== 0
          ? trend > 0
            ? <FaArrowUp className="inline ml-1" aria-label="increasing trend" />
            : <FaArrowDown className="inline ml-1" aria-label="decreasing trend" />
          : " No change"}
      </span>
    </div>
  );
};

export default AdminDashboard;

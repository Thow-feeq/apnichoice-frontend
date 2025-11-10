import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const AdminLayout = () => {
  const { axios, navigate } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: assets.dashboard_icon },
    { name: "Add Product", path: "/admin/add-product", icon: assets.add_icon },
    { name: "Product List", path: "/admin/product-list", icon: assets.product_list_icon },
    { name: "Add Category", path: "/admin/add-category", icon: assets.add_icon },
    { name: "Category List", path: "/admin/category-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/admin/orders", icon: assets.order_icon },
    { name: "Create Coupon", path: "/admin/create-coupon", icon: assets.create_coupon },
    { name: "User Lists", path: "/admin/UserList", icon: assets.user_list },
    { name: "Coupon List", path: "/admin/coupons", icon: assets.coupon_list },
    { name: "Subscriber List", path: "/admin/subscriberList", icon: assets.subscriber_list }
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/admin/logout');
      if (data.success) {
        toast.success(data.message);
        navigate('/admin');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-[60px] flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-2xl text-gray-700">
            {sidebarOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
          <Link to="/" className="flex items-center max-w-[120px]">
            {/* <img
              src={assets.logo}
              alt="Logo"
              className="max-w-[120px] w-full h-auto object-contain"
            /> */}
          </Link>
        </div>
        <div className="flex items-center gap-4 text-gray-700">
          <span className="hidden sm:inline">Hi, Admin</span>
          <button
            onClick={logout}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-full text-sm shadow transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Layout Container */}
      <div className="flex pt-[60px] h-screen overflow-hidden">

        {/* Sidebar */}
        <aside
          className={`bg-white/80 backdrop-blur-md border-r w-64 fixed md:static z-40 h-full shadow-md transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <nav className="flex flex-col pt-6 h-full overflow-y-auto custom-scrollbar">
            {sidebarLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/seller"}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 gap-4 text-sm font-medium rounded-l-full transition-all 
                   ${isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "hover:bg-gray-100 text-gray-700"}`
                }
              >
                <img src={item.icon} alt={item.name} className="w-6 h-6" />
                <span className="hidden md:inline">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto px-4 py-6 md:px-8 md:py-8 h-full">
          <div className="min-h-[calc(100vh-60px)] rounded-xl bg-white shadow p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;

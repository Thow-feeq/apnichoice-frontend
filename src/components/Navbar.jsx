import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const {
    user, setUser, setShowUserLogin, navigate,
    setSearchQuery, searchQuery, getCartCount, axios
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout');
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products');
    }
  }, [searchQuery]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">

          {/* ✅ MOBILE: Logo + Search */}
          <div className="flex sm:hidden items-center justify-between w-full">
            <NavLink to="/" onClick={() => setOpen(false)}>
              <img src={assets.logo} alt="Logo" className="h-10 object-contain" />
            </NavLink>

            <div className="flex-1 mx-2 relative">
              <input
                type="text"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full border border-gray-300 rounded-full pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center space-x-3">
              <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                <img src={assets.nav_cart_icon} alt="Cart" className="w-6" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              </div>
              <button onClick={() => setOpen(!open)}>
                <img src={assets.menu_icon} alt="Menu" className="w-6" />
              </button>
            </div>
          </div>

          {/* ✅ DESKTOP */}
          <div className="hidden sm:flex items-center justify-between w-full">
            <NavLink to="/" className="flex-shrink-0 mr-6">
              <img src={assets.logo} alt="Logo" className="h-14 object-contain" />
            </NavLink>

            <div className="flex items-center space-x-6">
              <NavLink to="/" className="text-sm text-gray-700 hover:text-primary">Home</NavLink>
              <NavLink to="/products" className="text-sm text-gray-700 hover:text-primary">Products</NavLink>
              <NavLink to="/contact" className="text-sm text-gray-700 hover:text-primary">Contact</NavLink>
              <div
                className="cursor-pointer text-sm text-gray-700"
                onClick={() => setShowLocationPrompt(true)}
              >
                {location || "↓ Location"}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <input
                  type="text"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products"
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                <img src={assets.nav_cart_icon} alt="Cart" className="w-6" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              </div>

              {!user ? (
                <div onClick={() => setShowUserLogin(true)} className="cursor-pointer">
                  <img src={assets.user_icon} alt="User" className="w-8" />
                </div>
              ) : (
                <div className="relative group cursor-pointer flex items-center gap-2">
                  <img src={assets.user_icon} className="w-8" alt="User" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border rounded-md text-sm z-50">
                    <li onClick={() => navigate("my-orders")} className="px-4 py-2 hover:bg-primary/10">My Orders</li>
                    <li onClick={logout} className="px-4 py-2 hover:bg-primary/10">Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Mobile Drawer */}
          {open && (
            <div className="sm:hidden mt-2 bg-white px-6 pb-4 pt-2 shadow-md space-y-3">
              {user && (
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium text-black">{user.name}</span>
                </div>
              )}
              <NavLink to="/" onClick={() => setOpen(false)} className="block text-gray-700 hover:text-primary">Home</NavLink>
              <NavLink to="/products" onClick={() => setOpen(false)} className="block text-gray-700 hover:text-primary">Products</NavLink>
              {user && <NavLink to="/my-orders" onClick={() => setOpen(false)} className="block text-gray-700 hover:text-primary">My Orders</NavLink>}
              <NavLink to="/contact" onClick={() => setOpen(false)} className="block text-gray-700 hover:text-primary">Contact</NavLink>
              {!user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    setShowUserLogin(true);
                  }}
                  className="w-full bg-primary hover:bg-primary-dull text-white px-4 py-2 rounded-full mt-2 text-sm"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={logout}
                  className="w-full bg-primary hover:bg-primary-dull text-white px-4 py-2 rounded-full mt-2 text-sm"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ✅ Location Modal */}
      {showLocationPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-md w-80 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Choose Delivery Location</h2>
            <p className="text-sm text-gray-600">To deliver as quickly as possible, we would like your current location.</p>

            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const { latitude, longitude } = position.coords;
                      setLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
                      setShowLocationPrompt(false);
                    },
                    () => toast.error("Failed to get location.")
                  );
                } else {
                  toast.error("Geolocation not supported.");
                }
              }}
              className="w-full bg-primary hover:bg-primary-dull text-white py-2 rounded"
            >
              Use Current Location
            </button>

            <button
              onClick={() => {
                const manual = prompt("Enter your delivery location:");
                if (manual) {
                  setLocation(manual);
                  setShowLocationPrompt(false);
                }
              }}
              className="w-full border border-primary text-primary hover:bg-primary/10 py-2 rounded"
            >
              Type Manually
            </button>

            <button
              onClick={() => setShowLocationPrompt(false)}
              className="w-full text-sm text-gray-500 underline mt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

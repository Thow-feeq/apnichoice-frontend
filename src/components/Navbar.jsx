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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
        setShowMobileMenu(false);
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-50 via-white to-pink-50 border-b border-gray-200 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 relative">

          {/* Textile Pattern Background Overlay */}
          <div className="absolute inset-0 bg-[url('/assets/textile_pattern.svg')] bg-contain bg-center bg-repeat opacity-5 pointer-events-none"></div>

          {/* MOBILE */}
          <div className="flex sm:hidden items-center justify-between w-full relative z-10">
            <NavLink to="/" onClick={() => setOpen(false)}>
              <img src={assets.logo} alt="Logo" className="h-10 object-contain" />
            </NavLink>

            <div className="flex-1 mx-2 relative">
              <input
                type="text"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fabrics & products"
                className="w-full border border-gray-300 rounded-full pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 backdrop-blur-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center space-x-3">
              <div onClick={() => navigate('/cart')} className="relative cursor-pointer text-center">
                <img src={assets.nav_cart_icon} alt="Cart" className="w-6 mx-auto" />
                <span className="text-xs text-gray-600">Cart</span>
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              </div>

              <div
                className="text-center cursor-pointer relative"
                onClick={() => {
                  if (!user) setShowUserLogin(true);
                  else setShowMobileMenu(!showMobileMenu);
                }}
              >
                <img src={assets.user_icon} alt="User" className="w-6 mx-auto" />
                <span className="text-xs text-gray-600">{user ? user.name : 'Login'}</span>

                {user && showMobileMenu && (
                  <ul className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow z-50 text-sm">
                    <li
                      onClick={() => {
                        navigate('/my-orders');
                        setShowMobileMenu(false);
                      }}
                      className="px-4 py-2 hover:bg-pink-100 cursor-pointer"
                    >
                      My Orders
                    </li>
                    <li
                      onClick={logout}
                      className="px-4 py-2 hover:bg-pink-100 cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                )}
              </div>

              <button onClick={() => setOpen(!open)}>
                <img src={assets.menu_icon} alt="Menu" className="w-6" />
              </button>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden sm:flex items-center justify-between w-full relative z-10">
            <NavLink to="/" className="flex-shrink-0 mr-6">
              {/* <img src={assets.logo} alt="Logo" className="h-14 object-contain" /> */}
            </NavLink>

            <div className="flex items-center space-x-6 font-medium text-gray-700">
              <NavLink to="/" className="text-sm hover:text-pink-500 transition">Home</NavLink>
              <NavLink to="/products" className="text-sm hover:text-pink-500 transition">Products</NavLink>
              <NavLink to="/contact" className="text-sm hover:text-pink-500 transition">Contact</NavLink>
              <div
                className="cursor-pointer text-sm hover:text-pink-500 transition"
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
                  placeholder="Search fabrics & patterns"
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 backdrop-blur-sm"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <div onClick={() => navigate('/cart')} className="relative cursor-pointer text-center">
                <img src={assets.nav_cart_icon} alt="Cart" className="w-6 mx-auto" />
                <span className="text-xs text-gray-600">Cart</span>
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              </div>

              {!user ? (
                <div onClick={() => setShowUserLogin(true)} className="cursor-pointer text-center">
                  <img src={assets.user_icon} alt="User" className="w-8 mx-auto" />
                  <span className="text-xs text-gray-600">Login</span>
                </div>
              ) : (
                <div className="relative group cursor-pointer flex flex-col items-center text-center">
                  <img src={assets.user_icon} className="w-8 mx-auto" alt="User" />
                  <span className="text-xs text-gray-600">{user.name}</span>
                  <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border rounded-md text-sm z-50">
                    <li onClick={() => navigate("my-orders")} className="px-4 py-2 hover:bg-pink-100">My Orders</li>
                    <li onClick={logout} className="px-4 py-2 hover:bg-pink-100">Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Drawer */}
          {open && (
            <div className="sm:hidden mt-2 bg-white px-6 pb-4 pt-2 shadow-md space-y-3 relative z-10">
              {user && (
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium text-black">{user.name}</span>
                </div>
              )}
              <NavLink to="/" onClick={() => setOpen(false)} className="block text-gray-700 hover:text-pink-500">Home</NavLink>
              <NavLink to="/products" onClick={() => setOpen(false)} className="block text-gray-700 hover:text-pink-500">Products</NavLink>
              {user && <NavLink to="/my-orders" onClick={() => setOpen(false)} className="block text-gray-700 hover:text-pink-500">My Orders</NavLink>}
              <NavLink to="/contact" onClick={() => setOpen(false)} className="block text-gray-700 hover:text-pink-500">Contact</NavLink>
              {!user ? (
                <button
                  onClick={() => { setOpen(false); setShowUserLogin(true); }}
                  className="w-full bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded-full mt-2 text-sm"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={logout}
                  className="w-full bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded-full mt-2 text-sm"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

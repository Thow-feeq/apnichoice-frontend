import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || '₹';
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth", { headers: authHeaders() });
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch {
      setUser(null);
      setCartItems({});
    }
  };

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth", { headers: authHeaders() });
      setIsSeller(data.success === true);
    } catch {
      setIsSeller(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const addToCart = (itemId) => {
    const updatedCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(updatedCart);
    toast.success("Added to Cart");
  };

  const syncCart = async () => {
    try {
      if (user) {
        await axios.post("/api/cart/update", { cartItems }, { headers: authHeaders() });
      }
    } catch (error) {
      toast.error("Failed to sync cart");
    }
  };

  useEffect(() => { syncCart(); }, [cartItems]);
  useEffect(() => { fetchUser(); fetchSeller(); fetchProducts(); }, []);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    axios,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

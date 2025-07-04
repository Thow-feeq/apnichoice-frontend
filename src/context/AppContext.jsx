import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Set Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

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

  // Fetch authenticated user
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      setUser(null);
      setCartItems({});
    }
  };

  // Fetch seller authentication
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success === true);
    } catch {
      setIsSeller(false);
    }
  };

  // Fetch products with retry
  const fetchProducts = async (retries = 3, delay = 1000) => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to load products");
      }
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => fetchProducts(retries - 1, delay * 2), delay);
      } else {
        toast.error(error.message || "Failed to load products");
      }
    }
  };

  // Add item to cart
  const addToCart = (itemId) => {
    const updatedCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(updatedCart);
    toast.success("Added to Cart");
  };

  // Update item quantity
  const updateCartItem = (itemId, quantity) => {
    const updatedCart = { ...cartItems, [itemId]: quantity };
    setCartItems(updatedCart);
    toast.success("Cart Updated");
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = { ...cartItems };
    if (updatedCart[itemId] > 1) {
      updatedCart[itemId] -= 1;
    } else {
      delete updatedCart[itemId];
    }
    setCartItems(updatedCart);
    toast.success("Removed from Cart");
  };

  // Get cart item count
  const getCartCount = () => Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  // Get cart total amount
  const getCartAmount = () => {
    return Math.floor(
      Object.entries(cartItems).reduce((total, [id, qty]) => {
        const product = products.find(p => p._id === id);
        return total + (product ? product.offerPrice * qty : 0);
      }, 0) * 100
    ) / 100;
  };

  // Sync cart to backend when changed
  useEffect(() => {
    const syncCart = async () => {
      try {
        if (user) {
          const { data } = await axios.post("/api/cart/update", { cartItems });
          if (!data.success) toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message || "Failed to sync cart");
      }
    };

    syncCart();
  }, [cartItems]);

  // Initial load
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

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
    updateCartItem,
    removeFromCart,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

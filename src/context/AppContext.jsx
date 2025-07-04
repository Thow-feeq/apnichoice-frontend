import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth", { withCredentials: true });
      setIsSeller(data.success === true);
    } catch {
      setIsSeller(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth", { withCredentials: true });
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

  const fetchProducts = async (retries = 3, delay = 1000) => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to load products");
      }
    } catch (error) {
      if (error.code === "ECONNRESET" && retries > 0) {
        setTimeout(() => fetchProducts(retries - 1, delay * 2), delay);
      } else {
        toast.error(error.message || "Failed to load products");
      }
    }
  };

  const addToCart = async (itemId) => {
    const token = localStorage.getItem('token');
    const updatedCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(updatedCart);

    try {
      const { data } = await axios.post("/api/cart/add", { productId: itemId }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      if (data.success) {
        toast.success("Added to Cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    const token = localStorage.getItem('token');
    const updatedCart = { ...cartItems, [itemId]: quantity };
    setCartItems(updatedCart);

    try {
      const { data } = await axios.post("/api/cart/update-item", { productId: itemId, quantity }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      if (data.success) {
        toast.success("Cart Updated");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem('token');
    const updatedCart = { ...cartItems };
    if (updatedCart[itemId] > 1) {
      updatedCart[itemId] -= 1;
    } else {
      delete updatedCart[itemId];
    }
    setCartItems(updatedCart);

    try {
      const { data } = await axios.post("/api/cart/remove", { productId: itemId }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      if (data.success) {
        toast.success("Removed from Cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove from cart");
    }
  };

  const getCartCount = () => Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  const getCartAmount = () => {
    return Math.floor(Object.entries(cartItems).reduce((total, [id, qty]) => {
      const product = products.find(p => p._id === id);
      return total + (product ? product.offerPrice * qty : 0);
    }, 0) * 100) / 100;
  };

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  useEffect(() => {
    const syncCart = async () => {
      const token = localStorage.getItem('token');
      try {
        await axios.post("/api/cart/update", { cartItems }, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to sync cart");
      }
    };
    if (user) syncCart();
  }, [cartItems]);

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
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

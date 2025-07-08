import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Axios global config
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.timeout = 10000;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Set auth token and attach to axios
  const setAuthToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  // ✅ Remove token from axios + storage
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsSeller(false);
    setCartItems({});
    toast.success("Logged out");
    navigate("/");
  };

  // ✅ Load token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // ✅ Fetch current user
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setCartItems(data.user.cartItems || {});
        localStorage.setItem("cartItems", JSON.stringify(data.user.cartItems || {}));
      }
    } catch {
      setUser(null);
      localStorage.removeItem("user");
      setCartItems({});
      localStorage.removeItem("cartItems");
    }
  };

  // ✅ Fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success === true);
    } catch {
      setIsSeller(false);
    }
  };

  // ✅ Fetch product list
  const fetchProducts = async (retries = 3, delay = 1000) => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.code === "ECONNRESET" && retries > 0) {
        setTimeout(() => fetchProducts(retries - 1, delay * 2), delay);
      } else {
        toast.error(error.message || "Failed to fetch products");
      }
    }
  };

  // ✅ Cart Actions
  const addToCart = (itemId) => {
    const updated = { ...cartItems };
    updated[itemId] = (updated[itemId] || 0) + 1;
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    toast.success("Added to Cart");
  };

  const updateCartItem = (itemId, quantity) => {
    const updated = { ...cartItems, [itemId]: quantity };
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    toast.success("Cart Updated");
  };

  const removeFromCart = (itemId) => {
    const updated = { ...cartItems };
    if (updated[itemId]) {
      updated[itemId] -= 1;
      if (updated[itemId] <= 0) delete updated[itemId];
      setCartItems(updated);
      localStorage.setItem("cartItems", JSON.stringify(updated));
      toast.success("Removed from Cart");
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) total += product.offerPrice * cartItems[itemId];
    }
    return Math.floor(total * 100) / 100;
  };

  // ✅ Sync cart to server if logged in
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) toast.error(data.message);
      } catch (error) {
        toast.error(error.message || "Failed to update cart");
      }
    };
    if (user) updateCart();
  }, [cartItems]);

  const value = {
    navigate,
    user,
    setUser: (u) => {
      setUser(u);
      if (u) localStorage.setItem("user", JSON.stringify(u));
      else localStorage.removeItem("user");
    },
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItems,
    setCartItems: (c) => {
      setCartItems(c);
      localStorage.setItem("cartItems", JSON.stringify(c));
    },
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartCount,
    getCartAmount,
    searchQuery,
    setSearchQuery,
    fetchProducts,
    setAuthToken,
    logoutUser,
    axios, // optional
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

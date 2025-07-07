import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Axios config
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.timeout = 10000;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Set token into axios + localStorage
  const setAuthToken = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // ✅ Remove token on logout
  const logoutUser = async () => {
    try {
      await axios.get("/api/user/logout");
    } catch (err) {
      console.error("Logout failed", err);
    }

    setUser(null);
    setCartItems({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out");
    navigate("/");
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setCartItems(data.user.cartItems || {});
        localStorage.setItem("cartItems", JSON.stringify(data.user.cartItems || {}));
      }
    } catch (err) {
      console.log("Auth check failed", err.message);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("cartItems");
    }
  };

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success === true);
    } catch {
      setIsSeller(false);
    }
  };

  const fetchProducts = async (retries = 3, delay = 1000) => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Product fetch error:", err);
      if (retries > 0) {
        setTimeout(() => fetchProducts(retries - 1, delay * 2), delay);
      } else {
        toast.error("Failed to fetch products");
      }
    }
  };

  const addToCart = (itemId) => {
    const cart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(cart);
    localStorage.setItem("cartItems", JSON.stringify(cart));
    toast.success("Added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    const cart = { ...cartItems, [itemId]: quantity };
    setCartItems(cart);
    localStorage.setItem("cartItems", JSON.stringify(cart));
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    const cart = { ...cartItems };
    if (cart[itemId]) {
      cart[itemId] -= 1;
      if (cart[itemId] <= 0) delete cart[itemId];
      setCartItems(cart);
      localStorage.setItem("cartItems", JSON.stringify(cart));
      toast.success("Removed from cart");
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, qty]) => {
      const product = products.find((p) => p._id === itemId);
      return product ? total + product.offerPrice * qty : total;
    }, 0);
  };

  // ✅ On app start — safely set token and fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Loaded token on app start:", token);

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    }

    fetchSeller();
    fetchProducts();
  }, []);

  // 🔄 Sync cart with backend when changed
  useEffect(() => {
    const syncCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) toast.error(data.message);
      } catch (err) {
        toast.error("Failed to update cart");
      }
    };
    if (user) syncCart();
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
    axios,
    fetchProducts,
    setAuthToken,
    logoutUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
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
  const [loading, setLoading] = useState(true); // 👈 NEW
  const [searchQuery, setSearchQuery] = useState("");

  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : {};
  });

  const setAuthToken = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logoutUser = async () => {
    try {
      await axios.get("/api/user/logout");

      setUser(null);
      setCartItems({});
      localStorage.removeItem("user");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
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

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setCartItems(data.user.cartItems || {});
        localStorage.setItem("cartItems", JSON.stringify(data.user.cartItems || {}));
      } else {
        setUser(null);
        localStorage.removeItem("user");
        setCartItems({});
        localStorage.removeItem("cartItems");
      }
    } catch {
      setUser(null);
      localStorage.removeItem("user");
      setCartItems({});
      localStorage.removeItem("cartItems");
    } finally {
      setLoading(false); // ✅ Stop loading after fetch
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
    } catch (error) {
      console.error("List Products Error:", error);
      if (error.code === "ECONNRESET" && retries > 0) {
        toast.error("Connection reset. Retrying...");
        setTimeout(() => fetchProducts(retries - 1, delay * 2), delay);
      } else {
        toast.error(error.message || "Failed to fetch products");
      }
    }
  };

  const addToCart = (itemId) => {
    const cartData = { ...cartItems };
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    localStorage.setItem("cartItems", JSON.stringify(cartData));
    toast.success("Added to Cart");
  };

  const updateCartItem = (itemId, quantity) => {
    const cartData = { ...cartItems, [itemId]: quantity };
    setCartItems(cartData);
    localStorage.setItem("cartItems", JSON.stringify(cartData));
    toast.success("Cart Updated");
  };

  const removeFromCart = (itemId) => {
    const cartData = { ...cartItems };
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) delete cartData[itemId];
      setCartItems(cartData);
      localStorage.setItem("cartItems", JSON.stringify(cartData));
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

  // ✅ On first load: attach token, then fetch user/seller/products
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser(); // ✅ fetch user after setting header
    } else {
      setUser(null);
      setCartItems({});
      setLoading(false);
    }

    fetchSeller();
    fetchProducts();
  }, []);

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
    setUser: (user) => {
      setUser(user);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    },
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
    setCartItems: (cart) => {
      setCartItems(cart);
      localStorage.setItem("cartItems", JSON.stringify(cart));
    },
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setAuthToken,
    logoutUser,
  };

  // ✅ Delay rendering until loading finishes (prevents flicker/logout)
  if (loading) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

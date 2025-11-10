import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.timeout = 15000; // Increased timeout

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : {};
  });
  const [searchQuery, setSearchQuery] = useState("");

  // -----------------------
  // Token & Auth Handling
  // -----------------------
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  };

  const logoutUser = () => {
    console.log("🔴 Logging out user");
    setUser(null);
    setIsSeller(false);
    setCartItems({});
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    setAuthToken(null);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return logoutUser();

    setAuthToken(token);

    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        console.log("✅ Fetched user:", data.user);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setCartItems(data.user.cartItems || {});
      } else {
        console.warn("⚠️ User not authenticated:", data.message);
        logoutUser();
      }
    } catch (err) {
      console.error("❌ fetchUser error:", err.message);
      logoutUser();
    }
  };

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-auth");
      setIsSeller(data.success === true);
    } catch {
      setIsSeller(false);
    }
  };

  // -----------------------
  // Products
  // -----------------------
  const fetchProducts = async (retries = 3, delay = 1000) => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
      else toast.error(data.message);
    } catch (error) {
      console.error("Fetch products error:", error.message);
      if (retries > 0) {
        console.log(`Retrying in ${delay}ms... (${retries} attempts left)`);
        setTimeout(() => fetchProducts(retries - 1, delay * 2), delay);
      } else {
        toast.error("Failed to fetch products. Check your connection.");
      }
    }
  };

  // -----------------------
  // Cart Operations
  // -----------------------
  const addToCart = (id) => {
    const newCart = { ...cartItems, [id]: (cartItems[id] || 0) + 1 };
    setCartItems(newCart);
    localStorage.setItem("cartItems", JSON.stringify(newCart));
    toast.success("Added to cart");
  };

  const updateCartItem = (id, qty) => {
    const newCart = { ...cartItems, [id]: qty };
    setCartItems(newCart);
    localStorage.setItem("cartItems", JSON.stringify(newCart));
  };

  const removeFromCart = (id) => {
    const newCart = { ...cartItems };
    if (newCart[id]) {
      newCart[id] -= 1;
      if (newCart[id] <= 0) delete newCart[id];
      setCartItems(newCart);
      localStorage.setItem("cartItems", JSON.stringify(newCart));
      toast.success("Removed from cart");
    }
  };

  const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);
  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const prod = products.find((p) => p._id === id);
      return prod ? total + prod.offerPrice * qty : total;
    }, 0);
  };

  // -----------------------
  // Initialize
  // -----------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // Sync cart with backend when user changes
  useEffect(() => {
    if (!user) return;
    const updateCart = async () => {
      try {
        await axios.post("/api/cart/update", { cartItems });
      } catch (err) {
        toast.error(err.message || "Failed to update cart");
      }
    };
    updateCart();
  }, [cartItems, user]);

  return (
    <AppContext.Provider
      value={{
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
        addToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        setCartItems,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        getCartCount,
        fetchProducts,
        axios,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

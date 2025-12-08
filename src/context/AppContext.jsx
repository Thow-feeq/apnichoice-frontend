import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000;

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

  // ✅ LOGOUT (COOKIE BASED)
  const logoutUser = async () => {
    try {
      await axios.get("/api/user/logout");
    } catch {}
    setUser(null);
    setIsSeller(false);
    setCartItems({});
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    navigate("/");
  };

  // ✅ FETCH USER (COOKIE ONLY)
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setCartItems(data.user.cartItems || {});
      }
    } catch {
      // ✅ silent fail – NO popup
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

  // ✅ PRODUCTS
  const fetchProducts = async (retries = 3, delay = 1000) => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => fetchProducts(retries - 1, delay * 2), delay);
      } else {
        toast.error("Failed to fetch products");
      }
    }
  };

  // ✅ CART – FRONTEND
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

  const getCartCount = () =>
    Object.values(cartItems).reduce((a, b) => a + b, 0);

  const getCartAmount = () =>
    Object.entries(cartItems).reduce((total, [id, qty]) => {
      const prod = products.find((p) => p._id === id);
      return prod ? total + prod.offerPrice * qty : total;
    }, 0);

  // ✅ INIT
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // ✅ SAFE CART BACKEND SYNC (COOKIE)
  useEffect(() => {
    if (!user) return;

    const updateCart = async () => {
      try {
        await axios.post("/api/cart/update", { cartItems });
      } catch {
        // ✅ no popup
      }
    };

    const timeout = setTimeout(updateCart, 800);
    return () => clearTimeout(timeout);
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

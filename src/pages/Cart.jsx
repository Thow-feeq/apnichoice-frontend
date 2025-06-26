import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from '../assets/assets';
import toast from "react-hot-toast";

const Cart = () => {
    const {
        products, currency, cartItems, removeFromCart, getCartCount,
        updateCartItem, navigate, getCartAmount, axios, user, setCartItems
    } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return toast.error("Please enter a coupon code");

        try {
            const { data } = await axios.post('/api/coupon/apply', {
                code: couponCode,
                cartTotal: getCartAmount()
            });

            if (data.success) {
                toast.success(data.message);
                setDiscount(data.discountAmount); // e.g., flat or % discount computed in backend
                setAppliedCoupon(data.coupon);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to apply coupon");
            console.error(error);
        }
    };

    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key);
            if (product) {
                product.quantity = cartItems[key];
                tempArray.push(product);
            }
        }
        setCartArray(tempArray);
    };

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                setAddresses(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const placeOrder = async () => {
        if (!user) {
            toast.error("Please login to place an order");
            return navigate("/login");
        }

        try {
            if (!selectedAddress) {
                return toast.error("Please select an address");
            }

            const payload = {
                userId: user._id,
                items: cartArray.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                address: selectedAddress._id,
                couponCode: couponCode || null, // <-- Include couponCode
            };

            if (paymentOption === "COD") {
                const { data } = await axios.post('/api/order/cod', payload);

                if (data.success) {
                    toast.success(data.message);
                    setCartItems({});
                    navigate('/my-orders');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post('/api/order/stripe', payload);

                if (data.success) {
                    window.location.replace(data.url);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    useEffect(() => {
        if (user) {
            getUserAddress();
        }
    }, [user]);

    // ✅ Show login success toast ONCE after login
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loginSuccess = localStorage.getItem('loginSuccess');
            if (loginSuccess === 'true') {
                toast.success('Login created successfully');
                localStorage.removeItem('loginSuccess');
            }
        }
    }, []);

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-26">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => {
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                                scrollTo(0, 0);
                            }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="mr-2">Qty:</p>
                                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                        <button
                                            onClick={() => {
                                                const newQty = Math.max(1, product.quantity - 1);
                                                updateCartItem(product._id, newQty);
                                            }}
                                            className="px-3 py-1 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                            disabled={product.quantity <= 1}
                                        >
                                            –
                                        </button>
                                        <div className="px-4 py-1 text-center min-w-[2rem]">{product.quantity}</div>
                                        <button
                                            onClick={() => {
                                                updateCartItem(product._id, product.quantity + 1);
                                            }}
                                            className="px-3 py-1 text-gray-700 hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                        <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">
                            <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
                        </button>
                    </div>
                ))}

                <button onClick={() => { navigate("/products"); scrollTo(0, 0); }} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow" />
                    Continue Shopping
                </button>
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <div className="mt-4">
                    <label className="text-sm font-medium">Coupon Code</label>
                    <div className="flex gap-2 mt-2">
                        <input
                            type="text"
                            className="w-full border border-gray-300 px-3 py-2 outline-none"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button onClick={applyCoupon} className="bg-primary text-white px-4 py-2">
                            Apply
                        </button>
                    </div>
                    {appliedCoupon && (
                        <p className="text-green-600 mt-2 text-sm">
                            Coupon <strong>{appliedCoupon.code}</strong> applied — Discount: {currency}{discount}
                        </p>
                    )}
                </div>

                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                                {addresses.map((address, index) => (
                                    <p key={index} onClick={() => { setSelectedAddress(address); setShowAddress(false); }} className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer">
                                        {address.street}, {address.city}, {address.state}, {address.country}
                                    </p>
                                ))}
                                <p
                                    onClick={() => {
                                        if (!user) {
                                            toast.error("You should login");
                                            return navigate("/login");
                                        }
                                        navigate("/add-address");
                                    }}
                                    className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                                >
                                    Add address
                                </p>

                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onChange={e => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>{currency}{getCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{getCartAmount() * 2 / 100}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>
                            {(getCartAmount() + getCartAmount() * 0.02 - discount).toFixed(2)}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition">
                    {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    ) : null;
};

export default Cart;

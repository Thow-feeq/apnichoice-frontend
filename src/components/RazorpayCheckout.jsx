import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RazorpayCheckout = ({ amount, selectedAddress, user, cartArray, couponCode, setCartItems }) => {
  const handlePayment = async () => {
    if (!user || !selectedAddress) {
      toast.error("Please login and select an address");
      return;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`, { amount });
      const { order } = data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Apni Choice",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const payload = {
              userId: user._id,
              items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
              address: selectedAddress._id,
              couponCode: couponCode || null,
              paymentId: response.razorpay_payment_id,
              amount: amount / 100,
            };

            const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/online`, payload);

            if (result.data.success) {
              toast.success("✅ Payment & Order Placed Successfully!");
              setCartItems({});
              setTimeout(() => {
                window.location.href = '/my-orders';
              }, 1000);
            } else {
              toast.error(result.data.message || "❌ Order placement failed");
            }
          } catch (err) {
            toast.error("❌ Something went wrong while placing the order");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#528FF0"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("❌ Payment failed: " + (error?.response?.data?.message || error.message));
    }
  };

  return (
    <button onClick={handlePayment} className="bg-primary text-white px-4 py-3 w-full mt-6">
      Pay Now with Razorpay
    </button>
  );
};

export default RazorpayCheckout;

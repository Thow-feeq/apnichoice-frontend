import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {

  const { axios, user, currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await axios.get("/api/order/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setOrders(res.data.orders || []);
        }

      } catch (err) {
        console.error("Orders fetch error:", err);
      }

      setLoading(false);
    };

    if (user) fetchOrders();

  }, [user, axios]);



  if (!user) return null;

  return (
    <section className="mt-24 px-4 pb-24 max-w-6xl mx-auto">

      {/* PAGE HEADER */}
      <div className="flex justify-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 uppercase">
            My Orders
          </h1>
          <div className="h-1 w-16 bg-red-600 mt-2 ml-auto rounded-full"></div>
        </div>
      </div>


      {/* LOADING */}
      {loading && (
        <div className="text-center py-20 text-gray-500">
          Loading orders...
        </div>
      )}


      {/* EMPTY STATE */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-24">

          <p className="text-xl text-gray-500 mb-6">
            You haven't placed any orders yet.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md"
          >
            Browse Products
          </button>

        </div>
      )}


      {/* ORDERS LIST */}
      {!loading && orders.length > 0 && (

        <div className="space-y-8">

          {orders.map((order) => {

            const amount = order.amount || 0;
            const discount = order.discountAmount || 0;
            const total = order.totalAmount || amount - discount;

            return (

              <div
                key={order._id}
                className="border rounded-lg bg-white p-6 shadow-sm"
              >

                {/* ORDER HEADER */}
                <div className="flex flex-wrap justify-between text-sm text-gray-600 mb-6 gap-4">
                  {/* ORDER TRACKING */}
                  <div className="flex items-center justify-between mt-6 text-xs md:text-sm">

                    <div className={`flex flex-col items-center ${["Pending", "Processing", "Dispatched", "Delivered"].includes(order.status)
                      ? "text-green-600"
                      : "text-gray-400"
                      }`}>
                      <div className="w-4 h-4 rounded-full bg-current"></div>
                      <p className="mt-1">Confirmed</p>
                    </div>

                    <div className={`flex-1 h-1 mx-2 ${["Dispatched", "Delivered"].includes(order.status)
                      ? "bg-green-600"
                      : "bg-gray-200"
                      }`}></div>

                    <div className={`flex flex-col items-center ${["Dispatched", "Delivered"].includes(order.status)
                      ? "text-green-600"
                      : "text-gray-400"
                      }`}>
                      <div className="w-4 h-4 rounded-full bg-current"></div>
                      <p className="mt-1">Dispatched</p>
                    </div>

                    <div className={`flex-1 h-1 mx-2 ${order.status === "Delivered"
                      ? "bg-green-600"
                      : "bg-gray-200"
                      }`}></div>

                    <div className={`flex flex-col items-center ${order.status === "Delivered"
                      ? "text-green-600"
                      : "text-gray-400"
                      }`}>
                      <div className="w-4 h-4 rounded-full bg-current"></div>
                      <p className="mt-1">Delivered</p>
                    </div>

                  </div>

                  <span>
                    <strong>Order ID:</strong> {order._id}
                  </span>

                  <span>
                    <strong>Payment:</strong>{" "}
                    {order.paymentType === "COD"
                      ? "Cash On Delivery"
                      : "Online"}
                  </span>

                  <span>
                    <strong>Amount:</strong>{" "}
                    {currency}{amount}
                  </span>

                  <span>
                    <strong>Total:</strong>{" "}
                    {currency}{total}
                  </span>

                  <span className="bg-gray-100 px-3 py-1 ">
                    Status: {order.status}
                  </span>

                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Status: {order.status}
                  </span>

                  {order.courier && (
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      Courier: {order.courier}
                    </span>
                  )}

                  {order.trackingId && (
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                      Tracking: {order.trackingId}
                    </span>
                  )}

                  <button
                    onClick={() => navigate(`/invoice/${order._id}`)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Invoice
                  </button>
                </div>


                {/* ITEMS */}
                <div className="divide-y">

                  {order.items?.map((item, index) => {

                    const product = item.product;

                    if (!product) return null;

                    return (

                      <div
                        key={index}
                        className="py-6 flex flex-col md:flex-row gap-6 md:items-center"
                      >

                        <div className="flex gap-4 items-center flex-1">

                          <img
                            src={product.image?.[0] || "/placeholder.png"}
                            alt={product.name}
                            className="w-16 h-16 rounded object-cover bg-gray-100"
                          />

                          <div>

                            <h3 className="font-semibold text-lg">
                              {product.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              Category: {product.category}
                            </p>

                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>

                          </div>

                        </div>


                        <div className="text-sm text-gray-500 md:text-right">

                          {new Date(order.createdAt).toLocaleDateString()}

                        </div>

                      </div>

                    );

                  })}

                </div>

              </div>

            );

          })}

        </div>

      )}

    </section>
  );
};

export default MyOrders;
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const { data } = await axios.get("/api/order/user");
          if (data.success) setMyOrders(data.orders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (!user) return null;

  return (
    <section className="mt-26 px-4 pb-24 max-w-6xl mx-auto">
      <header className="text-right mb-10">
        <h2 className="text-3xl font-bold text-gray-800 uppercase">My Orders</h2>
        <div className="w-16 h-1 bg-primary rounded-full ml-auto mt-1" />
      </header>

      {myOrders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {myOrders.map((order) => {
            const amount = order.amount || 0; // Original price before discount
            const discount = order.discountAmount || 0;
            const total = order.totalAmount || (amount - discount);

            return (
              <article
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                {/* Top Meta */}
                <div className="flex flex-wrap justify-between text-sm text-gray-600 mb-6 gap-y-2">
                  <span>
                    <strong className="text-gray-800">Order ID:</strong> {order._id}
                  </span>
                  <span>
                    <strong>Payment:</strong>{" "}
                    {order.paymentType === "COD" ? "Cash On Delivery" : "Online"}
                  </span>
                  <span>
                    <strong>Amount:</strong>{" "}
                    <span className="text-primary font-semibold">
                      {currency}{amount}
                    </span>
                  </span>
                  <span>
                    <strong>Total:</strong>{" "}
                    <span className="text-primary font-semibold">
                      {currency}{total}
                    </span>
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                    Status: {order.status}
                  </span>
                </div>

                {/* Timeline */}
                <div className="mt-4 border-l-2 border-primary pl-6 relative space-y-5">
                  <div className="flex items-start gap-3 relative">
                    <div className="absolute -left-3 w-3 h-3 bg-primary rounded-full top-1" />
                    <div>
                      <p className="font-semibold text-gray-800">Order Confirmed</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {(order.status === "Dispatched" || order.status === "Delivered") && (
                    <div className="flex items-start gap-3 relative">
                      <div className="absolute -left-3 w-3 h-3 bg-primary rounded-full top-1" />
                      <div>
                        <p className="font-semibold text-gray-800">Dispatched</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === "Delivered" && (
                    <div className="flex items-start gap-3 relative">
                      <div className="absolute -left-3 w-3 h-3 bg-primary rounded-full top-1" />
                      <div>
                        <p className="font-semibold text-gray-800">Delivered</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Coupon & Discount */}
                {order.couponCode && (
                  <div className="text-sm text-green-600 mt-4">
                    <strong>Coupon Applied:</strong> {order.couponCode}
                  </div>
                )}

                {discount > 0 && (
                  <div className="text-sm text-red-600 mt-1">
                    <strong>Discount:</strong> -{currency}{discount}
                  </div>
                )}

                {/* Items */}
                <div className="divide-y divide-gray-200 mt-6">
                  {order.items
                    .filter((item) => item?.product)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="py-6 flex flex-col md:flex-row md:items-center gap-6"
                      >
                        <div className="flex items-center gap-4 w-full md:w-2/3">
                          <div className="bg-gray-100 p-3 rounded-lg shrink-0">
                            <img
                              src={item.product.image?.[0] || "/placeholder.png"}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Category: {item.product.category}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 w-full md:w-1/3 text-left md:text-right">
                          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyOrders;

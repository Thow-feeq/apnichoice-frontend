import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Orders = () => {

  const { currency, axios } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [courierData, setCourierData] = useState({});

  const itemsPerPage = 5;

  const fetchOrders = async () => {

    try {

      const { data } = await axios.get("/api/order/seller");

      if (data.success) setOrders(data.orders);
      else toast.error(data.message);

    } catch (error) {

      toast.error(error.message);

    }

  };

  const updateStatus = async (orderId, status, courier = "", trackingId = "") => {

    try {

      const { data } = await axios.put("/api/order/update-status", {
        orderId,
        status,
        courier,
        trackingId
      });

      if (data.success) {

        toast.success("Order updated");
        fetchOrders();

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      toast.error(error.message);

    }

  };

  useEffect(() => {

    fetchOrders();

  }, []);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCourierChange = (orderId, field, value) => {

    setCourierData(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));

  };

  return (

    <div className="flex-1 bg-gray-50 h-[95vh] overflow-y-scroll">

      <div className="p-6 md:p-10">

        <h1 className="text-2xl font-semibold mb-6">Orders Management</h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No Orders</p>
        ) : (

          paginatedOrders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-6 mb-6 border"
            >

              <div className="grid md:grid-cols-4 gap-6">

                {/* PRODUCTS */}

                <div className="col-span-2">

                  {order.items?.map((item, idx) => (

                    <div key={idx} className="flex gap-4 mb-3">

                      <img
                        src={item.product?.images?.[0]}
                        className="w-14 h-14 rounded object-cover"
                      />

                      <div>

                        <p className="font-medium">
                          {item.product?.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty : {item.quantity}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

                {/* ADDRESS */}

                <div className="text-sm text-gray-700">

                  <p className="font-semibold mb-2">
                    {order.address?.firstName} {order.address?.lastName}
                  </p>

                  <p>{order.address?.street}</p>
                  <p>{order.address?.city}</p>
                  <p>{order.address?.state}</p>
                  <p>{order.address?.zipcode}</p>
                  <p>{order.address?.phone}</p>

                </div>

                {/* ORDER INFO */}

                <div className="space-y-2">

                  <p className="text-lg font-bold">
                    {currency}{order.amount}
                  </p>

                  <p>
                    <strong>Payment :</strong> {order.paymentType}
                  </p>

                  <p>
                    <strong>Date :</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <p>

                    <strong>Status :</strong>

                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded text-white
                      ${
                        order.status === "Delivered"
                          ? "bg-green-500"
                          : order.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {order.status}
                    </span>

                  </p>

                  {/* COURIER INFO DISPLAY */}

                  {order.courier && (
                    <p>
                      <strong>Courier :</strong> {order.courier}
                    </p>
                  )}

                  {order.trackingId && (
                    <p>
                      <strong>Tracking :</strong> {order.trackingId}
                    </p>
                  )}

                  {/* ACTIONS */}

                  <div className="flex flex-col gap-2 pt-2">

                    {order.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(order._id, "Accepted")}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => updateStatus(order._id, "Rejected")}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {order.status === "Accepted" && (

                      <>
                        {/* COURIER SELECT */}

                        <select
                          className="border rounded p-1 text-sm"
                          onChange={(e) =>
                            handleCourierChange(order._id, "courier", e.target.value)
                          }
                        >

                          <option value="">Select Courier</option>
                          <option value="DTDC">DTDC</option>
                          <option value="Delhivery">Delhivery</option>
                          <option value="BlueDart">BlueDart</option>
                          <option value="India Post">India Post</option>

                        </select>

                        {/* TRACKING INPUT */}

                        <input
                          type="text"
                          placeholder="Tracking ID"
                          className="border rounded p-1 text-sm"
                          onChange={(e) =>
                            handleCourierChange(order._id, "trackingId", e.target.value)
                          }
                        />

                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "Dispatched",
                              courierData[order._id]?.courier,
                              courierData[order._id]?.trackingId
                            )
                          }
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                        >
                          Dispatch
                        </button>

                      </>

                    )}

                    {order.status === "Dispatched" && (
                      <button
                        onClick={() =>
                          updateStatus(order._id, "Delivered")
                        }
                        className="px-3 py-1 text-sm bg-purple-600 text-white rounded"
                      >
                        Delivered
                      </button>
                    )}

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

};

export default Orders;
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller');
      if (data.success) setOrders(data.orders);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await axios.put('/api/order/update-status', { orderId, status });
      if (data.success) {
        toast.success('Status updated');
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
  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50'>
      <div className='md:p-10 p-4 space-y-6'>
        <h2 className='text-2xl font-semibold text-gray-800'>Orders List</h2>

        {orders.length === 0 ? (
          <p className="text-gray-600 text-center mt-8">No orders found.</p>
        ) : (
          paginatedOrders.map((order, orderIndex) => (
            <div
              key={orderIndex}
              className='bg-white shadow-sm rounded-xl p-6 border border-gray-200 space-y-4'
            >
              <div className='grid md:grid-cols-4 gap-6'>
                {/* Items */}
                <div className='col-span-2 space-y-3'>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className='flex gap-4 items-center'>
                      <img
                        src={item.product?.image || assets.box_icon}
                        alt={item.product?.name}
                        className='w-14 h-14 object-cover rounded-md border'
                      />
                      <div>
                        <p className='font-medium text-gray-800'>{item.product?.name}</p>
                        <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className='text-sm text-gray-700 space-y-1'>
                  <p className='font-medium text-gray-900'>{order.address?.firstName} {order.address?.lastName}</p>
                  <p>{order.address?.street}, {order.address?.city}</p>
                  <p>{order.address?.state}, {order.address?.zipcode}</p>
                  <p>{order.address?.country}</p>
                  <p>{order.address?.phone}</p>
                </div>

                {/* Summary + Status */}
                <div className='space-y-2 text-sm text-gray-700'>
                  <p className='text-lg font-semibold text-gray-800'>{currency}{order.amount}</p>
                  <p><strong>Method:</strong> {order.paymentType}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>
                    <strong>Payment:</strong>{' '}
                    <span className={`inline-block px-2 py-1 rounded text-white text-xs font-medium ${order.isPaid ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </p>
                  <p>
                    <strong>Delivery Status:</strong>{' '}
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      className='ml-2 border px-2 py-1 rounded text-sm'
                    >
                      <option value='Pending'>Pending</option>
                      <option value='Dispatched'>Dispatched</option>
                      <option value='Delivered'>Delivered</option>
                    </select>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && orders.length > 0 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

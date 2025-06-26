import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SellerCreateCoupon = () => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [minCartAmount, setMinCartAmount] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You must be logged in to create a coupon');
      return;
    }

    const data = {
      code,
      discountValue: Number(discount),
      discountType,
      minCartAmount: Number(minCartAmount),
      expiry: expiry ? new Date(expiry) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // fallback to 7 days from now
    };

    try {
      await axios.post('http://localhost:4000/api/coupon/create', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success('Coupon Created Successfully');

      // Reset form
      setCode('');
      setDiscount('');
      setDiscountType('percentage');
      setMinCartAmount('');
      setExpiry('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create coupon';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10 pb-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-md rounded-md p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Create New Coupon</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm text-gray-700">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. SAVE10"
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm text-gray-700">Discount Value</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. 10"
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm text-gray-700">Discount Type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-sm text-gray-700">Min Cart Amount</label>
            <input
              type="number"
              value={minCartAmount}
              onChange={(e) => setMinCartAmount(e.target.value)}
              placeholder="e.g. 500"
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 font-medium text-sm text-gray-700">Expiry Date</label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-xs text-gray-500 mt-1">
              Leave empty to auto-expire in 7 days.
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded hover:bg-primary-dark transition-colors font-semibold"
        >
          Create Coupon
        </button>
      </form>
    </div>
  );
};

export default SellerCreateCoupon;

import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FaPercent, FaRupeeSign } from "react-icons/fa";

const CouponList = () => {
  const { axios } = useAppContext();
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editCoupon, setEditCoupon] = useState(null);

  const fetchCoupons = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/coupon/list?page=${currentPage}&limit=5`);
      if (res.data.success) {
        setCoupons(res.data.coupons);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      } else {
        toast.error("Failed to fetch coupons");
      }
    } catch (error) {
      toast.error("Error loading coupons");
    } finally {
      setLoading(false);
    }
  };

  const confirmAndDelete = async () => {
    try {
      const res = await axios.delete(`/api/coupon/delete/${confirmDeleteId}`);
      if (res.data.success) {
        toast.success("Coupon deleted");
        fetchCoupons(page);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const submitEdit = async () => {
    try {
      const res = await axios.put(`/api/coupon/update/${editCoupon._id}`, editCoupon);
      if (res.data.success) {
        toast.success("Coupon updated");
        setEditCoupon(null);
        fetchCoupons(page);
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Update error");
    }
  };

  useEffect(() => {
    fetchCoupons(page);
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Available Coupons</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading coupons...</div>
      ) : coupons.length === 0 ? (
        <div className="text-center text-gray-500">No coupons found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="bg-white p-5 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-primary">{coupon.code}</span>
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  {coupon.discountValue}
                  {coupon.discountType === "percentage" ? <FaPercent /> : <FaRupeeSign />}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p><strong>Min Cart:</strong> ₹{coupon.minCartAmount || 0}</p>
                <p><strong>Expires:</strong> {format(new Date(coupon.expiry), "PPP")}</p>
                <p><strong>Created:</strong> {format(new Date(coupon.createdAt), "PPP")}</p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditCoupon(coupon)}
                  className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDeleteId(coupon._id)}
                  className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 border rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 border rounded ${
                page === i + 1 ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-100 border rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this coupon? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editCoupon && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Edit Coupon</h2>

            <input
              type="text"
              value={editCoupon.code}
              onChange={(e) => setEditCoupon({ ...editCoupon, code: e.target.value })}
              placeholder="Coupon Code"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="number"
              value={editCoupon.discountValue}
              onChange={(e) => setEditCoupon({ ...editCoupon, discountValue: e.target.value })}
              placeholder="Discount Value"
              className="w-full px-3 py-2 border rounded"
            />
            <select
              value={editCoupon.discountType}
              onChange={(e) => setEditCoupon({ ...editCoupon, discountType: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
            <input
              type="number"
              value={editCoupon.minCartAmount}
              onChange={(e) => setEditCoupon({ ...editCoupon, minCartAmount: e.target.value })}
              placeholder="Minimum Cart Amount"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="date"
              value={editCoupon.expiry?.substring(0, 10)}
              onChange={(e) => setEditCoupon({ ...editCoupon, expiry: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditCoupon(null)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponList;

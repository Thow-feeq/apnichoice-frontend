import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

const SalesReport = () => {
  const { axios } = useAppContext();

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    paymentType: "",
    status: ""
  });

  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalSales: 0,
    codSales: 0,
    onlineSales: 0
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/admin/sales-report", {
        params: filters,
        withCredentials: true
      });

      setSummary(res.data.summary);
      setOrders(res.data.orders);

    } catch (err) {
      console.error("Sales report error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (axios) loadReport();
  }, [axios]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Sales Report</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input type="date" onChange={e => setFilters({ ...filters, from: e.target.value })} />
        <input type="date" onChange={e => setFilters({ ...filters, to: e.target.value })} />

        <select onChange={e => setFilters({ ...filters, paymentType: e.target.value })}>
          <option value="">All Payments</option>
          <option value="COD">COD</option>
          <option value="ONLINE">Online</option>
        </select>

        <select onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="Delivered">Delivered</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
        </select>

        <button onClick={loadReport} className="px-4 bg-black text-white rounded">
          Apply
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Summary title="Total Orders" value={summary.totalOrders} />
        <Summary title="Total Sales" value={`₹${summary.totalSales}`} />
        <Summary title="COD Sales" value={`₹${summary.codSales}`} />
        <Summary title="Online Sales" value={`₹${summary.onlineSales}`} />
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b">
              <th className="p-3">Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Payment Status</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="5">No records</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o._id}>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>{o.paymentType}</td>
                  <td>{o.paymentStatus}</td>
                  <td>{o.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Summary = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-lg font-bold">{value}</h2>
  </div>
);

export default SalesReport;

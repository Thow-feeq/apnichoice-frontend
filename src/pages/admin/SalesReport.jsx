import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
      console.error("Sales report error:", err);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    if (axios) loadReport();
  }, [axios]);

  const avgOrderValue =
    summary.totalOrders > 0
      ? Math.round(summary.totalSales / summary.totalOrders)
      : 0;

  /* EXPORT EXCEL */

  const exportExcel = () => {

    if (!orders.length) {
      alert("No data to export");
      return;
    }

    const data = orders.map(order => ({
      "Order ID": order._id,
      "Date": new Date(order.createdAt).toLocaleDateString(),
      "Amount": order.totalAmount,
      "Payment Type": order.paymentType,
      "Payment Status": order.paymentStatus,
      "Order Status": order.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    });

    saveAs(blob, "sales_report.xlsx");

  };

  return (

    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-2xl font-bold text-gray-800">
          Sales Dashboard
        </h1>

        <button
          onClick={exportExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>

      </div>

      {/* FILTERS */}

      <div className="bg-white p-5 rounded-lg shadow mb-8 flex flex-wrap gap-6 items-end">

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">
            From Date
          </label>
          <input
            type="date"
            className="border px-3 py-2 rounded"
            onChange={e => setFilters({ ...filters, from: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">
            To Date
          </label>
          <input
            type="date"
            className="border px-3 py-2 rounded"
            onChange={e => setFilters({ ...filters, to: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">
            Payment Type
          </label>
          <select
            className="border px-3 py-2 rounded"
            onChange={e => setFilters({ ...filters, paymentType: e.target.value })}
          >
            <option value="">All Payments</option>
            <option value="COD">COD</option>
            <option value="ONLINE">Online</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">
            Order Status
          </label>
          <select
            className="border px-3 py-2 rounded"
            onChange={e => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Delivered">Delivered</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <button
          onClick={loadReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded h-[40px]"
        >
          Apply
        </button>

      </div>

      {/* KPI CARDS */}

      <div className="grid md:grid-cols-5 gap-6 mb-10">

        <Card title="Total Orders" value={summary.totalOrders} />
        <Card title="Total Revenue" value={`₹${summary.totalSales}`} />
        <Card title="COD Revenue" value={`₹${summary.codSales}`} />
        <Card title="Online Revenue" value={`₹${summary.onlineSales}`} />
        <Card title="Avg Order Value" value={`₹${avgOrderValue}`} />

      </div>

      {/* ORDERS TABLE */}

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <div className="p-5 border-b font-semibold text-gray-700">
          Orders
        </div>

        <table className="w-full text-sm table-auto">

          <thead className="bg-gray-100 text-gray-600">

            <tr className="text-left">

              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Payment</th>
              <th className="px-4 py-3 text-center">Payment Status</th>
              <th className="px-4 py-3 text-center">Status</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No sales found
                </td>
              </tr>
            ) : (
              orders.map(order => (

                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="px-4 py-3 text-blue-600 font-medium">
                    {order._id.slice(-8)}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-right font-semibold">
                    ₹{order.totalAmount}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {order.paymentType}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={order.paymentStatus} />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <OrderBadge status={order.status} />
                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

const Card = ({ title, value }) => (

  <div className="bg-white p-6 rounded-lg shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold mt-1">{value}</h2>
  </div>

);

const StatusBadge = ({ status }) => {

  const color =
    status === "Paid"
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-600";

  return (
    <span className={`px-2 py-1 rounded text-xs ${color}`}>
      {status}
    </span>
  );

};

const OrderBadge = ({ status }) => {

  const colors = {
    Delivered: "bg-green-100 text-green-600",
    Processing: "bg-blue-100 text-blue-600",
    Pending: "bg-yellow-100 text-yellow-600"
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[status]}`}>
      {status}
    </span>
  );

};

export default SalesReport;
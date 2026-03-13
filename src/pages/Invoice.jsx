import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Invoice = () => {

  const { id } = useParams();
  const { axios, currency } = useAppContext();
  const [order, setOrder] = useState(null);

  useEffect(() => {

    const fetchOrder = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get("/api/order/user", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const found = res.data.orders.find(o => o._id === id);

        setOrder(found);

      } catch (err) {
        console.error(err);
      }

    };

    fetchOrder();

  }, [id, axios]);

  if (!order) return <p className="p-20 text-center">Loading invoice...</p>;

  /* ---------- CALCULATIONS ---------- */

  const subtotal = order.items.reduce((sum, item) => {
    const price = item.product?.offerPrice || 0;
    return sum + price * item.quantity;
  }, 0);

  const taxAmount = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + taxAmount;

  return (

    <div id="invoice-section" className="max-w-5xl mx-auto bg-white p-10 mt-10 shadow">

      {/* HEADER */}

      <div className="flex justify-between items-start mb-8">

        <div>
          <img
            src="/logo.png"
            alt="logo"
            className="h-20 mb-3"
          />
          <h1 className="text-xl font-bold">JD Premium</h1>
          <p>Online Store</p>
        </div>

        <div className="text-sm text-right">

          <p><b>Invoice Number:</b> INV-{order._id.slice(-5)}</p>
          <p><b>Order Number:</b> {order._id}</p>
          <p><b>Order Date:</b> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><b>Place Of Supply:</b> Tamil Nadu (33)</p>

        </div>

      </div>

      <hr className="mb-8" />

      {/* ADDRESS SECTION */}

      <div className="grid grid-cols-3 gap-8 mb-8 text-sm">

        <div>
          <h3 className="font-bold mb-2">BILLED FROM</h3>
          <p>JD Premium</p>
          <p>Chennai</p>
          <p>Tamil Nadu</p>
          <p>Phone: +91XXXXXXXXXX</p>
          <p>GSTIN: XXXXXXX</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">BILLED TO</h3>
          <p>{order.address?.name}</p>
          <p>{order.address?.street}</p>
          <p>{order.address?.city}</p>
          <p>{order.address?.state}</p>
          <p>Phone: {order.address?.phone}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">SHIPPED TO</h3>
          <p>{order.address?.name}</p>
          <p>{order.address?.street}</p>
          <p>{order.address?.city}</p>
          <p>{order.address?.state}</p>
          <p>Phone: {order.address?.phone}</p>
        </div>

      </div>

      {/* PRODUCT TABLE */}

      <table className="w-full border text-sm">

        <thead className="bg-gray-100">

          <tr>

            <th className="border p-2 text-left">Product</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Tax</th>
            <th className="border p-2">Total</th>

          </tr>

        </thead>

        <tbody>

          {order.items.map((item, i) => {

            const product = item.product;
            const price = product?.offerPrice || 0;
            const qty = item.quantity;
            const total = price * qty;

            return (

              <tr key={i}>

                <td className="border p-3">
                  {product?.name}
                </td>

                <td className="border text-center">
                  {currency}{price}
                </td>

                <td className="border text-center">
                  {qty}
                </td>

                <td className="border text-center">
                  5%
                </td>

                <td className="border text-center">
                  {currency}{total}
                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

      {/* TOTAL */}

      <div className="flex justify-end mt-6">

        <div className="text-right text-sm">

          <p>Subtotal: {currency}{subtotal}</p>

          <p>Tax: {currency}{taxAmount}</p>

          <h2 className="text-xl font-bold">
            Total: {currency}{grandTotal}
          </h2>

        </div>

      </div>

      {/* FOOTER */}

      <div className="mt-8 text-sm">

        <p><b>Total (In Words):</b> Rupees only</p>

        <p className="mt-3">
          Whether tax is payable under reverse charge - No
        </p>

      </div>

      {/* PRINT BUTTON */}

      <div className="text-center mt-10">

        <button
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Print Invoice
        </button>

      </div>

    </div>

  );

};

export default Invoice;
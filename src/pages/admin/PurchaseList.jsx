import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

const PurchaseList = () => {

  const { axios } = useAppContext();

  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");

  const loadPurchases = async () => {

    try {

      const res = await axios.get("/api/purchase");

      setPurchases(res.data.purchases || []);

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const deletePurchase = async (id) => {

    if (!window.confirm("Delete this purchase?")) return;

    try {

      await axios.delete(`/api/purchase/${id}`);

      loadPurchases();

    } catch (error) {
      console.log(error);
    }

  };

  const filtered = purchases.filter((p) =>
    p.invoiceNo?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold">
          Purchase List
        </h1>

        <input
          type="text"
          placeholder="Search invoice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2"
        />

      </div>

      {/* TABLE */}

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">

            <tr>

              <th className="px-4 py-3 text-left">Invoice</th>
              <th className="px-4 py-3 text-left">Supplier</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-center">Items</th>
              <th className="px-4 py-3 text-right">Total Cost</th>
              <th className="px-4 py-3 text-center">Action</th>

            </tr>

          </thead>

          <tbody>

            {filtered.length === 0 ? (

              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No purchase records found
                </td>
              </tr>

            ) : (

              filtered.map((p) => {

                const totalCost = p.items?.reduce(
                  (sum, i) => sum + i.quantity * i.costPrice,
                  0
                );

                return (

                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-4 py-3 font-medium">
                      {p.invoiceNo}
                    </td>

                    <td className="px-4 py-3">
                      {p.supplierId?.name || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(p.purchaseDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {p.items?.length}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold">
                      ₹{totalCost}
                    </td>

                    <td className="px-4 py-3 text-center">

                      <button
                        onClick={() => deletePurchase(p._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

      {/* FOOTER */}

      <div className="mt-4 text-sm text-gray-500">
        Total Purchases: {purchases.length}
      </div>

    </div>

  );

};

export default PurchaseList;
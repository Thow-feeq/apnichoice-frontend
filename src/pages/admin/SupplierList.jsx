import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

const SupplierList = () => {

  const { axios } = useAppContext();

  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  const loadSuppliers = async () => {

    try {

      const res = await axios.get("/api/supplier");

      setSuppliers(res.data.suppliers || []);

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const deleteSupplier = async (id) => {

    if (!window.confirm("Delete this supplier?")) return;

    try {

      await axios.delete(`/api/supplier/${id}`);

      loadSuppliers();

    } catch (error) {
      console.log(error);
    }

  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold">
          Supplier List
        </h1>

        <input
          type="text"
          placeholder="Search supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2"
        />

      </div>

      {/* Card */}

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">

            <tr>

              <th className="px-4 py-3 text-left">Supplier Name</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredSuppliers.length === 0 ? (

              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No suppliers found
                </td>
              </tr>

            ) : (

              filteredSuppliers.map((s) => (

                <tr key={s._id} className="border-t hover:bg-gray-50">

                  <td className="px-4 py-3 font-medium">
                    {s.name}
                  </td>

                  <td className="px-4 py-3">
                    {s.companyName || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {s.phone || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {s.email || "-"}
                  </td>

                  <td className="px-4 py-3 text-center">

                    <button
                      onClick={() => deleteSupplier(s._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="mt-4 text-sm text-gray-500">
        Total Suppliers: {suppliers.length}
      </div>

    </div>

  );

};

export default SupplierList;
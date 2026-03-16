import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const AddSupplier = () => {

  const { axios } = useAppContext();

  const [supplier, setSupplier] = useState({
    name: "",
    companyName: "",
    phone: "",
    email: "",
    address: ""
  });

  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post("/api/supplier", supplier);

      alert("Supplier Added Successfully");

      setSupplier({
        name: "",
        companyName: "",
        phone: "",
        email: "",
        address: ""
      });

    } catch (error) {
      console.log(error);
      alert("Error adding supplier");
    }

  };

  return (

    <div className="p-6">

      {/* Page Title */}

      <h1 className="text-2xl font-semibold mb-6">
        Add Supplier
      </h1>

      {/* Card */}

      <div className="bg-white shadow rounded-lg p-6 max-w-3xl">

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Supplier Name */}

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Supplier Name
            </label>
            <input
              type="text"
              name="name"
              value={supplier.name}
              onChange={handleChange}
              placeholder="Enter supplier name"
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Company Name */}

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={supplier.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={supplier.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={supplier.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Address */}

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">
              Address
            </label>
            <textarea
              name="address"
              value={supplier.address}
              onChange={handleChange}
              placeholder="Enter supplier address"
              rows="3"
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}

          <div className="md:col-span-2 flex justify-end">

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
            >
              Save Supplier
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

export default AddSupplier;
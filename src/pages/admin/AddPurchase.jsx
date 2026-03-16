import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

const AddPurchase = () => {

  const { axios } = useAppContext();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [purchase, setPurchase] = useState({
    supplierId: "",
    invoiceNo: "",
    purchaseDate: "",
    items: []
  });

  const [item, setItem] = useState({
    productId: "",
    quantity: "",
    costPrice: ""
  });

  /* LOAD SUPPLIERS + PRODUCTS */

  useEffect(() => {

    const loadData = async () => {

      const s = await axios.get("/api/supplier");
      setSuppliers(s.data.suppliers || []);

      const p = await axios.get("/api/product/list");
      setProducts(p.data.products || []);

    };

    loadData();

  }, []);

  /* HANDLE ITEM CHANGE */

  const handleItemChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  /* ADD ITEM TO PURCHASE */

  const addItem = () => {

    if (!item.productId || !item.quantity || !item.costPrice) {
      alert("Fill all product fields");
      return;
    }

    setPurchase({
      ...purchase,
      items: [...purchase.items, item]
    });

    setItem({
      productId: "",
      quantity: "",
      costPrice: ""
    });

  };

  /* SAVE PURCHASE */

  const savePurchase = async () => {

    try {

      await axios.post("/api/purchase", purchase);

      alert("Purchase Saved");

      setPurchase({
        supplierId: "",
        invoiceNo: "",
        purchaseDate: "",
        items: []
      });

    } catch (error) {
      console.log(error);
      alert("Error saving purchase");
    }

  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Add Purchase
      </h1>

      <div className="bg-white shadow rounded-lg p-6">

        {/* PURCHASE HEADER */}

        <div className="grid md:grid-cols-3 gap-6 mb-6">

          <select
            value={purchase.supplierId}
            onChange={(e) =>
              setPurchase({ ...purchase, supplierId: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Invoice No"
            value={purchase.invoiceNo}
            onChange={(e) =>
              setPurchase({ ...purchase, invoiceNo: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={purchase.purchaseDate}
            onChange={(e) =>
              setPurchase({ ...purchase, purchaseDate: e.target.value })
            }
            className="border p-2 rounded"
          />

        </div>

        {/* ADD PRODUCT */}

        <div className="grid md:grid-cols-4 gap-4 mb-4">

          <select
            name="productId"
            value={item.productId}
            onChange={handleItemChange}
            className="border p-2 rounded"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={item.quantity}
            onChange={handleItemChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="costPrice"
            placeholder="Cost Price"
            value={item.costPrice}
            onChange={handleItemChange}
            className="border p-2 rounded"
          />

          <button
            onClick={addItem}
            className="bg-blue-600 text-white rounded px-4"
          >
            Add
          </button>

        </div>

        {/* ITEMS TABLE */}

        <table className="w-full text-sm border mt-4">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Cost</th>
            </tr>

          </thead>

          <tbody>

            {purchase.items.map((i, index) => (

              <tr key={index} className="border-t">

                <td className="p-2">
                  {products.find((p) => p._id === i.productId)?.name || "-"}
                </td>

                <td className="p-2 text-center">
                  {i.quantity}
                </td>

                <td className="p-2 text-center">
                  ₹{i.costPrice}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* SAVE BUTTON */}

        <div className="mt-6">

          <button
            onClick={savePurchase}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Save Purchase
          </button>

        </div>

      </div>

    </div>

  );

};

export default AddPurchase;
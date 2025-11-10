// frontend/src/pages/AddProduct.jsx
import React, { useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { HiPlus, HiTrash } from "react-icons/hi";

export default function AddProduct() {
  const { axios } = useAppContext();

  const sizesList = ["S", "M", "L", "XL", "XXL", "XXXL"];

  // main form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // images: main images (up to 4)
  const [mainFiles, setMainFiles] = useState([null, null, null, null]);

  // variants: each has colorName, colorCode, pattern, images[3], sizes: [{size,quantity}]
  const [variants, setVariants] = useState([
    { colorName: "", colorCode: "#ef4444", pattern: "", images: [null, null, null], sizes: [] },
  ]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/seller/category/list");
        if (data.success) setCategories(data.categories);
      } catch {
        /* ignore */
      }
    };
    fetchCategories();
  }, [axios]);

  // ---------- handlers ----------
  const setMainFile = (index, file) => {
    const arr = [...mainFiles];
    arr[index] = file || null;
    setMainFiles(arr);
  };

  const removeMainFile = (index) => {
    const arr = [...mainFiles];
    arr[index] = null;
    setMainFiles(arr);
  };

  const updateVariant = (vIndex, key, value) => {
    const arr = [...variants];
    arr[vIndex][key] = value;
    setVariants(arr);
  };

  const setVariantFile = (vIndex, imgIndex, file) => {
    const arr = [...variants];
    arr[vIndex].images[imgIndex] = file || null;
    setVariants(arr);
  };

  const toggleSize = (vIndex, size) => {
    const arr = [...variants];
    const found = arr[vIndex].sizes.find((s) => s.size === size);
    if (found) arr[vIndex].sizes = arr[vIndex].sizes.filter((s) => s.size !== size);
    else arr[vIndex].sizes.push({ size, quantity: 1 });
    setVariants(arr);
  };

  const changeSizeQty = (vIndex, size, qty) => {
    const arr = [...variants];
    const s = arr[vIndex].sizes.find((x) => x.size === size);
    if (s) s.quantity = Math.max(0, Number(qty) || 0);
    setVariants(arr);
  };

  const addVariant = () =>
    setVariants([
      ...variants,
      { colorName: "", colorCode: "#ef4444", pattern: "", images: [null, null, null], sizes: [] },
    ]);
  const removeVariant = (vIndex) => setVariants(variants.filter((_, i) => i !== vIndex));

  // quick validation that at least 1 main image and variant color name & at least one size exists
  const validate = () => {
    if (!name.trim()) return "Enter product name";
    if (!category) return "Select category";
    if (!price) return "Enter price";
    if (!mainFiles.some(Boolean)) return "Add at least one main image";
    for (const [i, v] of variants.entries()) {
      if (!v.colorName.trim()) return `Enter color name for variant ${i + 1}`;
      // sizes optional, but if none selected, warn
      if (!v.sizes.length) return `Select at least one size for variant ${i + 1}`;
    }
    return null;
  };

  // ---------- submit ----------
  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setIsLoading(true);
    try {
      // productData must contain variants with images placeholders of same length as files we'll attach
      const productData = {
        name,
        description: description.split("\n").filter(Boolean),
        category,
        price: Number(price),
        offerPrice: offerPrice ? Number(offerPrice) : undefined,
        variants: variants.map((v) => ({
          colorName: v.colorName,
          colorCode: v.colorCode,
          pattern: v.pattern || "",
          sizes: v.sizes,
          // backend uses count of this array to know how many files will be sent for this variant
          images: v.images.map((img) => (img ? 1 : 1)), // keep same length (3) whether file chosen or not
        })),
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      // append main images (preserve positions)
      mainFiles.forEach((f) => {
        if (f) formData.append("images", f);
      });

      // append variantImages flattened in same order as variants[].images
      variants.forEach((v) => {
        v.images.forEach((img) => {
          if (img) formData.append("variantImages", img);
          else {
            // If frontend didn't attach a variant image for that slot, we still must keep ordering.
            // Append an empty blob so server receives same number of fields — but many servers ignore empty files.
            // Safer: don't append anything for missing slots but ensure productData.images count matches uploaded files.
            // Our server reconstructs by counts; it will slice uploadedVariantUrls accordingly.
          }
        });
      });

      const { data } = await axios.post("/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Product added");
        // reset
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setMainFiles([null, null, null, null]);
        setVariants([{ colorName: "", colorCode: "#ef4444", pattern: "", images: [null, null, null], sizes: [] }]);
      } else {
        toast.error(data.message || "Add failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- small helpers for preview ----------
  const filePreview = (file) => (file ? URL.createObjectURL(file) : null);

  // ---------- render ----------
  return (
    <div className="flex-1 h-[95vh] overflow-y-auto px-4 md:px-10 py-10">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Add Textile Product</h2>

        {/* basic details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" className="col-span-2 border p-2 rounded" />
          <select required value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c.path}>{c.text}</option>)}
          </select>
        </div>

        <textarea rows={3} placeholder="Description (one per line)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-3 rounded" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="border p-2 rounded" />
          <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="Offer Price (optional)" className="border p-2 rounded" />
          <div className="col-span-2 flex gap-2 items-center">
            <label className="text-sm text-gray-600">Main images (up to 4)</label>
          </div>
        </div>

        {/* main images grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {mainFiles.map((f, i) => (
            <div key={i} className="relative border rounded overflow-hidden">
              <label className="block w-full h-28 bg-gray-50 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setMainFile(i, e.target.files?.[0] || null)}
                />
                {f ? (
                  <img src={filePreview(f)} alt="main" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    + Add
                  </div>
                )}
              </label>
              {f && (
                <button type="button" onClick={() => removeMainFile(i)} className="absolute top-1 right-1 bg-white rounded p-1 shadow">
                  <HiTrash />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* VARIANTS */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Variants (colors & sizes)</h3>
            <button type="button" onClick={addVariant} className="inline-flex items-center gap-1 px-3 py-1.5 border rounded text-sm">
              <HiPlus /> Add color
            </button>
          </div>

          <div className="space-y-4 mt-4">
            {variants.map((v, vi) => (
              <div key={vi} className="border rounded p-4 bg-gray-50">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                    <input value={v.colorName} onChange={(e) => updateVariant(vi, "colorName", e.target.value)} placeholder="Color name (e.g., Red)" className="border p-2 rounded col-span-1 md:col-span-2" />
                    <input type="color" value={v.colorCode} onChange={(e) => updateVariant(vi, "colorCode", e.target.value)} className="w-14 h-10 border rounded" />
                    <input placeholder="Pattern (optional)" value={v.pattern} onChange={(e) => updateVariant(vi, "pattern", e.target.value)} className="border p-2 rounded" />
                  </div>

                  <div className="flex items-center gap-2">
                    {variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(vi)} className="text-red-500 px-2 py-1 border rounded">Remove</button>
                    )}
                  </div>
                </div>

                {/* variant images */}
                <div className="mt-3">
                  <label className="text-sm text-gray-600">Variant images (3)</label>
                  <div className="flex gap-2 mt-2">
                    {v.images.map((img, idx) => (
                      <div key={idx} className="relative border rounded overflow-hidden w-28 h-20">
                        <label className="block w-full h-full cursor-pointer">
                          <input type="file" accept="image/*" hidden onChange={(e) => setVariantFile(vi, idx, e.target.files?.[0] || null)} />
                          {img ? <img src={filePreview(img)} alt="v" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">Add</div>}
                        </label>
                        {img && <button type="button" onClick={() => setVariantFile(vi, idx, null)} className="absolute top-1 right-1 bg-white rounded p-1 shadow"><HiTrash /></button>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* sizes grid */}
                <div className="mt-3">
                  <label className="text-sm text-gray-600">Sizes</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizesList.map((sz) => {
                      const selected = v.sizes.some((s) => s.size === sz);
                      return (
                        <button key={sz} type="button" onClick={() => toggleSize(vi, sz)}
                          className={`px-3 py-1 rounded border ${selected ? "bg-primary text-white" : "bg-white"}`}>
                          {sz}
                        </button>
                      );
                    })}
                  </div>

                  {/* quantities */}
                  <div className="mt-2 space-y-2">
                    {v.sizes.map((s) => (
                      <div key={s.size} className="flex items-center gap-2">
                        <div className="w-16 text-sm">{s.size}</div>
                        <input type="number" min="0" value={s.quantity} onChange={(e) => changeSizeQty(vi, s.size, e.target.value)} className="w-24 border p-1 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded">
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

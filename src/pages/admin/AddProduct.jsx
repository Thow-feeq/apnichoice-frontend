import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { HiPlus, HiTrash } from "react-icons/hi";

export default function AddProduct() {
  const { axios } = useAppContext();

  const sizesList = ["S", "M", "L", "XL", "XXL", "XXXL"];

  // ✅ BASIC PRODUCT
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  // ✅ CATEGORY STATES (3 LEVEL)
  const [allCategories, setAllCategories] = useState([]);
  const [mainCats, setMainCats] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [childCats, setChildCats] = useState([]);

  const [mainCat, setMainCat] = useState("");
  const [subCat, setSubCat] = useState("");
  const [childCat, setChildCat] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // ✅ MAIN IMAGES
  const [mainFiles, setMainFiles] = useState([null, null, null, null]);

  // ✅ VARIANTS
  const emptyVariant = {
    colorName: "",
    colorCode: "#ef4444",
    pattern: "",
    images: [null, null, null, null],
    sizes: [],
  };

  const [variants, setVariants] = useState([emptyVariant]);

  // ✅ FETCH CATEGORY TREE
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/seller/category/list");
        if (data.success) {
          const cats = data.categories;
          setAllCategories(cats);
          setMainCats(cats.filter((c) => !c.parent));
        }
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, [axios]);

  // ✅ MAIN → SUB
  useEffect(() => {
    if (!mainCat) return;
    const subs = allCategories.filter((c) => c.parent === mainCat);
    setSubCats(subs);
    setSubCat("");
    setChildCats([]);
    setChildCat("");
  }, [mainCat, allCategories]);

  // ✅ SUB → CHILD
  useEffect(() => {
    if (!subCat) return;
    const childs = allCategories.filter((c) => c.parent === subCat);
    setChildCats(childs);
    setChildCat("");
  }, [subCat, allCategories]);

  // ✅ HELPERS
  const filePreview = (file) => (file ? URL.createObjectURL(file) : null);

  const setMainFile = (i, f) => {
    const arr = [...mainFiles];
    arr[i] = f;
    setMainFiles(arr);
  };

  const removeMainFile = (i) => {
    const arr = [...mainFiles];
    arr[i] = null;
    setMainFiles(arr);
  };

  const updateVariant = (i, k, v) => {
    const arr = [...variants];
    arr[i][k] = v;
    setVariants(arr);
  };

  const setVariantFile = (vi, ii, f) => {
    const arr = [...variants];
    arr[vi].images[ii] = f;
    setVariants(arr);
  };

  const toggleSize = (vi, size) => {
    const arr = [...variants];
    const found = arr[vi].sizes.find((s) => s.size === size);
    if (found) {
      arr[vi].sizes = arr[vi].sizes.filter((s) => s.size !== size);
    } else {
      arr[vi].sizes.push({ size, quantity: 1 });
    }
    setVariants(arr);
  };

  const changeSizeQty = (vi, size, qty) => {
    const arr = [...variants];
    const s = arr[vi].sizes.find((x) => x.size === size);
    if (s) s.quantity = Math.max(0, Number(qty) || 0);
    setVariants(arr);
  };

  const addVariant = () => setVariants([...variants, { ...emptyVariant }]);
  const removeVariant = (vi) => setVariants(variants.filter((_, i) => i !== vi));

  // ✅ VALIDATION
  const validate = () => {
    if (!name.trim()) return "Enter product name";
    if (!childCat) return "Select final child category";
    if (!price) return "Enter price";
    if (!mainFiles.some(Boolean)) return "Add at least one main image";

    for (const [i, v] of variants.entries()) {
      if (!v.colorName.trim()) return `Enter color name for variant ${i + 1}`;
      if (!v.sizes.length) return `Select at least one size for variant ${i + 1}`;
    }
    return null;
  };

  // ✅ SUBMIT
  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setIsLoading(true);
    try {
      const productData = {
        name,
        description: description.split("\n").filter(Boolean),
        category: childCat, // ✅ ONLY CHILD CATEGORY
        price: Number(price),
        offerPrice: offerPrice ? Number(offerPrice) : undefined,
        variants: variants.map((v) => ({
          colorName: v.colorName,
          colorCode: v.colorCode,
          pattern: v.pattern || "",
          sizes: v.sizes,
          images: v.images.filter(Boolean).map(() => "img"),
        })),
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      mainFiles.forEach((f) => f && formData.append("images", f));
      variants.forEach((v) =>
        v.images.forEach((img) => img && formData.append("variantImages", img))
      );

      const { data } = await axios.post("/api/product/add", formData);

      if (data.success) {
        toast.success("Product added successfully");
        setName("");
        setDescription("");
        setPrice("");
        setOfferPrice("");
        setMainFiles([null, null, null, null]);
        setVariants([{ ...emptyVariant }]);
        setMainCat("");
        setSubCat("");
        setChildCat("");
      } else {
        toast.error(data.message || "Add failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UI
  return (
    <div className="flex-1 px-6 py-8">
      <form
        onSubmit={onSubmit}
        className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6"
      >
        <h2 className="text-2xl font-semibold">Add Product</h2>

        {/* ✅ BASIC */}
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" className="w-full border p-2 rounded" />

        {/* ✅ CATEGORY 3 LEVEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={mainCat} onChange={(e) => setMainCat(e.target.value)} className="border p-2 rounded" required>
            <option value="">Select Main</option>
            {mainCats.map((c) => (
              <option key={c._id} value={c._id}>{c.name || c.text}</option>
            ))}
          </select>

          <select value={subCat} onChange={(e) => setSubCat(e.target.value)} className="border p-2 rounded" disabled={!subCats.length}>
            <option value="">Select Sub</option>
            {subCats.map((c) => (
              <option key={c._id} value={c._id}>{c.name || c.text}</option>
            ))}
          </select>

          <select value={childCat} onChange={(e) => setChildCat(e.target.value)} className="border p-2 rounded" disabled={!childCats.length} required>
            <option value="">Select Child</option>
            {childCats.map((c) => (
              <option key={c._id} value={c.slug || c.path}>{c.name || c.text}</option>
            ))}
          </select>
        </div>

        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border p-3 rounded" />

        <div className="grid grid-cols-2 gap-4">
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="border p-2 rounded" />
          <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="Offer Price" className="border p-2 rounded" />
        </div>

        {/* ✅ MAIN IMAGES */}
        <div className="grid grid-cols-4 gap-3">
          {mainFiles.map((f, i) => (
            <div key={i} className="border rounded relative">
              <label className="block w-full h-28 cursor-pointer">
                <input hidden type="file" accept="image/*" onChange={(e) => setMainFile(i, e.target.files?.[0])} />
                {f ? <img src={filePreview(f)} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">+ Add</div>}
              </label>
              {f && <button type="button" onClick={() => removeMainFile(i)} className="absolute top-1 right-1 bg-white p-1 rounded"><HiTrash /></button>}
            </div>
          ))}
        </div>

        {/* ✅ VARIANTS */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Variants</h3>
          <button type="button" onClick={addVariant} className="border px-3 py-1 rounded text-sm flex items-center gap-1"><HiPlus /> Add</button>
        </div>

        {variants.map((v, vi) => (
          <div key={vi} className="border p-4 rounded bg-gray-50 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <input value={v.colorName} onChange={(e) => updateVariant(vi, "colorName", e.target.value)} placeholder="Color Name" className="border p-2 rounded" />
              <input type="color" value={v.colorCode} onChange={(e) => updateVariant(vi, "colorCode", e.target.value)} />
              <input value={v.pattern} onChange={(e) => updateVariant(vi, "pattern", e.target.value)} placeholder="Pattern" className="border p-2 rounded" />
            </div>

            <div className="grid grid-cols-6 gap-2">
              {sizesList.map((sz) => {
                const exists = v.sizes.some((s) => s.size === sz);
                const qty = v.sizes.find((s) => s.size === sz)?.quantity || 0;
                return (
                  <div key={sz}>
                    <button type="button" onClick={() => toggleSize(vi, sz)} className={`w-full border rounded ${exists ? "bg-black text-white" : ""}`}>{sz}</button>
                    {exists && <input type="number" value={qty} onChange={(e) => changeSizeQty(vi, sz, e.target.value)} className="w-full border mt-1 text-center" />}
                  </div>
                );
              })}
            </div>

            {variants.length > 1 && <button type="button" onClick={() => removeVariant(vi)} className="text-red-500 text-sm">Remove Variant</button>}
          </div>
        ))}

        <button type="submit" disabled={isLoading} className="bg-black text-white px-6 py-2 rounded">
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { HiPlus, HiTrash } from "react-icons/hi";

export default function EditProduct() {
  const { id } = useParams();
  const { axios, fetchProducts } = useAppContext();
  const navigate = useNavigate();

  const sizesList = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const [loading, setLoading] = useState(true);

  // ---------- FORM STATE ----------
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  // main images
  const [mainFiles, setMainFiles] = useState([null, null, null, null]);
  const [existingMainImages, setExistingMainImages] = useState([]);

  // variants
  const [variants, setVariants] = useState([]);

  // store existing variant images (urls)
  const [existingVariantImages, setExistingVariantImages] = useState([]);

  // ---------- FETCH PRODUCT ----------
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/product/${id}`);
        if (!data.success) return toast.error("Product not found");

        const p = data.product;

        setName(p.name);
        setDescription(p.description.join("\n"));
        setCategory(p.category);
        setPrice(p.price);
        setOfferPrice(p.offerPrice || "");

        // main images
        setExistingMainImages(p.images);

        // variants load
        setVariants(
          p.variants.map((v, index) => ({
            colorName: v.colorName,
            colorCode: v.colorCode,
            pattern: v.pattern,
            sizes: v.sizes,
            images: [null, null, null], // new uploads
          }))
        );

        // variant existing images
        setExistingVariantImages(
          p.variants.map((v) => v.images || [])
        );

      } catch (err) {
        console.log(err);
        toast.error("Failed to load product");
      }
      setLoading(false);
    })();
  }, [id]);

  // ---------- HELPERS ----------
  const filePreview = (file) =>
    file ? URL.createObjectURL(file) : null;

  const updateVariant = (i, key, val) => {
    const arr = [...variants];
    arr[i][key] = val;
    setVariants(arr);
  };

  const setVariantFile = (vIndex, imgIndex, file) => {
    const arr = [...variants];
    arr[vIndex].images[imgIndex] = file;
    setVariants(arr);
  };

  const setMainFile = (index, file) => {
    const arr = [...mainFiles];
    arr[index] = file;
    setMainFiles(arr);
  };

  const toggleSize = (vIndex, size) => {
    const arr = [...variants];
    const found = arr[vIndex].sizes.find((s) => s.size === size);
    if (found)
      arr[vIndex].sizes = arr[vIndex].sizes.filter((s) => s.size !== size);
    else arr[vIndex].sizes.push({ size, quantity: 1 });

    setVariants(arr);
  };

  const changeSizeQty = (vIndex, size, qty) => {
    const arr = [...variants];
    const s = arr[vIndex].sizes.find((x) => x.size === size);
    if (s) s.quantity = Number(qty) || 0;
    setVariants(arr);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        colorName: "",
        colorCode: "#ef4444",
        pattern: "",
        images: [null, null, null],
        sizes: [],
      },
    ]);
    setExistingVariantImages([...existingVariantImages, []]);
  };

  const deleteVariant = (i) => {
    setVariants(variants.filter((_, x) => x !== i));
    setExistingVariantImages(existingVariantImages.filter((_, x) => x !== i));
  };

  // ---------- SUBMIT ----------
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        description: description.split("\n").filter(Boolean),
        category,
        price: Number(price),
        offerPrice: offerPrice ? Number(offerPrice) : undefined,
        variants: variants.map((v) => ({
          colorName: v.colorName,
          colorCode: v.colorCode,
          pattern: v.pattern,
          sizes: v.sizes,
          images: v.images.map(() => 1), // placeholder count
        })),
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      // main images (new uploads)
      mainFiles.forEach((f) => {
        if (f) formData.append("images", f);
      });

      // variant images flatten order
      variants.forEach((v) => {
        v.images.forEach((img) => {
          if (img) formData.append("variantImages", img);
        });
      });

      const { data } = await axios.put(`/api/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Product updated");
        fetchProducts();
        navigate("/admin/product-list");
      } else toast.error(data.message);
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading...</div>
    );

  // ---------- UI ----------
  return (
    <div className="flex-1 h-[95vh] overflow-y-auto px-4 md:px-10 py-10">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Edit Product</h2>

        {/* BASIC INFO */}
        <input
          className="border p-3 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
        />

        <textarea
          rows={3}
          className="border p-3 rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="border p-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />
          <input
            className="border p-3 rounded"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
        </div>

        <input
          type="number"
          className="border p-3 rounded w-full"
          value={offerPrice}
          onChange={(e) => setOfferPrice(e.target.value)}
          placeholder="Offer Price"
        />

        {/* MAIN IMAGES */}
        <h3 className="text-lg font-semibold">Main Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative border rounded overflow-hidden">
              <label className="block w-full h-28 bg-gray-50 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setMainFile(i, e.target.files?.[0])}
                />

                {mainFiles[i] ? (
                  <img
                    src={filePreview(mainFiles[i])}
                    className="w-full h-full object-cover"
                  />
                ) : existingMainImages[i] ? (
                  <img
                    src={existingMainImages[i]}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Add
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>

        {/* VARIANTS */}
        <div className="flex items-center justify-between mt-6">
          <h3 className="text-lg font-semibold">Variants</h3>
          <button type="button" onClick={addVariant} className="px-3 py-1.5 border rounded flex items-center gap-1">
            <HiPlus /> Add Variant
          </button>
        </div>

        <div className="space-y-4 mt-4">
          {variants.map((v, vi) => (
            <div key={vi} className="border rounded p-4 bg-gray-50">
              {/* Color */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  className="border p-2 rounded col-span-2"
                  value={v.colorName}
                  onChange={(e) => updateVariant(vi, "colorName", e.target.value)}
                  placeholder="Color name"
                />
                <input
                  type="color"
                  className="border rounded"
                  value={v.colorCode}
                  onChange={(e) => updateVariant(vi, "colorCode", e.target.value)}
                />
              </div>

              {/* Images */}
              <div className="mt-3">
                <label className="text-sm">Variant Images</label>
                <div className="flex gap-2 mt-2">
                  {[0, 1, 2].map((imgIndex) => (
                    <div key={imgIndex} className="relative border rounded w-28 h-20 overflow-hidden">
                      <label className="block w-full h-full cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            setVariantFile(vi, imgIndex, e.target.files?.[0])
                          }
                        />

                        {v.images[imgIndex] ? (
                          <img
                            src={filePreview(v.images[imgIndex])}
                            className="w-full h-full object-cover"
                          />
                        ) : existingVariantImages[vi]?.[imgIndex] ? (
                          <img
                            src={existingVariantImages[vi][imgIndex]}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Add
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-4">
                <label className="text-sm">Sizes</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizesList.map((sz) => {
                    const selected = v.sizes.some((s) => s.size === sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        className={`px-3 py-1 rounded border ${
                          selected ? "bg-primary text-white" : "bg-white"
                        }`}
                        onClick={() => toggleSize(vi, sz)}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 space-y-2">
                  {v.sizes.map((s) => (
                    <div key={s.size} className="flex items-center gap-2">
                      <div className="w-16">{s.size}</div>
                      <input
                        type="number"
                        className="border p-1 w-24 rounded"
                        value={s.quantity}
                        onChange={(e) =>
                          changeSizeQty(vi, s.size, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {variants.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 mt-4 border px-2 py-1 rounded"
                  onClick={() => deleteVariant(vi)}
                >
                  Remove Variant
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="bg-primary text-white px-6 py-2 rounded mt-6">
          Save Changes
        </button>
      </form>
    </div>
  );
}

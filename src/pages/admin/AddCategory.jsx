import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { HiSearch } from "react-icons/hi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const AddCategory = () => {
  const { axios } = useAppContext();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ FORM STATE
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [bgColor, setBgColor] = useState("#FEE0E0");
  const [imageFile, setImageFile] = useState(null);
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ MULTI LEVEL SELECT STATE
  const [level1, setLevel1] = useState(null);
  const [level2, setLevel2] = useState(null);

  // ✅ FETCH ALL CATEGORIES
  useEffect(() => {
    axios.get("/api/seller/category/list").then((res) => {
      if (res.data.success) setCategories(res.data.categories);
    });
  }, [axios]);

  // ✅ NORMALIZE (text/path + name/slug SAFE)
  const normalized = useMemo(() => {
    return categories.map((c) => ({
      ...c,
      name: c.text || c.name,
      slug: c.path || c.slug,
    }));
  }, [categories]);

  // ✅ MAIN CATEGORIES
  const mainCats = useMemo(
    () => normalized.filter((c) => !c.parent),
    [normalized]
  );

  // ✅ SUB CATEGORIES
  const subCats = useMemo(
    () => normalized.filter((c) => c.parent === level1?._id),
    [normalized, level1]
  );

  // ✅ CHILD CATEGORIES
  const childCats = useMemo(
    () => normalized.filter((c) => c.parent === level2?._id),
    [normalized, level2]
  );

  // ✅ AUTO SLUG
  useEffect(() => {
    setSlug(name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, ""));
  }, [name]);

  // ✅ FINAL PARENT ASSIGN
  useEffect(() => {
    if (level2) setParent(level2._id);
    else if (level1) setParent(level1._id);
    else setParent(null);
  }, [level1, level2]);

  const filterList = (list) =>
    list.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

  const Column = ({ title, data, selected, onClick }) => (
    <div className="w-64 border rounded bg-white shadow h-[360px] overflow-y-auto">
      <div className="px-4 py-2 font-semibold border-b bg-gray-50">{title}</div>
      {data.length === 0 && (
        <div className="p-4 text-gray-400 text-sm">No items</div>
      )}
      {data.map((item) => (
        <div
          key={item._id}
          onClick={() => onClick(item)}
          className={`px-4 py-3 cursor-pointer border-b hover:bg-gray-100 ${
            selected?._id === item._id ? "bg-blue-50 font-semibold" : ""
          }`}
        >
          {item.name}
        </div>
      ))}
    </div>
  );

  // ✅ IMAGE UPLOAD
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return toast.error("Category name required");
    if (!imageFile) return toast.error("Image required");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadRes = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = uploadRes.data.url;

      const payload = {
        name,
        slug,
        bgColor,
        image: imageUrl,
        parent,
      };

      const { data } = await axios.post("/api/seller/category/add", payload);

      if (data.success) {
        toast.success("Category added");
        setName("");
        setSlug("");
        setBgColor("#FEE0E0");
        setImageFile(null);
        setLevel1(null);
        setLevel2(null);
        setParent(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Category add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6">Add Category (Hierarchy)</h2>

      {/* ✅ SEARCH + MULTI COLUMN */}
      <div className="mb-6">
        <div className="relative mb-4 w-80">
          <HiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>

        <div className="flex gap-4">
          <Column
            title="Main"
            data={filterList(mainCats)}
            selected={level1}
            onClick={(cat) => {
              setLevel1(cat);
              setLevel2(null);
            }}
          />

          <Column
            title="Sub"
            data={filterList(subCats)}
            selected={level2}
            onClick={(cat) => setLevel2(cat)}
          />

          <Column title="Child" data={filterList(childCats)} />
        </div>

        {(level1 || level2) && (
          <div className="mt-4 p-3 border rounded bg-green-50 text-sm">
            ✅ Parent Category:
            <b className="ml-2">
              {(level2 || level1)?.name}
            </b>
          </div>
        )}
      </div>

      {/* ✅ ADD CATEGORY FORM */}
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-4 py-2 w-full"
          required
        />

        <input
          type="text"
          placeholder="Slug"
          value={slug}
          readOnly
          className="border rounded px-4 py-2 w-full bg-gray-100"
        />

        <label>
          Background Color
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="block w-full h-10 mt-1"
          />
        </label>

        <label>
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block mt-1"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800 w-full"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;

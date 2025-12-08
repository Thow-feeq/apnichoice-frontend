import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const CategoryList = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ FETCH
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/seller/category/list");
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      const { data } = await axios.delete(`/api/seller/category/${id}`);
      if (data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Delete error");
    }
  };

  // ✅ BUILD TREE
  const categoryTree = useMemo(() => {
    const map = {};
    const roots = [];

    categories.forEach((cat) => {
      map[cat._id] = { ...cat, children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parent) {
        map[cat.parent]?.children.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    return roots;
  }, [categories]);

  // ✅ SEARCH
  const filterTree = (nodes) =>
    nodes
      .filter((n) =>
        (n.text?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (n.path?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      )
      .map((n) => ({
        ...n,
        children: n.children ? filterTree(n.children) : [],
      }));

  const filteredTree = filterTree(categoryTree);

  // ✅ LEVEL BADGE
  const levelBadge = (level) => {
    if (level === 0) return "bg-green-600";
    if (level === 1) return "bg-blue-600";
    return "bg-purple-600";
  };

  const levelText = (level) => {
    if (level === 0) return "Main";
    if (level === 1) return "Sub";
    return "Child";
  };

  // ✅ ROW RENDER
  const renderRows = (list, level = 0) =>
    list.map((cat) => (
      <React.Fragment key={cat._id}>
        <tr className="hover:bg-gray-50 transition">
          {/* CATEGORY */}
          <td className="px-6 py-4">
            <div
              className="flex items-center gap-3"
              style={{ paddingLeft: level * 22 }}
            >
              <img
                src={`${API_URL}${cat.image}`}
                onError={(e) => (e.target.style.display = "none")}
                className="w-9 h-9 rounded object-cover border"
                alt=""
              />
              <span className="font-semibold text-gray-900">
                {cat.text || cat.name}
              </span>
            </div>
          </td>

          {/* SLUG */}
          <td className="px-6 py-4 font-mono text-sm text-gray-600">
            {cat.path || cat.slug}
          </td>

          {/* COLOR */}
          <td className="px-6 py-4">
            <span
              className="w-6 h-6 inline-block rounded-full border"
              style={{ backgroundColor: cat.bgColor }}
            />
          </td>

          {/* LEVEL */}
          <td className="px-6 py-4">
            <span
              className={`px-3 py-1 text-white text-xs font-semibold rounded ${levelBadge(
                level
              )}`}
            >
              {levelText(level)}
            </span>
          </td>

          {/* ✅ ACTIONS */}
          <td className="px-6 py-4 flex gap-3">
            <button
              onClick={() => navigate(`/admin/edit-category/${cat._id}`)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(cat._id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
            >
              Delete
            </button>
          </td>
        </tr>

        {cat.children?.length > 0 && renderRows(cat.children, level + 1)}
      </React.Fragment>
    ));

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#800000] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      {/* ✅ HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Category Hierarchy
        </h2>

        <div className="relative w-full md:w-80">
          <HiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ✅ TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-left">Color</th>
              <th className="px-6 py-3 text-left">Level</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredTree.length > 0 ? (
              renderRows(filteredTree)
            ) : (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;

import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus, FaFolderOpen } from "react-icons/fa";

const CategoryListCMS = () => {
  const { axios } = useAppContext();

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/seller/category/tree");
        if (res.data.success) {
          setCategories(res.data.categories || []);
        }
      } catch (error) {
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [axios]);

  // Filter categories
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
      return;
    }

    const filterRecursive = (cats) => {
      return cats
        .filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((cat) => ({
          ...cat,
          children: filterRecursive(cat.children || []),
        }))
        .concat(
          cats
            .flatMap((cat) => filterRecursive(cat.children || []))
            .filter((cat) =>
              cat.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    setFilteredCategories(filterRecursive(categories));
  }, [searchTerm, categories]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const res = await axios.delete(`/api/seller/category/delete/${id}`);
      if (res.data.success) {
        toast.success("Category deleted");
        // Reload categories
        const fetchRes = await axios.get("/api/seller/category/tree");
        if (fetchRes.data.success) {
          setCategories(fetchRes.data.categories || []);
        }
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const countProducts = (cat) => {
    // This would require additional data from backend
    return 0;
  };

  const TreeNode = ({ node, depth = 0 }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node._id);
    const isSelected = selectedCategory?._id === node._id;

    return (
      <div>
        <div
          className={`flex items-center justify-between py-3 px-4 rounded-lg mb-1 transition ${isSelected
              ? "bg-blue-50 border-l-4 border-blue-600"
              : "hover:bg-gray-50"
            }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(node._id)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                {isExpanded ? "▼" : "▶"}
              </button>
            )}
            {!hasChildren && <div className="w-4"></div>}

            {node.image && (
              <img
                src={node.image}
                alt={node.name}
                className="w-8 h-8 rounded object-cover"
              />
            )}

            <div
              className="cursor-pointer flex-1"
              onClick={() => setSelectedCategory(node)}
            >
              <p className="font-medium text-gray-900">{node.name}</p>
              {node.slug && (
                <p className="text-xs text-gray-500">{node.slug}</p>
              )}
            </div>

            {hasChildren && (
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {node.children.length} sub
              </span>
            )}
          </div>

          <div className="flex gap-2 ml-2">
            <button
              onClick={() => setSelectedCategory(node)}
              title="Edit"
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={() => handleDelete(node._id)}
              title="Delete"
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => (
              <TreeNode key={child._id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category List */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">Manage your category hierarchy</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Search & Actions */}
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <FaPlus /> New Category
                </button>
              </div>
            </div>

            {/* Category Tree */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading categories...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <FaFolderOpen className="mx-auto text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500">No categories found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCategories.map((cat) => (
                  <TreeNode key={cat._id} node={cat} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected Category Details */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Category Details</h2>
            <p className="text-gray-600 mt-2">Edit or create categories</p>
          </div>

          {selectedCategory ? (
            <CategoryEditor
              category={selectedCategory}
              onClose={() => setSelectedCategory(null)}
              onSaved={() => {
                setSelectedCategory(null);
                // Reload categories
                const reload = async () => {
                  try {
                    const res = await axios.get("/api/seller/category/tree");
                    if (res.data.success) {
                      setCategories(res.data.categories || []);
                    }
                  } catch (error) {
                    console.error("Reload error:", error);
                  }
                };
                reload();
              }}
            />
          ) : (
            <CategoryEditor
              category={null}
              onClose={() => setSelectedCategory(null)}
              onSaved={() => {
                setSelectedCategory(null);
                // Reload categories
                const reload = async () => {
                  try {
                    const res = await axios.get("/api/seller/category/tree");
                    if (res.data.success) {
                      setCategories(res.data.categories || []);
                    }
                  } catch (error) {
                    console.error("Reload error:", error);
                  }
                };
                reload();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryEditor = ({ category, onClose, onSaved }) => {
  const { axios } = useAppContext();

  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [bgColor, setBgColor] = useState(category?.bgColor || "#FEE0E0");
  const [imageFile, setImageFile] = useState(null);
  const [parentCategory, setParentCategory] = useState(category?.parent || "");
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(category?.name || "");
    setSlug(category?.slug || "");
    setBgColor(category?.bgColor || "#FEE0E0");
    setImageFile(null);
    setParentCategory(category?.parent || "");
  }, [category]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/seller/category/tree");
        if (res.data.success) {
          const flat = flattenCategories(res.data.categories || []);
          // Filter out current category
          setAllCategories(
            flat.filter((c) => c._id !== category?._id)
          );
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, [axios, category]);

  const flattenCategories = (cats) => {
    let result = [];
    cats.forEach((cat) => {
      result.push(cat);
      if (cat.children) {
        result = result.concat(flattenCategories(cat.children));
      }
    });
    return result;
  };

  useEffect(() => {
    setSlug(
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
    );
  }, [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("bgColor", bgColor);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (parentCategory) {
        formData.append("parent", parentCategory);
      }

      let res;
      if (category?._id) {
        // Update
        res = await axios.put(
          `/api/seller/category/${category._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Create
        res = await axios.post(
          "/api/seller/category/add",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      if (res.data.success) {
        toast.success(category ? "Category updated" : "Category created");
        onSaved();
      } else {
        toast.error(res.data.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-4">
        {category ? "Edit Category" : "New Category"}
      </h3>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Men's Wear"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug
          </label>
          <input
            type="text"
            value={slug}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        {/* Parent Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent Category
          </label>
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None (Top Level)</option>
            {allCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image
          </label>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {category?.image && (
            <img
              src={category.image}
              alt={category.name}
              className="w-20 h-20 rounded mt-2 object-cover"
            />
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          {loading ? "Saving..." : category ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default CategoryListCMS;

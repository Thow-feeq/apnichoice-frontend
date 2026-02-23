import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const AddCategory = () => {
  const { axios } = useAppContext();

  const [tree, setTree] = useState([]);
  const [selected, setSelected] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [bgColor, setBgColor] = useState("#FEE0E0");
  const [imageFile, setImageFile] = useState(null);

  /* ================= FETCH TREE ================= */
  const fetchTree = async () => {
    const res = await axios.get("/api/seller/category/tree");
    if (res.data.success) setTree(res.data.categories);
  };

  useEffect(() => {
    fetchTree();
  }, []);

  /* ================= AUTO SLUG ================= */
  useEffect(() => {
    setSlug(
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
    );
  }, [name]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete category?")) return;

    try {
      const res = await axios.delete(`/api/seller/category/delete/${id}`);
      if (res.data.success) {
        toast.success("Deleted");
        fetchTree();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  /* ================= TREE NODE ================= */
  const TreeNode = ({ node, depth = 0 }) => {
    const [open, setOpen] = useState(true);

    return (
      <div style={{ marginLeft: depth * 20 }}>
        <div
          className={`flex items-center justify-between py-2 px-3 rounded-lg transition ${
            selected?._id === node._id
              ? "bg-blue-50 border border-blue-200"
              : "hover:bg-gray-100"
          }`}
        >
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelected(node)}
          >
            {node.children?.length > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
                className="text-gray-500"
              >
                {open ? "▼" : "▶"}
              </span>
            )}

            {node.image && (
              <img
                src={`${API_URL}${node.image}`}
                className="w-7 h-7 rounded object-cover"
                alt=""
              />
            )}

            <span className="font-medium">{node.name}</span>
          </div>

          <Trash2
            size={16}
            className="text-gray-400 hover:text-red-600 cursor-pointer"
            onClick={() => handleDelete(node._id)}
          />
        </div>

        {open &&
          node.children?.map((child) => (
            <TreeNode key={child._id} node={child} depth={depth + 1} />
          ))}
      </div>
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return toast.error("Name required");

    let imageUrl = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadRes = await axios.post("/api/upload", formData);
      imageUrl = uploadRes.data.url;
    }

    const payload = {
      name,
      slug,
      bgColor,
      image: imageUrl,
      parent: selected?._id || null,
    };

    const res = await axios.post("/api/seller/category/add", payload);

    if (res.data.success) {
      toast.success("Category added");
      setName("");
      setImageFile(null);
      setSelected(null);
      fetchTree();
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow grid grid-cols-2 gap-8">

      {/* LEFT SIDE */}
      <div className="border rounded-xl p-4 h-[600px] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">Category Hierarchy</h3>

        {tree.map((root) => (
          <TreeNode key={root._id} node={root} />
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Add Category</h2>

        <div className="mb-4 p-3 bg-green-50 border rounded">
         {selected ? selected.path || selected.name : "Root"}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-4 py-2 w-full"
          />

          <input
            type="text"
            value={slug}
            readOnly
            className="border rounded px-4 py-2 w-full bg-gray-100"
          />

          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 rounded"
          />

          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg w-full">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditCategory = () => {
  const { axios } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [slug, setSlug] = useState("");
  const [bgColor, setBgColor] = useState("#800000");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/seller/category/${id}`).then(({ data }) => {
      if (data.success) {
        setText(data.category.text);
        setSlug(data.category.slug);
        setBgColor(data.category.bgColor);
      }
    });
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/seller/category/${id}`, {
        text,
        slug,
        bgColor
      });

      if (data.success) {
        toast.success("Category Updated");
        navigate("/admin/category-list");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>

      <input
        className="border w-full p-2 mb-3"
        placeholder="Category name"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        className="border w-full p-2 mb-3"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <input
        type="color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
      />

      <button
        disabled={loading}
        onClick={handleUpdate}
        className="mt-5 bg-green-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default EditCategory;

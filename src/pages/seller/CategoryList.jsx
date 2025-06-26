import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { HiOutlineSearch } from 'react-icons/hi';

const CategoryList = () => {
  const { axios } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, category: null });
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/seller/category/list');
      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message || 'Failed to load categories');
      }
    } catch (error) {
      toast.error('Error loading category list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [axios]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/seller/category/edit/${editCategory._id}`, editCategory);
      if (data.success) {
        toast.success('Category updated successfully');
        setEditCategory(null);
        fetchCategories();
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Error updating category');
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const { data } = await axios.delete(`/api/seller/category/delete/${deleteConfirm.category._id}`);
      if (data.success) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      toast.error('Error deleting category');
    } finally {
      setDeleting(false);
      setDeleteConfirm({ show: false, category: null });
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-white rounded-lg shadow-lg">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Category List</h2>
        <div className="relative w-full md:w-80">
          <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Path</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Color</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCategories.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">No categories match your search.</td>
              </tr>
            ) : (
              paginatedCategories.map((cat, idx) => (
                <tr key={cat._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-center">
                    <img
                      src={`http://localhost:4000${cat.image}`}
                      alt={cat.text}
                      className="w-16 h-16 object-contain rounded-md mx-auto"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{cat.text}</td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-sm">{cat.path}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: cat.bgColor }}
                        title={cat.bgColor}
                      />
                      <span className="text-sm">{cat.bgColor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditCategory(cat)}
                        className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ show: true, category: cat })}
                        className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editCategory && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4">Edit Category</h3>
            <form onSubmit={handleEditSubmit}>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                name="text"
                value={editCategory.text}
                onChange={handleEditChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <label className="block mb-2 text-sm font-medium">Path</label>
              <input
                type="text"
                name="path"
                value={editCategory.path}
                onChange={handleEditChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <label className="block mb-2 text-sm font-medium">Background Color</label>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="color"
                  name="bgColor"
                  value={editCategory.bgColor}
                  onChange={handleEditChange}
                  className="w-12 h-10 border rounded"
                />
                <input
                  type="text"
                  name="bgColor"
                  value={editCategory.bgColor}
                  onChange={handleEditChange}
                  className="flex-1 p-2 border rounded"
                />
              </div>
              <label className="block mb-2 text-sm font-medium">Image</label>
              <div className="mb-4">
                {editCategory.image && (
                  <img
                    src={`http://localhost:4000${editCategory.image}`}
                    alt="Preview"
                    className="w-24 h-24 object-contain border rounded mb-2"
                  />
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditCategory(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "<strong>{deleteConfirm.category.text}</strong>"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm({ show: false, category: null })}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
              >
                {deleting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;

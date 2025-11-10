import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [path, setPath] = useState('');
  const [bgColor, setBgColor] = useState('#FEE0E0');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { axios } = useAppContext();

  // Auto-generate path slug when categoryName changes
  const generatePath = (name) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setCategoryName(name);
    setPath(generatePath(name));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error('Please upload an image');
      return;
    }

    setIsLoading(true);

    try {
      // Upload image first (adjust URL to your image upload endpoint)
      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadRes = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = uploadRes.data.url; // adjust based on your response

      // Now send category data with imageUrl
      const categoryData = {
        text: categoryName,
        path,
        bgColor,
        image: imageUrl,
      };

      const { data } = await axios.post('/api/seller/category/add', categoryData);
          
      if (data.success) {
        toast.success(data.message);
        setCategoryName('');
        setPath('');
        setBgColor('#FEE0E0');
        setImageFile(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || 'Error adding category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-md shadow-md">
      <h2 className="text-2xl mb-4">Add Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={handleNameChange}
          className="border border-gray-300 rounded px-4 py-2 w-full"
          required
        />

        <input
          type="text"
          placeholder="Path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full"
          required
        />

        <label className="block">
          Background Color
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 mt-1"
          />
        </label>

        <label className="block">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1"
            required
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark w-full"
        >
          {isLoading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;

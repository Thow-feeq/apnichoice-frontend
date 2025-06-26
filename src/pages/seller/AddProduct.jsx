import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets'; // Assume assets are already imported
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);  // State to hold categories
  const { axios } = useAppContext();

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/seller/category/list');
        if (data.success) {
          setCategories(data.categories); // Update categories state
        } else {
          toast.error(data.message || 'Failed to fetch categories');
        }
      } catch (error) {
        toast.error('Error loading categories');
      }
    };

    fetchCategories();
  }, [axios]);

  const handleImageChange = (index, file) => {
    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        name,
        description: description.split('\n'),
        category,
        price,
        offerPrice,
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(productData));
      files.forEach((file) => formData.append('images', file));

      const { data } = await axios.post('/api/product/add', formData);

      if (data.success) {
        toast.success(data.message);
        setName('');
        setDescription('');
        setCategory('');
        setPrice('');
        setOfferPrice('');
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 h-[95vh] overflow-y-auto px-4 md:px-10 py-10">
      <form
        onSubmit={onSubmitHandler}
        className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Add New Product</h2>

        {/* Image Uploads */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array(4)
              .fill('')
              .map((_, index) => (
                <div key={index} className="relative border border-gray-300 rounded-md overflow-hidden">
                  <input
                    type="file"
                    id={`image-${index}`}
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                  />
                  <label htmlFor={`image-${index}`} className="block w-full h-24 cursor-pointer">
                    <img
                      src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                      alt={`Image ${index}`}
                      className="object-cover w-full h-full"
                    />
                  </label>
                </div>
              ))}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-primary"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm resize-none focus:outline-primary"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-primary"
            required
          >
            <option value="">Select a category</option>
            {categories.length > 0 ? (
              categories.map((item) => (
                <option key={item._id} value={item.path}>
                  {item.text}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No categories available
              </option>
            )}
          </select>
        </div>

        {/* Price Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="offer-price" className="block text-sm font-medium text-gray-700 mb-1">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-primary"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition font-medium"
        >
          {isLoading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

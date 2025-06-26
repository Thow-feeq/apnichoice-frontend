import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { id } = useParams();
  const { axios, fetchProducts } = useAppContext();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    category: '',
    offerPrice: '',
    image: '',
    inStock: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/${id}`);
        if (data.success) {
          setProduct(data.product);
        } else {
          toast.error('Product not found');
          navigate('/seller/product-list');
        }
      } catch (err) {
        setError(err.message || 'Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, axios, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        ...product,
        offerPrice: Number(product.offerPrice),
      };

      const { data } = await axios.put(`/api/product/${id}`, updatedProduct);

      if (data.success) {
        toast.success('Product updated successfully');
        fetchProducts();
        navigate('/seller/product-list');
      } else {
        toast.error(data.message || 'Failed to update product');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading product...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6 md:px-0">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { label: 'Product Name', name: 'name', type: 'text' },
            { label: 'Category', name: 'category', type: 'text' },
            { label: 'Offer Price', name: 'offerPrice', type: 'number' },
            { label: 'Image URL', name: 'image', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={product[name]}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                required={name !== 'image'}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={product.inStock}
            onChange={handleChange}
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
            In Stock
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

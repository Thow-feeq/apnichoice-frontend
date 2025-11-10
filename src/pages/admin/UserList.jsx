import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserCircle, FaEnvelope, FaShoppingCart } from "react-icons/fa";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/user/userList", {
          withCredentials: true,
        });
        setUsers(data.users || []);
      } catch (err) {
        console.error("Fetch users error:", err.message);
        setError("Unable to load users. Please try again.");
        toast.error("Error loading users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="flex space-x-4 bg-gray-100 rounded p-4">
          <div className="h-5 w-1/4 bg-gray-300 rounded" />
          <div className="h-5 w-1/3 bg-gray-300 rounded" />
          <div className="h-5 w-1/6 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center text-gray-500 py-12">
      <p className="text-lg font-semibold">No users found</p>
      <p className="text-sm mt-2">Try refreshing or check back later.</p>
    </div>
  );

  return (
    <section className="p-6 max-w-6xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">👥 User List</h1>
        <p className="text-sm text-gray-500 mt-1">
          View all registered users and their cart activity.
        </p>
      </header>

      {loading ? (
        renderSkeleton()
      ) : error ? (
        <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-md">
          {error}
        </div>
      ) : users.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <FaUserCircle className="inline mr-2" />
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <FaShoppingCart className="inline mr-2" />
                  Cart Items
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4">{user.name || "N/A"}</td>
                  <td className="px-6 py-4">{user.email || "N/A"}</td>
                  <td className="px-6 py-4">
                    {Object.keys(user.cartItems || {}).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UserList;

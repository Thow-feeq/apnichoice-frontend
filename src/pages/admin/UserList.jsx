import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await axios.get("/api/user/userList", {
      withCredentials: true,
    });
    setUsers(data.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ STATUS TOGGLE
  const toggleStatus = async (id) => {
    try {
      const { data } = await axios.patch(
        `/api/user/toggle-status/${id}`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(`User ${data.status}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👥 User Management</h1>

      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>

              <td className="p-3 text-center">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    user.status === "active"
                      ? "bg-green-600 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              <td className="p-3 text-center">
                <button
                  onClick={() => toggleStatus(user._id)}
                  className={`px-4 py-1 text-xs text-white rounded ${
                    user.status === "active"
                      ? "bg-red-600"
                      : "bg-green-600"
                  }`}
                >
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default UserList;

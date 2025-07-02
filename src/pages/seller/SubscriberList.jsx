import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FaEnvelope } from 'react-icons/fa';

const SubscriberList = () => {
  const { axios } = useAppContext();
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const { data } = await axios.get('/api/newsletter');
        if (data.success) {
          setSubscribers(data.subscribers);
        }
      } catch (error) {
        console.error('Failed to fetch subscribers:', error.message);
      }
    };

    fetchSubscribers();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaEnvelope className="text-primary" /> Newsletter Subscribers
      </h2>
      {subscribers.length === 0 ? (
        <p className="text-gray-600">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Subscribed On</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, index) => (
                <tr key={sub._id} className="border-t text-sm">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{sub.email}</td>
                  <td className="px-4 py-2">{new Date(sub.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubscriberList;

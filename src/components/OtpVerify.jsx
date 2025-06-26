import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const OtpVerify = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, axios, navigate } = useAppContext();

  const handleOtpSubmit = async () => {
    if (!otp.trim()) return toast.error('Please enter the OTP');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/user/verify-otp', { email, otp });

      if (data.success) {
        // ✅ Set user globally
        setUser(data.user);

        // ✅ Optional: store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(data.user));

        toast.success(data.message || 'Logged in successfully');

        // ✅ Optional callback (e.g., close modal)
        onSuccess?.();

        // ✅ Redirect to homepage
        navigate('/');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container p-4 max-w-sm mx-auto bg-white shadow-md rounded">
      <h2 className="text-lg font-semibold mb-2 text-center">Enter OTP</h2>
      <p className="text-sm text-gray-600 mb-3 text-center">
        OTP sent to <strong>{email}</strong>
      </p>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full border border-gray-300 rounded px-4 py-2 mb-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        onClick={handleOtpSubmit}
        disabled={loading}
        className={`w-full rounded px-4 py-2 text-sm text-white ${
          loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dull'
        }`}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );
};

export default OtpVerify;

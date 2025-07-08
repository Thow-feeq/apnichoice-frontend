import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets, footerLinks } from "../assets/assets";
import toast from 'react-hot-toast';

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();
  const [state, setState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        // ✅ Save token & set Axios header
        localStorage.setItem('token', data.token);
        localStorage.setItem('sellerId', data.user._id);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        setUser(data.user);
        setShowUserLogin(false);
        navigate('/');
        toast.success(`${state === 'login' ? 'Logged in' : 'Registered'} successfully!`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 mt-20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[95vh] overflow-y-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col md:flex-row transition-all"
      >
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-tr from-indigo-600 to-purple-600 p-8 text-white w-1/2">
          <h2 className="text-3xl font-bold mb-4">Welcome</h2>
          <p className="text-center text-sm mb-6 px-4">
            {state === 'login'
              ? 'Sign in to continue exploring great deals.'
              : 'Join now to unlock a personalized experience!'}
          </p>
          <img
            src="http://localhost:5173/src/assets/bright-vision.png"
            alt="illustration"
            className="w-60 h-36 opacity-90"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-6 sm:p-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {state === 'login' ? 'Sign In' : 'Register'}
          </h3>
          <form onSubmit={onSubmitHandler} className="space-y-5">
            {state === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
            >
              {state === 'login' ? 'Sign In' : 'Register'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-gray-500">
            {state === 'login' ? 'Don’t have an account?' : 'Already have an account?'}{' '}
            <button
              onClick={() => setState(state === 'login' ? 'register' : 'login')}
              className="text-indigo-600 hover:underline font-medium"
            >
              {state === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

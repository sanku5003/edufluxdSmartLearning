import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send credentials to a backend for verification.
    // For this simulation, any input is a "successful" login.
    console.log('Attempting login with:', { username, password });
    setLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-xl shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-gray-100 mb-6 text-center">Login to EduFlux</h2>
      <p className="text-lg text-gray-300 mb-8 text-center">Access your personalized EduFlux features.</p>

      <form onSubmit={handleLogin} className="space-y-7">
        <div>
          <label htmlFor="username" className="block text-lg font-medium text-gray-200 mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-lg font-medium text-gray-200 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          Login
        </button>
      </form>
    </div>
  );
};
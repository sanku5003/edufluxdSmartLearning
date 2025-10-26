import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignupProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

export const Signup: React.FC<SignupProps> = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send registration data to a backend.
    // For this simulation, any input is a "successful" signup.
    console.log('Attempting signup with:', { username, email, password });
    setLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-xl shadow-xl border border-gray-700 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-gray-100 mb-6 text-center">Sign Up for EduFlux</h2>
      <p className="text-lg text-gray-300 mb-8 text-center">Create your EduFlux account to get started.</p>

      <form onSubmit={handleSignup} className="space-y-7">
        <div>
          <label htmlFor="signup-username" className="block text-lg font-medium text-gray-200 mb-2">
            Username
          </label>
          <input
            id="signup-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-lg font-medium text-gray-200 mb-2">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-lg font-medium text-gray-200 mb-2">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg transition-colors duration-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
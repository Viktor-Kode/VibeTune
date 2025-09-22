// Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, signWithGoogle } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-sky-400 mb-6 text-center">Login to VibeTune</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600"
              required
            />
          </div>

          <div className="relative">
  <input
    type={showPassword ? 'text' : 'password'}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600"
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-3 text-sm text-sky-400 hover:text-sky-300"
  >
    {showPassword ? 'Hide' : 'Show'}
  </button>
</div>

          <button type="submit" className="w-full bg-sky-400 py-3 rounded-xl hover:bg-sky-500 transition">
            Login
          </button>
        </form>

        <button onClick={signWithGoogle} className="mt-4 w-full border border-sky-400 py-3 rounded-xl hover:bg-sky-400 hover:text-black transition">
          Sign in with Google
        </button>

        <p className="text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signUp" className="text-sky-400 hover:underline">Register</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;

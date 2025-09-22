// Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, registerWithEmail, signWithGoogle } from '../firebase';
import { updateProfile } from 'firebase/auth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await registerWithEmail(email, password);
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      setShowError('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setShowError('Registration failed: ' + err.message);
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-sky-400 mb-6 text-center">Register for VibeTune</h2>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jone122"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600"
              required
            />
          </div>
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
<div><p>{showError}</p></div>

          <button type="submit" className="w-full bg-sky-400 py-3 rounded-xl hover:bg-sky-500 transition">
            Register
          </button>
        </form>

        <button onClick={signWithGoogle} className="mt-4 w-full border border-sky-400 py-3 rounded-xl hover:bg-sky-400 hover:text-black transition">
          Sign up with Google
        </button>

        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-400 hover:underline">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
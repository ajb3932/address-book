import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await api.post('/auth/login', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4">
      <div className="bg-[var(--container-bg)] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-[var(--text-color)] text-2xl font-bold mb-6 text-center">
          Family Address Book Login
        </h1>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="username" 
              className="block text-[var(--text-color)] mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-[var(--text-color)] mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--button-bg)] text-[var(--text-color)] p-2 rounded hover:bg-[var(--button-hover-bg)] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
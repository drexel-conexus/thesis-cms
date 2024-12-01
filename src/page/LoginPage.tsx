import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constant/data';
import axios from 'axios'
import { User } from '../constant/type';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
        const response = await axios.post<User>(`${API_BASE_URL}/users/login`, {
          email,
          password,
        }) as unknown as { data: { token: string } };
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');

    } catch (error) {
        if (axios.isAxiosError(error)) {
          setError('Login failed. Please try again.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error(error)
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-green-700">Login to your account</h3>
        {error && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-green-700" htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-green-700">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-200">Login</button>
              <a href="#" className="text-sm text-green-600 hover:underline">Forgot password?</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
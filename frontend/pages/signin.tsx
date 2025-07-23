import React, { useState, FormEvent } from 'react';

type UserRole = 'elder' | 'caregiver';

const SignIn: React.FC = () => {
  const [role, setRole] = useState<UserRole>('elder');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleChange = (selectedRole: UserRole) => setRole(selectedRole);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Implement authentication logic here
    alert(`Role: ${role}\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-800 text-center">
        Welcome to Eldermate
      </h1>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md px-8 py-10 flex flex-col items-center">
        <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-5">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21C12 21 4 13.613 4 8.75A4.75 4.75 0 0112 4a4.75 4.75 0 018 4.75C20 13.613 12 21 12 21z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-0.5">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-6">Health and emotional support platform</p>
        </div>

        {/* Role Selection */}
        <div className="mb-5 w-full flex justify-center space-x-3">
          <button
            type="button"
            className={`flex-1 py-2 px-3 rounded-lg border transition
              flex flex-col items-center
              ${
                role === 'elder'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow'
                  : 'bg-white border-gray-300 text-gray-600'
              }
              focus:outline-none`}
            onClick={() => handleRoleChange('elder')}
            aria-pressed={role === 'elder'}
          >
            <span className="flex items-center mb-1">
              <svg className="w-5 h-5 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-3.866 0-7-3.134-7-7 0-3.866 3.134-7 7-7s7 3.134 7 7c0 3.866-3.134 7-7 7z" />
              </svg>
              <span>Elder User</span>
            </span>
            <span className="text-xs text-gray-400">Looking for support</span>
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-3 rounded-lg border transition
              flex flex-col items-center
              ${
                role === 'caregiver'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow'
                  : 'bg-white border-gray-300 text-gray-600'
              }
              focus:outline-none`}
            onClick={() => handleRoleChange('caregiver')}
            aria-pressed={role === 'caregiver'}
          >
            <span className="flex items-center mb-1">
              <svg className="w-5 h-5 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7H7v6h6V7z M17 17v-2a4 4 0 00-4-4H5v6h6a4 4 0 004-4z" />
              </svg>
              <span>Caregiver</span>
            </span>
            <span className="text-xs text-gray-400">Providing care</span>
          </button>
        </div>

        {/* Sign-In Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
            data-testid="signin-button"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

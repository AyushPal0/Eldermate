import React, { useState, FormEvent } from 'react';

type UserRole = 'elder' | 'caregiver';

const emailTip = "Use a valid email address.";
const passwordTip = "Minimum 8 characters, case sensitive.";

const SignIn: React.FC = () => {
  const [role, setRole] = useState<UserRole>('elder');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [toast, setToast] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleRoleChange = (selectedRole: UserRole) => setRole(selectedRole);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Implement authentication logic here
    if (!email || !password) {
      setToast({type: 'error', message: 'Please fill in all required fields.'});
      setTimeout(() => setToast(null), 2000);
      return;
    }
    setToast({type: 'success', message: `Welcome, ${role}!`});
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-200 overflow-hidden">
      {/* Decorative Light Circles */}
      <div className="absolute top-[-80px] left-[-80px] w-[280px] h-[240px] bg-gradient-to-tr from-blue-100 to-white rounded-full opacity-30 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-[-60px] right-[-90px] w-[200px] h-[160px] bg-gradient-to-br from-blue-100 via-white to-white rounded-full opacity-20 blur-2xl pointer-events-none"></div>

      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-6 left-1/2 z-50 -translate-x-1/2 px-5 py-3 rounded-lg shadow-lg text-white ${
          toast.type === 'success' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-700'
        } animate-fade-in`}>
          {toast.message}
        </div>
      )}

      <section className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl px-10 py-12 flex flex-col items-center relative animate-fade-in">
        {/* Branding / Logo area */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center rounded-xl mb-2 shadow">
            {/* Replace with your logo if desired */}
            <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21C12 21 4 13.613 4 8.75A4.75 4.75 0 0112 4a4.75 4.75 0 018 4.75C20 13.613 12 21 12 21z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800 tracking-tight mb-0.5 text-center">Eldermate</h1>
          <div className="text-sm text-blue-500 font-medium text-center">Trusted Health & Emotional Support</div>
        </div>

        {/* Role Selection */}
        <div className="flex gap-4 w-full mb-6 justify-center" role="radiogroup" aria-label="User Role">
          <button
            type="button"
            aria-pressed={role === 'elder'}
            tabIndex={0}
            className={`group relative flex-1 flex flex-col items-center py-3 rounded-lg border focus:outline-none shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-150
              ${role === 'elder'
                ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-100'
                : 'bg-white border-gray-200 text-gray-500'
              }`}
            onClick={() => handleRoleChange('elder')}
          >
            <span className="flex items-center gap-1 mb-1">
              <svg className={`w-6 h-6 ${role === 'elder' ? 'text-blue-400' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <circle cx="12" cy="8" r="4" strokeWidth={2} />
                <path d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6" strokeWidth={2} />
              </svg>
              <span>Elder User</span>
            </span>
            <span className={`text-xs ${role === 'elder' ? 'text-blue-500' : 'text-gray-400'}`}>Looking for support</span>
            <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition text-xs mt-2 px-3 py-1 bg-blue-600 text-white rounded shadow-lg left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
              Seniors seeking health & connection.
            </div>
          </button>
          <button
            type="button"
            aria-pressed={role === 'caregiver'}
            tabIndex={0}
            className={`group relative flex-1 flex flex-col items-center py-3 rounded-lg border focus:outline-none shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-150
              ${role === 'caregiver'
                ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-100'
                : 'bg-white border-gray-200 text-gray-500'
              }`}
            onClick={() => handleRoleChange('caregiver')}
          >
            <span className="flex items-center gap-1 mb-1">
              <svg className={`w-6 h-6 ${role === 'caregiver' ? 'text-blue-400' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <rect x="6" y="12" width="12" height="8" rx="3" strokeWidth={2}/>
                <path d="M12 12V8a4 4 0 018 0v4" strokeWidth={2}/>
              </svg>
              <span>Caregiver</span>
            </span>
            <span className={`text-xs ${role === 'caregiver' ? 'text-blue-500' : 'text-gray-400'}`}>Providing care</span>
            <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition text-xs mt-2 px-3 py-1 bg-blue-600 text-white rounded shadow-lg left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
              Family or professional care provider.
            </div>
          </button>
        </div>

        {/* Sign-In Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5 mt-2">
          {/* Email Field */}
          <div className="relative">
            <label htmlFor="email" className="block mb-2 text-blue-700 text-sm font-medium tracking-wide">
              Email
              <span className="ml-1 text-slate-400 cursor-pointer group relative">
                &#8505;
                <span className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition text-xs px-3 py-1 bg-slate-700 text-white rounded shadow z-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {emailTip}
                </span>
              </span>
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-[16px] text-blue-900 bg-white/90 hover:bg-white shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
            />
          </div>
          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block mb-2 text-blue-700 text-sm font-medium tracking-wide">
              Password
              <span className="ml-1 text-slate-400 cursor-pointer group relative">
                &#8505;
                <span className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition text-xs px-3 py-1 bg-slate-700 text-white rounded shadow z-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {passwordTip}
                </span>
              </span>
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-[16px] text-blue-900 bg-white/90 hover:bg-white shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 hover:from-blue-700 hover:to-blue-500 transition text-white font-semibold text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-[.98]"
            data-testid="signin-button"
          >
            Sign In
          </button>
        </form>
        <div className="w-full flex justify-between mt-7 text-blue-500 text-[13px] font-medium">
          <a href="#" className="hover:underline hover:text-blue-700 transition">Forgot password?</a>
          <a href="#" className="hover:underline hover:text-blue-700 transition">Create account</a>
        </div>
      </section>
      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px);}
          100% { opacity: 1; transform: none;}
        }
        .animate-fade-in { animation: fade-in .7s cubic-bezier(.33,.77,.53,1) both; }
      `}</style>
    </div>
  );
};

export default SignIn;

import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Login successful! Redirecting to dashboard...' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Inter'] text-slate-800">
      <div className="max-w-md w-full bg-[#f3e8ff] rounded-3xl shadow-xl shadow-purple-900/10 border-2 border-purple-300/80 p-6 sm:p-10 text-left">
        {/* Header Brand Cursive Logo */}
        <div className="flex items-center mb-6">
          <span className="font-cursive text-4xl sm:text-5xl font-bold text-slate-900 tracking-wide">
            Prereq
          </span>
        </div>

        <div className="space-y-1 mb-8">
          <h2 className="text-[30px] font-bold text-purple-950 tracking-[-0.5px] leading-tight">
            Welcome back 👋
          </h2>
          <p className="text-[15px] text-purple-800/80 font-semibold">
            Please enter your credentials to access your workspace.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl text-sm font-medium mb-6 transition-all ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
              : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-purple-950 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-purple-300 rounded-2xl text-slate-900 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold text-purple-950 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs font-bold text-purple-950 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-white border-2 border-purple-300 rounded-2xl text-slate-900 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-400 hover:text-purple-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.046 10.046 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center pt-1">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-purple-900 focus:ring-purple-500 border-purple-300 rounded transition-all cursor-pointer accent-purple-950"
            />
            <label htmlFor="rememberMe" className="ml-2.5 block text-xs font-bold text-purple-950 cursor-pointer">
              Remember me on this device
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl shadow-lg shadow-slate-900/20 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="pt-8 text-center border-t border-slate-100 mt-6">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-slate-900 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}



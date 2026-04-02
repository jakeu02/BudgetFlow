import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineExclamationCircle,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineBriefcase,
  HiOutlineArrowLeft,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { validatePassword, sanitizeAuthError } from '../../utils/validation';

export default function AuthPage({ defaultMode = 'login', onBack }) {
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultMode !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isLogin) {
      const pwError = validatePassword(password);
      if (pwError) { setError(pwError); return; }
    }

    if (!isLogin) {
      if (!fullName.trim()) {
        setError('Full name is required.');
        return;
      }
      if (age && (isNaN(age) || parseInt(age) < 13 || parseInt(age) > 120)) {
        setError('Please enter a valid age (13-120).');
        return;
      }
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(sanitizeAuthError(error));
    } else {
      const { data, error } = await signUp(email, password, {
        fullName: fullName.trim(),
        age: age || null,
        occupation: occupation.trim() || null,
      });
      if (error) {
        setError(sanitizeAuthError(error));
      } else if (data.user && !data.session) {
        setSuccessMsg('Check your email to confirm your account, then log in.');
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMsg('');
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) setError(sanitizeAuthError(error));
    setGoogleLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 py-8 dark:bg-surface-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        {onBack && (
          <button
            onClick={() => onBack()}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-primary-500"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        )}

        {/* Logo */}
        <div className="mb-6 sm:mb-8 text-center">
          <img src="/bf-transparent.png" alt="BudgetFlow" className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl shadow-lg shadow-primary-500/30" />
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">BudgetFlow</h1>
          <p className="text-xs sm:text-sm text-surface-400">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 shadow-xl dark:border-surface-800 dark:bg-surface-900">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Email
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-9 pr-4 text-sm sm:py-3 sm:pl-10 text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-surface-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? 'Your password' : 'At least 8 characters'}
                  required
                  className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-9 pr-4 text-sm sm:py-3 sm:pl-10 text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                />
              </div>
            </div>

            {/* Sign-up only fields */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 sm:space-y-4"
              >
                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-surface-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-9 pr-4 text-sm sm:py-3 sm:pl-10 text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-surface-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-9 pr-4 text-sm sm:py-3 sm:pl-10 text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Age <span className="text-surface-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <HiOutlineCalendar className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-surface-400" />
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Your age"
                      min="13"
                      max="120"
                      className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-9 pr-4 text-sm sm:py-3 sm:pl-10 text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Occupation */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Occupation <span className="text-surface-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <HiOutlineBriefcase className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-surface-400" />
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-9 pr-4 text-sm sm:py-3 sm:pl-10 text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-danger-50 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-danger-600 dark:bg-danger-500/10 dark:text-danger-400"
              >
                <HiOutlineExclamationCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Success */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-success-50 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-success-600 dark:bg-success-500/10 dark:text-success-400"
              >
                {successMsg}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 py-3 sm:py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Please wait...
                </span>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 sm:my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
            <span className="text-xs text-surface-400">or</span>
            <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-surface-200 bg-white py-3 text-sm font-semibold text-surface-700 transition-all hover:bg-surface-50 disabled:opacity-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
          >
            {googleLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface-300 border-t-surface-600" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Toggle */}
          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-surface-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMsg('');
                setFullName('');
                setAge('');
                setOccupation('');
              }}
              className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          {/* Legal links */}
          <p className="mt-3 text-center text-xs text-surface-400">
            By continuing, you agree to our{' '}
            <button onClick={() => onBack && onBack('terms')} className="underline hover:text-primary-500">Terms of Service</button>
            {' '}and{' '}
            <button onClick={() => onBack && onBack('privacy')} className="underline hover:text-primary-500">Privacy Policy</button>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineBriefcase,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSetup() {
  const { profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [occupation, setOccupation] = useState(profile?.occupation || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!age || isNaN(age) || parseInt(age) < 13 || parseInt(age) > 120) {
      setError('Please enter a valid age (13-120).');
      return;
    }
    if (!occupation.trim()) {
      setError('Occupation is required.');
      return;
    }

    setSaving(true);
    const { error: updateError } = await updateProfile({
      full_name: fullName.trim(),
      age: parseInt(age, 10),
      occupation: occupation.trim(),
    });
    setSaving(false);

    if (updateError) {
      setError(updateError.message || 'Failed to save profile.');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-surface-200 bg-white px-4 py-3 pl-11 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white';

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <img
            src={`${import.meta.env.BASE_URL}bf-transparent.png`}
            alt="BudgetFlow"
            className="mx-auto mb-4 h-16 w-16"
          />
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-sm text-surface-400">
            Tell us a bit about yourself to get started
          </p>
        </div>

        <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-xl shadow-surface-900/5 dark:border-surface-800 dark:bg-surface-900">
          {error && (
            <div className="mb-4 rounded-xl bg-danger-50 px-4 py-3 text-sm text-danger-600 dark:bg-danger-500/10 dark:text-danger-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-500 dark:text-surface-400">
                Full Name
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3.5 top-3.5 h-4 w-4 text-surface-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-500 dark:text-surface-400">
                Age
              </label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-3.5 top-3.5 h-4 w-4 text-surface-400" />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  min="13"
                  max="120"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-500 dark:text-surface-400">
                Occupation
              </label>
              <div className="relative">
                <HiOutlineBriefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-surface-400" />
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Student, Engineer, Designer"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Continue to Dashboard'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

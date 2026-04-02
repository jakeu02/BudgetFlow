import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineTrash,
  HiOutlineCurrencyDollar,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlinePencil,
  HiOutlineDownload,
  HiOutlineUpload,
} from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { useAuth } from '../../context/AuthContext';
import { CURRENCIES } from '../../utils/constants';
import { exportData, importData } from '../../utils/backup';

export default function Settings() {
  const { state, dispatch, fetchData } = useBudget();
  const { user, profile, signOut, updateProfile } = useAuth();
  const { darkMode, currency } = state;

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editOccupation, setEditOccupation] = useState('');
  const [saving, setSaving] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupMessage, setBackupMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleLogout = async () => {
    await signOut();
  };

  const startEditing = () => {
    setEditName(profile?.full_name || '');
    setEditAge(profile?.age?.toString() || '');
    setEditOccupation(profile?.occupation || '');
    setEditing(true);
  };

  const saveProfile = async () => {
    setSaving(true);
    await updateProfile({
      full_name: editName.trim(),
      age: editAge ? parseInt(editAge, 10) : null,
      occupation: editOccupation.trim() || null,
    });
    setSaving(false);
    setEditing(false);
  };

  const handleExport = () => {
    try {
      exportData(state.transactions, state.budgets, profile);
      setBackupMessage({ type: 'success', text: 'Backup exported successfully!' });
    } catch {
      setBackupMessage({ type: 'error', text: 'Failed to export backup.' });
    }
    setTimeout(() => setBackupMessage(null), 4000);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackupLoading(true);
    setBackupMessage(null);
    try {
      const result = await importData(file, user.id);
      await fetchData();
      setBackupMessage({
        type: 'success',
        text: `Imported ${result.txCount} transactions and ${result.budgetCount} budgets successfully!`,
      });
    } catch (err) {
      setBackupMessage({ type: 'error', text: err.message || 'Failed to import backup.' });
    } finally {
      setBackupLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    setTimeout(() => setBackupMessage(null), 4000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">Settings</h2>
        <p className="text-xs sm:text-sm text-surface-400">Customize your BudgetFlow experience</p>
      </div>

      {/* Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900"
      >
        <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base font-semibold text-surface-900 dark:text-white">
          <HiOutlineUser className="h-5 w-5 text-primary-500" />
          Account
        </h3>

        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-surface-500 dark:text-surface-400">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-surface-500 dark:text-surface-400">Age</label>
              <input
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
                min="13"
                max="120"
                className="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-surface-500 dark:text-surface-400">Occupation</label>
              <input
                type="text"
                value={editOccupation}
                onChange={(e) => setEditOccupation(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
                {(profile?.full_name || user?.email)?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-surface-700 dark:text-surface-300">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-xs text-surface-400">{user?.email}</p>
                {profile?.age && (
                  <p className="text-xs text-surface-400">Age: {profile.age}</p>
                )}
                {profile?.occupation && (
                  <p className="text-xs text-surface-400">{profile.occupation}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startEditing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 sm:flex-initial dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800"
              >
                <HiOutlinePencil className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleLogout}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 hover:text-danger-500 sm:flex-initial dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-danger-400"
              >
                <HiOutlineLogout className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900"
      >
        <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base font-semibold text-surface-900 dark:text-white">
          {darkMode ? <HiOutlineMoon className="h-5 w-5 text-primary-500" /> : <HiOutlineSun className="h-5 w-5 text-warning-500" />}
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Dark Mode</p>
            <p className="text-xs text-surface-400">Switch between light and dark themes</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
              darkMode ? 'bg-primary-500' : 'bg-surface-300'
            }`}
          >
            <span
              className={`absolute left-0 top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                darkMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Currency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900"
      >
        <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base font-semibold text-surface-900 dark:text-white">
          <HiOutlineCurrencyDollar className="h-5 w-5 text-success-500" />
          Currency
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CURRENCIES.map((cur) => (
            <button
              key={cur.code}
              onClick={() => dispatch({ type: 'SET_CURRENCY', payload: cur })}
              className={`flex items-center gap-2 sm:gap-3 rounded-xl border-2 px-3 py-2.5 sm:px-4 sm:py-3 text-left transition-all
                ${currency.code === cur.code
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                  : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600'
                }`}
            >
              <span className="text-base sm:text-lg font-bold text-surface-900 dark:text-white">{cur.symbol}</span>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-surface-900 dark:text-white">{cur.code}</p>
                <p className="hidden text-xs text-surface-400 sm:block">{cur.name}</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Data Backup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900"
      >
        <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base font-semibold text-surface-900 dark:text-white">
          <HiOutlineDownload className="h-5 w-5 text-primary-500" />
          Data Backup
        </h3>
        <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-surface-500 dark:text-surface-400">
          Export your data as a JSON file or import a previous backup.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={handleExport}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 sm:flex-initial"
          >
            <HiOutlineDownload className="h-4 w-4" />
            Export Backup
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={backupLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-surface-200 px-5 py-2.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 disabled:opacity-50 sm:flex-initial dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800"
          >
            <HiOutlineUpload className="h-4 w-4" />
            {backupLoading ? 'Importing...' : 'Import Backup'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
        {backupMessage && (
          <div
            className={`mt-3 rounded-xl px-4 py-2.5 text-sm font-medium ${
              backupMessage.type === 'success'
                ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'
                : 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-400'
            }`}
          >
            {backupMessage.text}
          </div>
        )}
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-danger-200 bg-danger-50/50 p-4 sm:p-6 dark:border-danger-500/20 dark:bg-danger-500/5"
      >
        <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base font-semibold text-danger-700 dark:text-danger-400">
          <HiOutlineTrash className="h-5 w-5" />
          Danger Zone
        </h3>
        <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-surface-500 dark:text-surface-400">
          This will permanently delete all your transactions and budgets. This action cannot be undone.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Are you sure? This will delete all your data permanently.')) {
              dispatch({ type: 'CLEAR_ALL_DATA' });
            }
          }}
          className="w-full rounded-xl bg-danger-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger-600 sm:w-auto"
        >
          Clear All Data
        </button>
      </motion.div>
    </div>
  );
}

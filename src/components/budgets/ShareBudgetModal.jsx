import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClipboardCopy, HiOutlineTrash, HiOutlineShare, HiOutlineCheck } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { getCategoryById } from '../../utils/constants';
import Modal from '../common/Modal';

export default function ShareBudgetModal({ isOpen, onClose, budgetId }) {
  const { state, dispatch } = useBudget();
  const { budgetShares, budgets } = state;
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const budget = budgets.find((b) => b.id === budgetId);
  const existingShare = budgetShares.find((s) => s.budget_id === budgetId);
  const cat = budget ? getCategoryById(budget.category) : null;

  const handleGenerateLink = async () => {
    if (!budgetId) return;
    setLoading(true);
    try {
      await dispatch({
        type: 'ADD_BUDGET_SHARE',
        payload: { budget_id: budgetId },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShare = async () => {
    if (!existingShare) return;
    setLoading(true);
    try {
      await dispatch({ type: 'DELETE_BUDGET_SHARE', payload: existingShare.id });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!existingShare?.share_token) return;
    try {
      await navigator.clipboard.writeText(existingShare.share_token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select and copy
      const textArea = document.createElement('textarea');
      textArea.value = existingShare.share_token;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Budget">
      <div className="space-y-5">
        {/* Budget Info */}
        {cat && (
          <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-surface-50 p-3 dark:border-surface-700 dark:bg-surface-800/50">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
              style={{ backgroundColor: `${cat.color}15` }}
            >
              {cat.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">{cat.name}</p>
              <p className="text-xs text-surface-400">Budget sharing</p>
            </div>
          </div>
        )}

        {existingShare ? (
          <>
            {/* Share Token Display */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                Share Code
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xl border border-surface-200 bg-white px-4 py-3 font-mono text-sm text-surface-900 dark:border-surface-600 dark:bg-surface-700 dark:text-white">
                  {existingShare.share_token}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl transition-colors ${
                    copied
                      ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                      : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20'
                  }`}
                >
                  {copied ? (
                    <HiOutlineCheck className="h-5 w-5" />
                  ) : (
                    <HiOutlineClipboardCopy className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
              {copied && (
                <p className="text-xs font-medium text-green-600 dark:text-green-400">
                  Copied to clipboard!
                </p>
              )}
            </div>

            {/* Info Message */}
            <div className="rounded-xl bg-primary-50 p-3 dark:bg-primary-500/10">
              <p className="text-xs leading-relaxed text-primary-700 dark:text-primary-300">
                Share this code with others to let them view your budget. They will have read-only access.
              </p>
            </div>

            {/* Remove Share Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleRemoveShare}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-danger-200 bg-danger-50 py-3 text-sm font-semibold text-danger-600 transition-colors hover:bg-danger-100 disabled:opacity-50 dark:border-danger-500/20 dark:bg-danger-500/10 dark:text-danger-400 dark:hover:bg-danger-500/20"
            >
              <HiOutlineTrash className="h-4 w-4" />
              {loading ? 'Removing...' : 'Remove Share Link'}
            </motion.button>
          </>
        ) : (
          <>
            {/* No Share Exists */}
            <div className="rounded-xl bg-surface-50 p-4 text-center dark:bg-surface-800/50">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-500/10">
                <HiOutlineShare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
                No share link yet
              </p>
              <p className="mt-1 text-xs text-surface-400">
                Generate a share code to let others view this budget
              </p>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Share Link'}
            </motion.button>
          </>
        )}
      </div>
    </Modal>
  );
}

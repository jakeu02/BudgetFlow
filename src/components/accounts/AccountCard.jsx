import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { formatCurrency } from '../../utils/helpers';
import { ACCOUNT_TYPES } from '../../utils/constants';

export default function AccountCard({ account, currency, onDelete, onEdit }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const accountType = ACCOUNT_TYPES.find((t) => t.id === account.type) || {};

  const handleDelete = () => {
    if (showConfirm) {
      onDelete(account.id);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 transition-shadow hover:shadow-lg dark:border-surface-800 dark:bg-surface-900"
      style={{ borderLeftWidth: '4px', borderLeftColor: account.color || accountType.color || '#6366f1' }}
    >
      {/* Header */}
      <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl sm:h-12 sm:w-12"
            style={{ backgroundColor: `${account.color || accountType.color || '#6366f1'}15` }}
          >
            {account.icon || accountType.icon || '🏦'}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-surface-900 dark:text-white">
              {account.name}
            </h4>
            <p className="text-xs text-surface-400">{accountType.name || account.type}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => onEdit && onEdit(account)}
            className="rounded-lg p-1.5 text-surface-300 opacity-100 sm:opacity-0 transition-all hover:bg-primary-50 hover:text-primary-500 sm:group-hover:opacity-100 dark:text-surface-600 dark:hover:bg-primary-500/10"
          >
            <HiOutlinePencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className={`rounded-lg p-1.5 transition-all ${
              showConfirm
                ? 'bg-danger-50 text-danger-500 dark:bg-danger-500/10'
                : 'text-surface-300 opacity-100 sm:opacity-0 hover:bg-danger-50 hover:text-danger-500 sm:group-hover:opacity-100 dark:text-surface-600 dark:hover:bg-danger-500/10'
            }`}
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-surface-400 mb-1">Balance</p>
          <p className={`text-lg sm:text-xl font-bold ${account.balance >= 0 ? 'text-surface-900 dark:text-white' : 'text-danger-500'}`}>
            {formatCurrency(account.balance, currency)}
          </p>
        </div>
        <span
          className="rounded-lg px-2 py-0.5 text-xs font-bold"
          style={{
            backgroundColor: `${account.color || accountType.color || '#6366f1'}15`,
            color: account.color || accountType.color || '#6366f1',
          }}
        >
          {accountType.name || account.type}
        </span>
      </div>
    </motion.div>
  );
}

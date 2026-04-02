import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/helpers';
import AccountCard from './AccountCard';
import AddAccount from './AddAccount';

export default function AccountsPage() {
  const { state, dispatch } = useBudget();
  const { accounts, currency } = state;
  const [addOpen, setAddOpen] = useState(false);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + (a.balance || 0), 0),
    [accounts]
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">Accounts</h2>
          <p className="text-xs sm:text-sm text-surface-400">Manage your financial accounts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAddOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-shadow hover:shadow-xl hover:shadow-primary-500/40 sm:w-auto sm:px-5"
        >
          <HiOutlinePlus className="h-4 w-4" />
          Add Account
        </motion.button>
      </div>

      {/* Total Balance Summary */}
      <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs sm:text-sm text-surface-400">Total Balance Across All Accounts</p>
            <p className={`text-xl sm:text-2xl font-bold ${totalBalance >= 0 ? 'text-surface-900 dark:text-white' : 'text-danger-500'}`}>
              {formatCurrency(totalBalance, currency)}
            </p>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-surface-500">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Account Cards */}
      {accounts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-surface-200 py-12 sm:py-16 text-center dark:border-surface-700">
          <p className="text-3xl sm:text-4xl">🏦</p>
          <p className="mt-3 text-sm font-medium text-surface-500">No accounts yet</p>
          <p className="text-xs text-surface-400">Add your first account to start tracking balances</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                currency={currency}
                onDelete={(id) => dispatch({ type: 'DELETE_ACCOUNT', payload: id })}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Account Modal */}
      <AddAccount isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

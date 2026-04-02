import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/helpers';
import GoalCard from './GoalCard';
import AddGoal from './AddGoal';
import AddFundsModal from './AddFundsModal';

export default function GoalsPage() {
  const { state, dispatch } = useBudget();
  const { goals, currency } = state;
  const [addOpen, setAddOpen] = useState(false);
  const [fundsModal, setFundsModal] = useState({ open: false, goal: null, mode: 'add' });

  const totalSaved = useMemo(() => goals.reduce((s, g) => s + g.current_amount, 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((s, g) => s + g.target_amount, 0), [goals]);
  const overallPct = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  const handleOpenFunds = (goal, mode) => {
    setFundsModal({ open: true, goal, mode });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">Financial Goals</h2>
          <p className="text-xs sm:text-sm text-surface-400">Save towards what matters most</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAddOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-shadow hover:shadow-xl hover:shadow-primary-500/40 sm:w-auto sm:px-5"
        >
          <HiOutlinePlus className="h-4 w-4" />
          Add Goal
        </motion.button>
      </div>

      {/* Overview Card */}
      <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900">
        <div className="mb-3 sm:mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs sm:text-sm text-surface-400">Total Savings Progress</p>
            <p className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
              {formatCurrency(totalSaved, currency)}{' '}
              <span className="text-sm sm:text-base font-normal text-surface-400">
                / {formatCurrency(totalTarget, currency)}
              </span>
            </p>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-surface-500">
            {overallPct.toFixed(0)}% saved
          </span>
        </div>
        <div className="h-2.5 sm:h-3 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
          />
        </div>
      </div>

      {/* Goal Cards */}
      {goals.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-surface-200 py-12 sm:py-16 text-center dark:border-surface-700">
          <p className="text-3xl sm:text-4xl">&#127919;</p>
          <p className="mt-3 text-sm font-medium text-surface-500">No goals yet</p>
          <p className="text-xs text-surface-400">Set your first financial goal and start saving</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                currency={currency}
                onDelete={(id) => dispatch({ type: 'DELETE_GOAL', payload: id })}
                onAddFunds={handleOpenFunds}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AddGoal isOpen={addOpen} onClose={() => setAddOpen(false)} />
      <AddFundsModal
        isOpen={fundsModal.open}
        onClose={() => setFundsModal({ open: false, goal: null, mode: 'add' })}
        goal={fundsModal.goal}
        initialMode={fundsModal.mode}
      />
    </div>
  );
}

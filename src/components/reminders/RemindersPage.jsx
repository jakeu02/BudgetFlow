import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineBell } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency, getDaysUntilDue } from '../../utils/helpers';
import ReminderCard from './ReminderCard';
import AddReminder from './AddReminder';

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'paid', label: 'Paid' },
];

export default function RemindersPage() {
  const { state, dispatch } = useBudget();
  const { reminders, currency } = state;
  const [addOpen, setAddOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Compute summary stats
  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let upcomingCount = 0;
    let overdueCount = 0;
    let totalDueThisMonth = 0;

    reminders.forEach((r) => {
      if (r.is_paid) return;
      const days = getDaysUntilDue(r.due_date);
      if (days < 0) {
        overdueCount++;
      } else {
        upcomingCount++;
      }
      const dueDate = new Date(r.due_date);
      if (dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear && !r.is_paid) {
        totalDueThisMonth += r.amount;
      }
    });

    return { upcomingCount, overdueCount, totalDueThisMonth };
  }, [reminders]);

  // Filter reminders
  const filteredReminders = useMemo(() => {
    const sorted = [...reminders].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    switch (activeFilter) {
      case 'upcoming':
        return sorted.filter((r) => !r.is_paid && getDaysUntilDue(r.due_date) >= 0);
      case 'overdue':
        return sorted.filter((r) => !r.is_paid && getDaysUntilDue(r.due_date) < 0);
      case 'paid':
        return sorted.filter((r) => r.is_paid);
      default:
        return sorted;
    }
  }, [reminders, activeFilter]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">Bill Reminders</h2>
          <p className="text-xs sm:text-sm text-surface-400">Never miss a payment again</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAddOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-shadow hover:shadow-xl hover:shadow-primary-500/40 sm:w-auto sm:px-5"
        >
          <HiOutlinePlus className="h-4 w-4" />
          Add Reminder
        </motion.button>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-surface-400">Upcoming</p>
            <p className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
              {summary.upcomingCount}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm text-surface-400">Due This Month</p>
            <p className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
              {formatCurrency(summary.totalDueThisMonth, currency)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm text-surface-400">Overdue</p>
            <p className={`text-xl sm:text-2xl font-bold ${summary.overdueCount > 0 ? 'text-danger-500' : 'text-surface-900 dark:text-white'}`}>
              {summary.overdueCount}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-all ${
              activeFilter === tab.id
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                : 'text-surface-500 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminder Cards */}
      {filteredReminders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-surface-200 py-12 sm:py-16 text-center dark:border-surface-700">
          <HiOutlineBell className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-surface-300 dark:text-surface-600" />
          <p className="mt-3 text-sm font-medium text-surface-500">
            {activeFilter === 'all' ? 'No reminders yet' : `No ${activeFilter} reminders`}
          </p>
          <p className="text-xs text-surface-400">
            {activeFilter === 'all'
              ? 'Add your first bill reminder to stay on top of payments'
              : 'All caught up!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                currency={currency}
                onDelete={(id) => dispatch({ type: 'DELETE_REMINDER', payload: id })}
                onMarkPaid={(id) => dispatch({ type: 'MARK_REMINDER_PAID', payload: id })}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Reminder Modal */}
      <AddReminder isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

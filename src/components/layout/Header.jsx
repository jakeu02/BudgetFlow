import { useMemo } from 'react';
import { HiOutlineMenuAlt2, HiOutlineBell } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { useAuth } from '../../context/AuthContext';
import { getGreeting, getDaysUntilDue } from '../../utils/helpers';

export default function Header() {
  const { state, dispatch } = useBudget();
  const { user, profile } = useAuth();

  const displayName = profile?.full_name || user?.email?.split('@')[0];

  // Count upcoming and overdue reminders
  const reminderBadgeCount = useMemo(() => {
    return (state.reminders || []).filter((r) => {
      if (r.is_paid) return false;
      const days = getDaysUntilDue(r.due_date);
      return days <= (r.notify_before_days || 3);
    }).length;
  }, [state.reminders]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-surface-200 bg-white/80 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4 lg:px-8 dark:border-surface-800 dark:bg-surface-900/80">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="shrink-0 rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-700 lg:hidden dark:hover:bg-surface-800 dark:hover:text-white"
        >
          <HiOutlineMenuAlt2 className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-surface-900 sm:text-xl dark:text-white">
            {getGreeting()}{displayName ? `, ${displayName}` : ''} 👋
          </h2>
          <p className="hidden text-sm text-surface-400 sm:block">
            Here&apos;s your financial overview
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'reminders' })}
          className="relative rounded-xl p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 sm:p-2.5 dark:hover:bg-surface-800 dark:hover:text-white"
        >
          <HiOutlineBell className="h-5 w-5" />
          {reminderBadgeCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white sm:right-0.5 sm:top-0.5">
              {reminderBadgeCount > 9 ? '9+' : reminderBadgeCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

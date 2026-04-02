import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineViewGrid,
  HiOutlineSwitchVertical,
  HiOutlineChartPie,
  HiOutlineFlag,
  HiOutlineCreditCard,
  HiOutlineBell,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineInformationCircle,
  HiOutlineX,
  HiOutlineMoon,
  HiOutlineSun,
} from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { id: 'transactions', label: 'Transactions', icon: HiOutlineSwitchVertical },
  { id: 'budgets', label: 'Budgets', icon: HiOutlineChartPie },
  { id: 'goals', label: 'Goals', icon: HiOutlineFlag },
  { id: 'accounts', label: 'Accounts', icon: HiOutlineCreditCard },
  { id: 'reminders', label: 'Reminders', icon: HiOutlineBell },
  { id: 'reports', label: 'Reports', icon: HiOutlineChartBar },
  { id: 'settings', label: 'Settings', icon: HiOutlineCog },
  { id: 'about', label: 'About', icon: HiOutlineInformationCircle },
];

export default function Sidebar() {
  const { state, dispatch } = useBudget();
  const { user, profile } = useAuth();
  const { activeView, darkMode, sidebarOpen } = state;

  // Only animate on mobile; always show on desktop (lg+)
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isDesktop ? 0 : (sidebarOpen ? 0 : -260) }}
        className="fixed top-0 left-0 z-50 flex h-full w-65 flex-col border-r border-surface-200 bg-white sm:w-70 lg:relative lg:z-0 lg:w-70 dark:border-surface-800 dark:bg-surface-900"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img src={`${import.meta.env.BASE_URL}bf-transparent.png`} alt="BudgetFlow" className="h-9 w-9 rounded-xl shadow-lg shadow-primary-500/30 sm:h-10 sm:w-10" />
            <div>
              <h1 className="text-base font-bold text-surface-900 sm:text-lg dark:text-white">BudgetFlow</h1>
              <p className="text-xs text-surface-400">Smart Tracker</p>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 hover:text-surface-600 lg:hidden dark:hover:bg-surface-800"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2 sm:py-4">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  dispatch({ type: 'SET_VIEW', payload: item.id });
                  if (window.innerWidth < 1024) dispatch({ type: 'TOGGLE_SIDEBAR' });
                }}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                    : 'text-surface-500 hover:bg-surface-50 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-600"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User info + Dark mode toggle */}
        <div className="border-t border-surface-200 px-3 py-3 sm:px-4 sm:py-4 dark:border-surface-800">
          {user && (
            <div className="mb-1.5 flex items-center gap-2.5 px-3 py-2 sm:px-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 sm:h-8 sm:w-8 dark:bg-primary-500/20 dark:text-primary-400">
                {(profile?.full_name || user.email)?.charAt(0).toUpperCase()}
              </div>
              <p className="min-w-0 truncate text-xs font-medium text-surface-600 sm:text-sm dark:text-surface-400">
                {profile?.full_name || user.email}
              </p>
            </div>
          )}

          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-500 transition-all hover:bg-surface-50 hover:text-surface-900 sm:px-4 sm:py-3 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white"
          >
            {darkMode ? (
              <HiOutlineSun className="h-5 w-5 text-warning-500" />
            ) : (
              <HiOutlineMoon className="h-5 w-5" />
            )}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

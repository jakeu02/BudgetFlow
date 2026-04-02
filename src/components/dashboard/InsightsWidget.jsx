import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiLightBulb } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { generateInsights } from '../../utils/insights';

const severityStyles = {
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  success: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

const severityDot = {
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  success: 'bg-green-500',
};

export default function InsightsWidget() {
  const { state } = useBudget();
  const { transactions, budgets } = state;

  const insights = useMemo(
    () => generateInsights(transactions, budgets),
    [transactions, budgets]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-amber-100 p-1.5 dark:bg-amber-900/40">
          <HiLightBulb className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-surface-900 dark:text-white">
          Insights
        </h3>
      </div>

      {insights.length === 0 ? (
        <div className="flex h-20 items-center justify-center text-sm text-surface-400">
          Add more transactions to get personalized insights
        </div>
      ) : (
        <div className="space-y-2.5">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`flex items-start gap-3 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 ${severityStyles[insight.severity]}`}
            >
              <span className="shrink-0 text-base sm:text-lg leading-none mt-0.5">
                {insight.icon}
              </span>
              <p className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                {insight.message}
              </p>
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot[insight.severity]}`}
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

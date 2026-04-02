import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineDocumentDownload } from 'react-icons/hi';
import { subMonths, subDays, startOfMonth, endOfMonth, startOfYear, isWithinInterval, parseISO } from 'date-fns';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/helpers';
import { exportToCSV } from '../../utils/export';
import CategoryReport from './CategoryReport';
import TrendReport from './TrendReport';
import PeriodComparison from './PeriodComparison';

const PERIODS = [
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'last_3', label: 'Last 3 Months' },
  { id: 'last_6', label: 'Last 6 Months' },
  { id: 'this_year', label: 'This Year' },
  { id: 'all', label: 'All Time' },
];

function getDateRange(periodId) {
  const now = new Date();
  switch (periodId) {
    case 'this_month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'last_month': {
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    }
    case 'last_3':
      return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now) };
    case 'last_6':
      return { start: startOfMonth(subMonths(now, 5)), end: endOfMonth(now) };
    case 'this_year':
      return { start: startOfYear(now), end: endOfMonth(now) };
    case 'all':
      return { start: new Date(2000, 0, 1), end: new Date(2100, 0, 1) };
    default:
      return { start: startOfMonth(now), end: endOfMonth(now) };
  }
}

function getPreviousDateRange(periodId) {
  const now = new Date();
  switch (periodId) {
    case 'this_month': {
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    }
    case 'last_month': {
      const twoMonthsAgo = subMonths(now, 2);
      return { start: startOfMonth(twoMonthsAgo), end: endOfMonth(twoMonthsAgo) };
    }
    case 'last_3':
      return { start: startOfMonth(subMonths(now, 5)), end: endOfMonth(subMonths(now, 3)) };
    case 'last_6':
      return { start: startOfMonth(subMonths(now, 11)), end: endOfMonth(subMonths(now, 6)) };
    case 'this_year': {
      const lastYear = subMonths(now, 12);
      return { start: startOfYear(lastYear), end: endOfMonth(subMonths(startOfYear(now), 1)) };
    }
    case 'all':
      return { start: new Date(2000, 0, 1), end: new Date(2000, 0, 1) };
    default:
      return { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };
  }
}

function filterByRange(transactions, range) {
  return transactions.filter((t) => {
    const date = parseISO(t.date);
    return isWithinInterval(date, { start: range.start, end: range.end });
  });
}

export default function ReportsPage() {
  const { state } = useBudget();
  const { transactions, currency } = state;
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');

  const currentRange = useMemo(() => getDateRange(selectedPeriod), [selectedPeriod]);
  const previousRange = useMemo(() => getPreviousDateRange(selectedPeriod), [selectedPeriod]);

  const filteredTransactions = useMemo(
    () => filterByRange(transactions, currentRange),
    [transactions, currentRange]
  );

  const previousTransactions = useMemo(
    () => filterByRange(transactions, previousRange),
    [transactions, previousRange]
  );

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const net = income - expenses;
    const savingsRate = income > 0 ? (net / income) * 100 : 0;
    return { income, expenses, net, savingsRate };
  }, [filteredTransactions]);

  const handleExport = () => {
    exportToCSV(filteredTransactions, currency);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-5xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-surface-900 sm:text-2xl dark:text-white">
            Reports
          </h2>
          <p className="mt-1 text-sm text-surface-400">
            Analyze your financial data and track spending trends
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-700 hover:shadow-primary-500/40"
        >
          <HiOutlineDocumentDownload className="h-4.5 w-4.5" />
          Export CSV
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((period) => (
          <button
            key={period.id}
            onClick={() => setSelectedPeriod(period.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              selectedPeriod === period.id
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                : 'bg-white text-surface-600 hover:bg-surface-100 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 dark:border-surface-800 dark:bg-surface-900"
        >
          <p className="text-xs font-medium text-surface-400">Total Income</p>
          <p className="mt-1 text-lg font-bold text-emerald-600 sm:text-xl dark:text-emerald-400">
            {formatCurrency(summary.income, currency)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 dark:border-surface-800 dark:bg-surface-900"
        >
          <p className="text-xs font-medium text-surface-400">Total Expenses</p>
          <p className="mt-1 text-lg font-bold text-red-600 sm:text-xl dark:text-red-400">
            {formatCurrency(summary.expenses, currency)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 dark:border-surface-800 dark:bg-surface-900"
        >
          <p className="text-xs font-medium text-surface-400">Net Savings</p>
          <p className={`mt-1 text-lg font-bold sm:text-xl ${
            summary.net >= 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {summary.net >= 0 ? '+' : ''}{formatCurrency(summary.net, currency)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 dark:border-surface-800 dark:bg-surface-900"
        >
          <p className="text-xs font-medium text-surface-400">Savings Rate</p>
          <p className={`mt-1 text-lg font-bold sm:text-xl ${
            summary.savingsRate >= 0
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {summary.savingsRate.toFixed(1)}%
          </p>
        </motion.div>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryReport transactions={filteredTransactions} currency={currency} />
        <TrendReport transactions={transactions} currency={currency} />
      </div>

      {/* Period Comparison */}
      <PeriodComparison
        currentTransactions={filteredTransactions}
        previousTransactions={previousTransactions}
        currency={currency}
        periodLabel={PERIODS.find((p) => p.id === selectedPeriod)?.label}
      />
    </motion.div>
  );
}

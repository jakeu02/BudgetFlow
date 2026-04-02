import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowUp, HiArrowDown, HiOutlineTrash, HiOutlineSearch, HiOutlineRefresh } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { getCategoryById, CATEGORIES } from '../../utils/constants';
import AddTransaction from './AddTransaction';
import RecurringTransactions from './RecurringTransactions';
import AddRecurring from './AddRecurring';

export default function TransactionList() {
  const { state, dispatch } = useBudget();
  const { transactions, currency } = state;

  const [activeTab, setActiveTab] = useState('transactions');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTag, setFilterTag] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');

  // Compute popular tags from all transactions
  const popularTags = useMemo(() => {
    const tagCounts = {};
    transactions.forEach((tx) => {
      (tx.tags || []).forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [transactions]);

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(s) ||
          getCategoryById(t.category).name.toLowerCase().includes(s)
      );
    }

    if (filterType !== 'all') {
      result = result.filter((t) => t.type === filterType);
    }

    if (filterCategory !== 'all') {
      result = result.filter((t) => t.category === filterCategory);
    }

    if (filterTag) {
      result = result.filter((t) => (t.tags || []).includes(filterTag));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc': return a.amount - b.amount;
        default: return 0;
      }
    });

    return result;
  }, [transactions, search, filterType, filterCategory, filterTag, sortBy]);

  const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Tab Toggle */}
      <div className="flex rounded-xl bg-surface-100 p-1 dark:bg-surface-800">
        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all
            ${activeTab === 'transactions'
              ? 'bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white'
              : 'text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300'
            }`}
        >
          Transactions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('recurring')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all
            ${activeTab === 'recurring'
              ? 'bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white'
              : 'text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300'
            }`}
        >
          <HiOutlineRefresh className="h-4 w-4" />
          Recurring
        </button>
      </div>

      {activeTab === 'recurring' ? (
        <>
          {/* Recurring Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">Recurring Transactions</h2>
              <p className="text-xs sm:text-sm text-surface-400">{state.recurringTransactions.length} recurring items</p>
            </div>
            <AddRecurring />
          </div>
          <RecurringTransactions />
        </>
      ) : (
        <>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">Transactions</h2>
          <p className="text-xs sm:text-sm text-surface-400">{filtered.length} transactions found</p>
        </div>
        <AddTransaction />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-surface-200 bg-white p-3 sm:p-4 dark:border-surface-800 dark:bg-surface-900">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:focus:bg-surface-800"
            />
          </div>

          {/* Filter selects - 3 in a row on mobile, inline on desktop */}
          <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-surface-50 px-2 py-2.5 text-xs sm:w-auto sm:px-3 sm:text-sm text-surface-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-surface-50 px-2 py-2.5 text-xs sm:w-auto sm:px-3 sm:text-sm text-surface-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300"
            >
              <option value="all">Category</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-surface-50 px-2 py-2.5 text-xs sm:w-auto sm:px-3 sm:text-sm text-surface-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300"
            >
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
              <option value="amount-desc">Highest</option>
              <option value="amount-asc">Lowest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tag filters */}
      {popularTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-surface-400 dark:text-surface-500">Tags:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-all
                ${filterTag === tag
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50'
                }`}
            >
              #{tag}
            </button>
          ))}
          {filterTag && (
            <button
              type="button"
              onClick={() => setFilterTag(null)}
              className="text-xs text-surface-400 underline transition-colors hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Transaction list */}
      <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <p className="text-3xl sm:text-4xl">🔍</p>
              <p className="mt-2 text-sm font-medium text-surface-500">No transactions found</p>
              <p className="text-xs text-surface-400">Try adjusting your filters</p>
            </div>
          ) : (
            filtered.map((tx, i) => {
              const cat = getCategoryById(tx.category);
              const isIncome = tx.type === 'income';
              return (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  className="group flex items-center justify-between gap-3 border-b border-surface-100 px-3 py-3 transition-colors last:border-0 hover:bg-surface-50 sm:px-5 sm:py-4 dark:border-surface-800 dark:hover:bg-surface-800/50"
                >
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base sm:h-11 sm:w-11 sm:text-xl"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-semibold text-surface-900 dark:text-white">
                        {tx.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span
                          className="inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                        >
                          {cat.name}
                        </span>
                        {(tx.tags || []).map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterTag(filterTag === tag ? null : tag);
                            }}
                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-all
                              ${filterTag === tag
                                ? 'bg-primary-500 text-white'
                                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50'
                              }`}
                          >
                            #{tag}
                          </button>
                        ))}
                        <span className="hidden text-xs text-surface-400 sm:inline">{formatDate(tx.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1">
                      {isIncome ? (
                        <HiArrowUp className="h-3.5 w-3.5 text-success-500" />
                      ) : (
                        <HiArrowDown className="h-3.5 w-3.5 text-danger-500" />
                      )}
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isIncome
                            ? 'text-success-600 dark:text-success-400'
                            : 'text-danger-600 dark:text-danger-400'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                      </span>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: tx.id })}
                      className="rounded-lg p-2 text-surface-300 opacity-100 sm:opacity-0 transition-all hover:bg-danger-50 hover:text-danger-500 sm:group-hover:opacity-100 dark:text-surface-600 dark:hover:bg-danger-500/10"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
        </>
      )}
    </div>
  );
}

import { motion } from 'framer-motion';
import { HiArrowUp, HiArrowDown, HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { getMonthTransactions, calculateTotals, formatCurrency, getSpendingTrend } from '../../utils/helpers';
import { subMonths } from 'date-fns';

export default function StatsCards() {
  const { state } = useBudget();
  const { transactions, currency } = state;

  const now = new Date();
  const currentMonthTx = getMonthTransactions(transactions, now);
  const prevMonthTx = getMonthTransactions(transactions, subMonths(now, 1));

  const current = calculateTotals(currentMonthTx);
  const previous = calculateTotals(prevMonthTx);

  const incomeTrend = getSpendingTrend(current.income, previous.income);
  const expenseTrend = getSpendingTrend(current.expenses, previous.expenses);

  const cards = [
    {
      title: 'Total Balance',
      amount: current.balance,
      icon: current.balance >= 0 ? HiTrendingUp : HiTrendingDown,
      gradient: 'from-primary-500 to-primary-700',
      shadowColor: 'shadow-primary-500/25',
      subText: 'Current month net',
    },
    {
      title: 'Income',
      amount: current.income,
      icon: HiArrowUp,
      gradient: 'from-success-400 to-success-600',
      shadowColor: 'shadow-success-500/25',
      trend: incomeTrend,
      subText: `${incomeTrend.percent}% vs last month`,
    },
    {
      title: 'Expenses',
      amount: current.expenses,
      icon: HiArrowDown,
      gradient: 'from-danger-400 to-danger-600',
      shadowColor: 'shadow-danger-500/25',
      trend: expenseTrend,
      subText: `${expenseTrend.percent}% vs last month`,
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-4 sm:p-6 shadow-lg ${card.shadowColor}`}
        >
          <div className="relative z-10">
            <div className="mb-3 sm:mb-4 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-white/80">{card.title}</span>
              <div className="rounded-lg bg-white/20 p-1.5 sm:p-2">
                <card.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {formatCurrency(card.amount, currency)}
            </p>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-white/70">{card.subText}</p>
          </div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/5" />
        </motion.div>
      ))}
    </div>
  );
}

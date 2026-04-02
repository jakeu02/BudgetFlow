import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, addDays, addWeeks, addMonths, addYears } from 'date-fns';

export const formatCurrency = (amount, currency = { symbol: '$' }) => {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency.symbol}${formatted}`;
};

export const formatDate = (dateStr) => {
  return format(parseISO(dateStr), 'MMM dd, yyyy');
};

export const formatDateShort = (dateStr) => {
  return format(parseISO(dateStr), 'MMM dd');
};

export const getMonthTransactions = (transactions, date = new Date()) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return transactions.filter((t) => {
    const tDate = parseISO(t.date);
    return isWithinInterval(tDate, { start, end });
  });
};

export const calculateTotals = (transactions) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
};

export const groupByCategory = (transactions) => {
  const groups = {};
  transactions.forEach((t) => {
    if (!groups[t.category]) {
      groups[t.category] = { total: 0, count: 0, transactions: [] };
    }
    groups[t.category].total += t.amount;
    groups[t.category].count += 1;
    groups[t.category].transactions.push(t);
  });
  return groups;
};

export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getNextDate = (currentDate, frequency) => {
  const date = typeof currentDate === 'string' ? parseISO(currentDate) : currentDate;
  switch (frequency) {
    case 'daily': return addDays(date, 1);
    case 'weekly': return addWeeks(date, 1);
    case 'monthly': return addMonths(date, 1);
    case 'yearly': return addYears(date, 1);
    default: return addMonths(date, 1);
  }
};

export function getDaysUntilDue(dueDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
}

export const getSpendingTrend = (currentMonth, previousMonth) => {
  if (previousMonth === 0) return { percent: 0, direction: 'neutral' };
  const percent = ((currentMonth - previousMonth) / previousMonth) * 100;
  return {
    percent: Math.abs(percent).toFixed(1),
    direction: percent > 0 ? 'up' : percent < 0 ? 'down' : 'neutral',
  };
};

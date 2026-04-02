export const CATEGORIES = {
  income: [
    { id: 'salary', name: 'Salary', icon: '💼', color: '#10b981' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: '#06b6d4' },
    { id: 'investments', name: 'Investments', icon: '📈', color: '#8b5cf6' },
    { id: 'gifts', name: 'Gifts', icon: '🎁', color: '#f59e0b' },
    { id: 'other_income', name: 'Other', icon: '💰', color: '#64748b' },
  ],
  expense: [
    { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#ef4444' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#f97316' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899' },
    { id: 'bills', name: 'Bills & Utilities', icon: '📄', color: '#6366f1' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: '#8b5cf6' },
    { id: 'health', name: 'Health', icon: '🏥', color: '#14b8a6' },
    { id: 'education', name: 'Education', icon: '📚', color: '#3b82f6' },
    { id: 'housing', name: 'Housing', icon: '🏠', color: '#a855f7' },
    { id: 'travel', name: 'Travel', icon: '✈️', color: '#06b6d4' },
    { id: 'subscriptions', name: 'Subscriptions', icon: '📱', color: '#f43f5e' },
    { id: 'other_expense', name: 'Other', icon: '📦', color: '#64748b' },
  ],
};

export const ALL_CATEGORIES = [...CATEGORIES.income, ...CATEGORIES.expense];

export const getCategoryById = (id) =>
  ALL_CATEGORIES.find((cat) => cat.id === id) || {
    id: 'unknown',
    name: 'Unknown',
    icon: '❓',
    color: '#94a3b8',
  };

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export const ACCOUNT_TYPES = [
  { id: 'cash', name: 'Cash', icon: '💵', color: '#22c55e' },
  { id: 'bank', name: 'Bank Account', icon: '🏦', color: '#3b82f6' },
  { id: 'credit', name: 'Credit Card', icon: '💳', color: '#ef4444' },
  { id: 'savings', name: 'Savings', icon: '🐖', color: '#f59e0b' },
  { id: 'investment', name: 'Investment', icon: '📈', color: '#8b5cf6' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

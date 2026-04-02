import { generateId } from './helpers';

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const makeDate = (day, monthOffset = 0) => {
  const d = new Date(year, month + monthOffset, day);
  return d.toISOString().split('T')[0];
};

export const sampleTransactions = [
  // Current month
  { id: generateId(), type: 'income', category: 'salary', amount: 5200, description: 'Monthly Salary', date: makeDate(1) },
  { id: generateId(), type: 'expense', category: 'housing', amount: 1400, description: 'Rent Payment', date: makeDate(1) },
  { id: generateId(), type: 'expense', category: 'bills', amount: 120, description: 'Electricity Bill', date: makeDate(3) },
  { id: generateId(), type: 'expense', category: 'food', amount: 85.50, description: 'Grocery Shopping', date: makeDate(4) },
  { id: generateId(), type: 'expense', category: 'transport', amount: 45, description: 'Gas Station', date: makeDate(5) },
  { id: generateId(), type: 'expense', category: 'subscriptions', amount: 15.99, description: 'Netflix', date: makeDate(5) },
  { id: generateId(), type: 'expense', category: 'subscriptions', amount: 10.99, description: 'Spotify', date: makeDate(5) },
  { id: generateId(), type: 'income', category: 'freelance', amount: 800, description: 'Web Design Project', date: makeDate(7) },
  { id: generateId(), type: 'expense', category: 'food', amount: 32.40, description: 'Restaurant Dinner', date: makeDate(8) },
  { id: generateId(), type: 'expense', category: 'shopping', amount: 129.99, description: 'New Headphones', date: makeDate(9) },
  { id: generateId(), type: 'expense', category: 'health', amount: 50, description: 'Gym Membership', date: makeDate(10) },

  // Last month
  { id: generateId(), type: 'income', category: 'salary', amount: 5200, description: 'Monthly Salary', date: makeDate(1, -1) },
  { id: generateId(), type: 'expense', category: 'housing', amount: 1400, description: 'Rent Payment', date: makeDate(1, -1) },
  { id: generateId(), type: 'expense', category: 'bills', amount: 135, description: 'Electricity Bill', date: makeDate(3, -1) },
  { id: generateId(), type: 'expense', category: 'food', amount: 320, description: 'Monthly Groceries', date: makeDate(5, -1) },
  { id: generateId(), type: 'expense', category: 'transport', amount: 90, description: 'Monthly Gas', date: makeDate(8, -1) },
  { id: generateId(), type: 'expense', category: 'entertainment', amount: 60, description: 'Movie Night', date: makeDate(12, -1) },
  { id: generateId(), type: 'income', category: 'freelance', amount: 500, description: 'Logo Design', date: makeDate(15, -1) },
  { id: generateId(), type: 'expense', category: 'shopping', amount: 200, description: 'New Clothes', date: makeDate(18, -1) },
  { id: generateId(), type: 'expense', category: 'education', amount: 29.99, description: 'Online Course', date: makeDate(20, -1) },

  // Two months ago
  { id: generateId(), type: 'income', category: 'salary', amount: 5200, description: 'Monthly Salary', date: makeDate(1, -2) },
  { id: generateId(), type: 'expense', category: 'housing', amount: 1400, description: 'Rent Payment', date: makeDate(1, -2) },
  { id: generateId(), type: 'expense', category: 'food', amount: 280, description: 'Monthly Groceries', date: makeDate(4, -2) },
  { id: generateId(), type: 'expense', category: 'bills', amount: 110, description: 'Electricity Bill', date: makeDate(5, -2) },
  { id: generateId(), type: 'expense', category: 'travel', amount: 450, description: 'Weekend Trip', date: makeDate(14, -2) },
  { id: generateId(), type: 'income', category: 'investments', amount: 150, description: 'Dividend Payment', date: makeDate(20, -2) },
];

export const sampleBudgets = [
  { id: generateId(), category: 'food', limit: 400, period: 'monthly' },
  { id: generateId(), category: 'transport', limit: 150, period: 'monthly' },
  { id: generateId(), category: 'shopping', limit: 200, period: 'monthly' },
  { id: generateId(), category: 'entertainment', limit: 100, period: 'monthly' },
  { id: generateId(), category: 'subscriptions', limit: 50, period: 'monthly' },
  { id: generateId(), category: 'bills', limit: 300, period: 'monthly' },
];

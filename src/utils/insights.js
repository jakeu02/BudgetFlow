import { subMonths } from 'date-fns';
import { getMonthTransactions, calculateTotals, groupByCategory } from './helpers';
import { getCategoryById } from './constants';

/**
 * Generate smart insights from transaction and budget data.
 * Returns max 4 most relevant insights (warnings first, then info).
 *
 * @param {Array} transactions - All transactions
 * @param {Array} budgets - All budgets
 * @returns {Array<{id: string, type: string, icon: string, message: string, severity: 'info'|'warning'|'success'}>}
 */
export const generateInsights = (transactions, budgets) => {
  const now = new Date();
  const currentMonthTx = getMonthTransactions(transactions, now);
  const currentTotals = calculateTotals(currentMonthTx);
  const currentExpenses = currentMonthTx.filter((t) => t.type === 'expense');
  const currentGrouped = groupByCategory(currentExpenses);

  const insights = [];

  // 1. Top spending category
  const categoryEntries = Object.entries(currentGrouped);
  if (categoryEntries.length > 0) {
    const [topCatId, topCatData] = categoryEntries.sort((a, b) => b[1].total - a[1].total)[0];
    const topCat = getCategoryById(topCatId);
    insights.push({
      id: 'top-spending',
      type: 'top_spending',
      icon: topCat.icon,
      message: `${topCat.name} is your biggest expense this month ($${topCatData.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
      severity: 'info',
    });
  }

  // 2. Spending anomaly - compare current month vs 3-month average per category
  const prevMonths = [1, 2, 3].map((i) => {
    const date = subMonths(now, i);
    const tx = getMonthTransactions(transactions, date);
    const expenses = tx.filter((t) => t.type === 'expense');
    return groupByCategory(expenses);
  });

  categoryEntries.forEach(([catId, catData]) => {
    const prevTotals = prevMonths.map((g) => g[catId]?.total || 0);
    const avg = prevTotals.reduce((s, v) => s + v, 0) / 3;
    if (avg > 0) {
      const percentHigher = ((catData.total - avg) / avg) * 100;
      if (percentHigher > 40) {
        const cat = getCategoryById(catId);
        insights.push({
          id: `anomaly-${catId}`,
          type: 'spending_anomaly',
          icon: '\u26a0\ufe0f',
          message: `${cat.name} spending is ${Math.round(percentHigher)}% higher than your 3-month average`,
          severity: 'warning',
        });
      }
    }
  });

  // 3. Budget at risk - budgets where spent >80%
  if (budgets && budgets.length > 0) {
    budgets.forEach((budget) => {
      const spent = currentGrouped[budget.category]?.total || 0;
      const limit = budget.limit;
      if (limit > 0) {
        const pct = (spent / limit) * 100;
        if (pct > 80) {
          const cat = getCategoryById(budget.category);
          const remaining = Math.max(limit - spent, 0);
          insights.push({
            id: `budget-risk-${budget.category}`,
            type: 'budget_at_risk',
            icon: '\ud83d\udd34',
            message: `${cat.name} budget is at ${Math.round(pct)}% - only $${remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} left`,
            severity: 'warning',
          });
        }
      }
    });
  }

  // 4. Income vs Expense trend
  const prevMonthTx = getMonthTransactions(transactions, subMonths(now, 1));
  const prevTotals = calculateTotals(prevMonthTx);

  if (prevTotals.income > 0 && currentTotals.income > 0) {
    const incomeChange = ((currentTotals.income - prevTotals.income) / prevTotals.income) * 100;
    if (Math.abs(incomeChange) >= 5) {
      insights.push({
        id: 'income-trend',
        type: 'income_trend',
        icon: incomeChange > 0 ? '\ud83d\udcc8' : '\ud83d\udcc9',
        message: incomeChange > 0
          ? `Your income increased by ${Math.round(Math.abs(incomeChange))}% this month`
          : `Your income decreased by ${Math.round(Math.abs(incomeChange))}% this month`,
        severity: incomeChange > 0 ? 'success' : 'warning',
      });
    }
  }

  if (prevTotals.expenses > 0 && currentTotals.expenses > 0) {
    const expenseChange = ((currentTotals.expenses - prevTotals.expenses) / prevTotals.expenses) * 100;
    if (Math.abs(expenseChange) >= 5) {
      insights.push({
        id: 'expense-trend',
        type: 'expense_trend',
        icon: expenseChange > 0 ? '\ud83d\udcc9' : '\ud83d\udcc8',
        message: expenseChange > 0
          ? `Expenses are up ${Math.round(Math.abs(expenseChange))}% compared to last month`
          : `Expenses are down ${Math.round(Math.abs(expenseChange))}% compared to last month`,
        severity: expenseChange > 0 ? 'warning' : 'success',
      });
    }
  }

  // 5. Savings rate
  if (currentTotals.income > 0 && currentTotals.income > currentTotals.expenses) {
    const savingsRate = ((currentTotals.income - currentTotals.expenses) / currentTotals.income) * 100;
    insights.push({
      id: 'savings-rate',
      type: 'savings_rate',
      icon: '\ud83d\udcb0',
      message: `You're saving ${Math.round(savingsRate)}% of your income this month - great job!`,
      severity: 'success',
    });
  }

  // 6. Few transactions
  if (currentMonthTx.length > 0 && currentMonthTx.length <= 5) {
    insights.push({
      id: 'low-transactions',
      type: 'low_transactions',
      icon: '\ud83d\udcca',
      message: `You have only ${currentMonthTx.length} transaction${currentMonthTx.length === 1 ? '' : 's'} this month. Keep tracking!`,
      severity: 'info',
    });
  }

  // Sort: warnings first, then success, then info
  const severityOrder = { warning: 0, success: 1, info: 2 };
  insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Return max 4 insights
  return insights.slice(0, 4);
};

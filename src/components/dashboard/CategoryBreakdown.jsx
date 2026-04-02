import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useBudget } from '../../context/BudgetContext';
import { getMonthTransactions, groupByCategory, formatCurrency } from '../../utils/helpers';
import { getCategoryById } from '../../utils/constants';

const CustomTooltip = ({ active, payload, currency }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="rounded-xl border border-surface-200 bg-white px-3 py-2 shadow-lg dark:border-surface-700 dark:bg-surface-800">
      <p className="text-xs sm:text-sm font-semibold text-surface-900 dark:text-white">
        {data.name}: {formatCurrency(data.value, currency)}
      </p>
    </div>
  );
};

export default function CategoryBreakdown() {
  const { state } = useBudget();
  const { transactions, currency } = state;

  const monthTx = getMonthTransactions(transactions);
  const expenses = monthTx.filter((t) => t.type === 'expense');
  const grouped = groupByCategory(expenses);

  const chartData = Object.entries(grouped)
    .map(([catId, data]) => {
      const cat = getCategoryById(catId);
      return { name: cat.name, value: data.total, color: cat.color, icon: cat.icon };
    })
    .sort((a, b) => b.value - a.value);

  const totalExpenses = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900"
    >
      <h3 className="mb-1 text-sm sm:text-base font-semibold text-surface-900 dark:text-white">
        Expense Breakdown
      </h3>
      <p className="mb-4 text-xs sm:text-sm text-surface-400">This month by category</p>

      {chartData.length === 0 ? (
        <div className="flex h-40 sm:h-52 items-center justify-center text-sm text-surface-400">
          No expenses this month
        </div>
      ) : (
        <>
          <div className="mx-auto h-40 w-40 sm:h-52 sm:w-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="90%"
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip currency={currency} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 sm:mt-4 space-y-2">
            {chartData.slice(0, 5).map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-sm sm:text-base">{item.icon}</span>
                  <span className="truncate text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-300">{item.name}</span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs sm:text-sm font-semibold text-surface-900 dark:text-white">
                    {formatCurrency(item.value, currency)}
                  </span>
                  <span className="ml-1.5 text-xs text-surface-400">
                    {((item.value / totalExpenses) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

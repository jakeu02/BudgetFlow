import StatsCards from './StatsCards';
import InsightsWidget from './InsightsWidget';
import SpendingChart from './SpendingChart';
import CategoryBreakdown from './CategoryBreakdown';
import RecentTransactions from './RecentTransactions';

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <StatsCards />

      <InsightsWidget />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpendingChart />
        </div>
        <CategoryBreakdown />
      </div>

      <RecentTransactions />
    </div>
  );
}

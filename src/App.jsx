import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BudgetProvider, useBudget } from './context/BudgetContext';
import WelcomePage from './components/landing/WelcomePage';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import TransactionList from './components/transactions/TransactionList';
import BudgetManager from './components/budgets/BudgetManager';
import Settings from './components/settings/Settings';
import GoalsPage from './components/goals/GoalsPage';
import AccountsPage from './components/accounts/AccountsPage';
import RemindersPage from './components/reminders/RemindersPage';
import ReportsPage from './components/reports/ReportsPage';
import AboutPage from './components/about/AboutPage';
import TermsPage from './components/legal/TermsPage';
import PrivacyPage from './components/legal/PrivacyPage';
import ProfileSetup from './components/onboarding/ProfileSetup';
import OfflineIndicator from './components/common/OfflineIndicator';

function AppContent() {
  const { state, fetchData } = useBudget();
  const { signOut } = useAuth();
  const { activeView, dataLoading, error } = state;

  if (dataLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-surface-400">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error && !state.transactions.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="text-center max-w-sm px-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-100 dark:bg-danger-500/20">
            <span className="text-xl">!</span>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">Connection Error</h2>
          <p className="mb-6 text-sm text-surface-400">{error}</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => fetchData()}
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Retry
            </button>
            <button
              onClick={() => { signOut(); localStorage.clear(); }}
              className="rounded-xl border border-surface-200 px-5 py-2.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <TransactionList />;
      case 'budgets': return <BudgetManager />;
      case 'goals': return <GoalsPage />;
      case 'accounts': return <AccountsPage />;
      case 'reminders': return <RemindersPage />;
      case 'reports': return <ReportsPage />;
      case 'settings': return <Settings />;
      case 'about': return <AboutPage />;
      case 'terms': return <TermsPage />;
      case 'privacy': return <PrivacyPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <OfflineIndicator />
        <Header />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="mb-4 rounded-xl bg-danger-50 px-4 py-3 text-sm text-danger-600 dark:bg-danger-500/10 dark:text-danger-400">
              {error}
            </div>
          )}
          {renderView()}
        </div>
      </main>
    </div>
  );
}

function AuthGate() {
  const { user, profile, loading } = useAuth();
  const [authView, setAuthView] = useState('welcome');
  const [oauthError, setOauthError] = useState('');

  useEffect(() => {
    const err = sessionStorage.getItem('sb_oauth_error');
    if (err) {
      sessionStorage.removeItem('sb_oauth_error');
      setOauthError(err.replace(/\+/g, ' '));
      setAuthView('login');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-surface-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'welcome') {
      return <WelcomePage onNavigate={setAuthView} />;
    }
    if (authView === 'terms' || authView === 'privacy') {
      return (
        <div className="min-h-screen bg-surface-50 px-4 py-8 dark:bg-surface-950">
          <div className="mx-auto max-w-3xl">
            <button
              onClick={() => setAuthView('welcome')}
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-primary-500"
            >
              &larr; Back to Home
            </button>
            {authView === 'terms' ? <TermsPage /> : <PrivacyPage />}
          </div>
        </div>
      );
    }
    return (
      <AuthPage
        defaultMode={authView === 'signup' ? 'signup' : 'login'}
        onBack={(view) => setAuthView(typeof view === 'string' ? view : 'welcome')}
        oauthError={oauthError}
      />
    );
  }

  // Show profile setup for new/incomplete profiles
  if (!profile?.full_name || !profile?.age || !profile?.occupation) {
    return <ProfileSetup />;
  }

  return (
    <BudgetProvider>
      <AppContent />
    </BudgetProvider>
  );
}

// Apply dark mode early from localStorage before any component renders
function applyInitialDarkMode() {
  try {
    const saved = localStorage.getItem('budgetflow_ui');
    if (saved) {
      const { darkMode } = JSON.parse(saved);
      document.documentElement.classList.toggle('dark', darkMode);
    }
  } catch {}
}
applyInitialDarkMode();

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

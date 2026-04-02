import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { CURRENCIES } from '../utils/constants';
import { getNextDate } from '../utils/helpers';
import useOnlineStatus from '../hooks/useOnlineStatus';
import { addToQueue, getQueue, clearQueue } from '../utils/offlineQueue';

const BudgetContext = createContext();

const UI_STORAGE_KEY = 'budgetflow_ui';

const loadUIPrefs = () => {
  try {
    const saved = localStorage.getItem(UI_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load UI preferences:', e);
  }
  return null;
};

const defaultUIPrefs = {
  currency: CURRENCIES[0],
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  sidebarOpen: true,
  activeView: 'dashboard',
};

const uiPrefs = loadUIPrefs() || defaultUIPrefs;

const initialState = {
  transactions: [],
  budgets: [],
  goals: [],
  accounts: [],
  recurringTransactions: [],
  reminders: [],
  budgetShares: [],
  ...uiPrefs,
  dataLoading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    // --- Data loading from Supabase ---
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    case 'SET_DATA_LOADING':
      return { ...state, dataLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };

    // --- Optimistic transaction mutations ---
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [
          { ...action.payload, id: action.payload.id || `temp-${Date.now()}` },
          ...state.transactions,
        ],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    // --- Optimistic budget mutations ---
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [
          ...state.budgets,
          { ...action.payload, id: action.payload.id || `temp-${Date.now()}` },
        ],
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.id !== action.payload),
      };
    case 'EDIT_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload } : b
        ),
      };

    // --- Recurring transaction mutations ---
    case 'SET_RECURRING':
      return { ...state, recurringTransactions: action.payload };
    case 'ADD_RECURRING':
      return {
        ...state,
        recurringTransactions: [
          ...state.recurringTransactions,
          { ...action.payload, id: action.payload.id || `temp-${Date.now()}` },
        ],
      };
    case 'DELETE_RECURRING':
      return {
        ...state,
        recurringTransactions: state.recurringTransactions.filter((r) => r.id !== action.payload),
      };
    case 'TOGGLE_RECURRING':
      return {
        ...state,
        recurringTransactions: state.recurringTransactions.map((r) =>
          r.id === action.payload ? { ...r, active: !r.active } : r
        ),
      };

    // --- Optimistic goal mutations ---
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, { ...action.payload, id: action.payload.id || `temp-${Date.now()}` }],
      };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter((g) => g.id !== action.payload) };
    case 'EDIT_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload } : g
        ),
      };
    case 'UPDATE_GOAL_AMOUNT':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id
            ? { ...g, current_amount: Math.max(0, g.current_amount + action.payload.amount) }
            : g
        ),
      };

    // --- Optimistic account mutations ---
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'ADD_ACCOUNT':
      return {
        ...state,
        accounts: [...state.accounts, { ...action.payload, id: action.payload.id || `temp-${Date.now()}` }],
      };
    case 'DELETE_ACCOUNT':
      return { ...state, accounts: state.accounts.filter((a) => a.id !== action.payload) };
    case 'EDIT_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        ),
      };
    case 'UPDATE_ACCOUNT_BALANCE':
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.id === action.payload.id
            ? { ...a, balance: a.balance + action.payload.amount }
            : a
        ),
      };

    // --- Optimistic reminder mutations ---
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [
          ...state.reminders,
          { ...action.payload, id: action.payload.id || `temp-${Date.now()}` },
        ],
      };
    case 'DELETE_REMINDER':
      return { ...state, reminders: state.reminders.filter((r) => r.id !== action.payload) };
    case 'EDIT_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };
    case 'MARK_REMINDER_PAID': {
      return {
        ...state,
        reminders: state.reminders.map((r) => {
          if (r.id !== action.payload) return r;
          if (r.frequency === 'once') {
            return { ...r, is_paid: true };
          }
          const nextDue = getNextDate(r.due_date, r.frequency);
          return { ...r, due_date: nextDue.toISOString().split('T')[0], is_paid: false };
        }),
      };
    }

    // --- Budget share mutations ---
    case 'SET_BUDGET_SHARES':
      return { ...state, budgetShares: action.payload };
    case 'ADD_BUDGET_SHARE':
      return {
        ...state,
        budgetShares: [
          ...state.budgetShares,
          { ...action.payload, id: action.payload.id || `temp-${Date.now()}` },
        ],
      };
    case 'DELETE_BUDGET_SHARE':
      return {
        ...state,
        budgetShares: state.budgetShares.filter((s) => s.id !== action.payload),
      };

    // --- UI preferences ---
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };

    case 'CLEAR_ALL_DATA':
      return { ...state, transactions: [], budgets: [], goals: [], accounts: [] };

    default:
      return state;
  }
};

// Action types that are UI-only and never need Supabase sync
const UI_ONLY_ACTIONS = new Set([
  'SET_CURRENCY', 'TOGGLE_DARK_MODE', 'TOGGLE_SIDEBAR', 'SET_VIEW',
  'SET_TRANSACTIONS', 'SET_BUDGETS', 'SET_GOALS', 'SET_RECURRING',
  'SET_ACCOUNTS', 'SET_REMINDERS', 'SET_BUDGET_SHARES',
  'SET_DATA_LOADING', 'SET_ERROR', 'LOAD_UI_PREFS',
]);

export const BudgetProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, baseDispatch] = useReducer(reducer, initialState);
  const isOnline = useOnlineStatus();

  const userId = user?.id;

  // Use a ref to track the latest state for syncActionToSupabase without
  // causing the dispatch callback to be recreated on every state change.
  const stateRef = useRef(state);
  stateRef.current = state;

  // Fetch data from Supabase when user logs in
  const fetchData = useCallback(async () => {
    if (!userId) return;

    baseDispatch({ type: 'SET_DATA_LOADING', payload: true });
    baseDispatch({ type: 'SET_ERROR', payload: null });

    // Helper: timeout a promise to prevent infinite hanging
    const withTimeout = (promise, ms = 30000) =>
      Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms)),
      ]);

    try {
      // Core tables (must succeed)
      const [txResult, budgetResult] = await withTimeout(Promise.all([
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('budgets').select('*'),
      ]));

      if (txResult.error) throw txResult.error;
      if (budgetResult.error) throw budgetResult.error;

      baseDispatch({ type: 'SET_TRANSACTIONS', payload: txResult.data });
      baseDispatch({ type: 'SET_BUDGETS', payload: budgetResult.data });

      // Optional tables (fail gracefully if not yet created)
      const [goalsResult, recurringResult, accountsResult, remindersResult, sharesResult] = await withTimeout(Promise.all([
        supabase.from('goals').select('*').then(r => r).catch(() => ({ data: [] })),
        supabase.from('recurring_transactions').select('*').then(r => r).catch(() => ({ data: [] })),
        supabase.from('accounts').select('*').eq('user_id', userId).order('created_at').then(r => r).catch(() => ({ data: [] })),
        supabase.from('reminders').select('*').eq('user_id', userId).order('due_date').then(r => r).catch(() => ({ data: [] })),
        supabase.from('budget_shares').select('*').eq('shared_by', userId).then(r => r).catch(() => ({ data: [] })),
      ]));

      baseDispatch({ type: 'SET_GOALS', payload: goalsResult.data || [] });
      baseDispatch({ type: 'SET_RECURRING', payload: recurringResult.data || [] });
      baseDispatch({ type: 'SET_ACCOUNTS', payload: accountsResult.data || [] });
      baseDispatch({ type: 'SET_REMINDERS', payload: remindersResult.data || [] });
      baseDispatch({ type: 'SET_BUDGET_SHARES', payload: sharesResult.data || [] });

      // Process recurring transactions that are due
      const today = new Date().toISOString().split('T')[0];
      const dueItems = (recurringResult.data || []).filter(
        (r) => r.active && r.next_date <= today
      );

      for (const item of dueItems) {
        await supabase.from('transactions').insert({
          type: item.type,
          category: item.category,
          amount: item.amount,
          description: item.description,
          date: item.next_date,
          tags: [],
          user_id: userId,
        });

        const nextDate = getNextDate(item.next_date, item.frequency);
        await supabase
          .from('recurring_transactions')
          .update({ next_date: nextDate.toISOString().split('T')[0] })
          .eq('id', item.id);
      }

      if (dueItems.length > 0) {
        const [freshTx, freshRecurring] = await Promise.all([
          supabase.from('transactions').select('*').order('date', { ascending: false }),
          supabase.from('recurring_transactions').select('*'),
        ]);
        if (freshTx.data) baseDispatch({ type: 'SET_TRANSACTIONS', payload: freshTx.data });
        if (freshRecurring.data) baseDispatch({ type: 'SET_RECURRING', payload: freshRecurring.data });
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      baseDispatch({ type: 'SET_ERROR', payload: err.message });
    } finally {
      baseDispatch({ type: 'SET_DATA_LOADING', payload: false });
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    } else {
      baseDispatch({ type: 'SET_TRANSACTIONS', payload: [] });
      baseDispatch({ type: 'SET_BUDGETS', payload: [] });
      baseDispatch({ type: 'SET_GOALS', payload: [] });
      baseDispatch({ type: 'SET_ACCOUNTS', payload: [] });
      baseDispatch({ type: 'SET_DATA_LOADING', payload: false });
    }
  }, [userId, fetchData]);

  // Persist UI preferences to localStorage
  useEffect(() => {
    const prefs = {
      currency: state.currency,
      darkMode: state.darkMode,
      sidebarOpen: state.sidebarOpen,
      activeView: state.activeView,
    };
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(prefs));
  }, [state.currency, state.darkMode, state.sidebarOpen, state.activeView]);

  // Dark mode class toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  // Extracted Supabase sync logic -- used both by the dispatch wrapper and replayQueue
  const syncActionToSupabase = useCallback(
    async (action) => {
      if (!user) return;
      const currentState = stateRef.current;

      switch (action.type) {
        case 'ADD_TRANSACTION': {
          const { error } = await supabase
            .from('transactions')
            .insert({
              type: action.payload.type,
              category: action.payload.category,
              amount: action.payload.amount,
              description: action.payload.description,
              date: action.payload.date,
              tags: action.payload.tags || [],
              user_id: user.id,
            });
          if (error) throw error;
          if (action.payload.account_id) {
            const balanceChange = action.payload.type === 'expense'
              ? -action.payload.amount
              : action.payload.amount;
            const acct = currentState.accounts.find((a) => a.id === action.payload.account_id);
            if (acct) {
              const newBal = acct.balance + balanceChange;
              await supabase
                .from('accounts')
                .update({ balance: newBal })
                .eq('id', action.payload.account_id);
              baseDispatch({
                type: 'UPDATE_ACCOUNT_BALANCE',
                payload: { id: action.payload.account_id, amount: balanceChange },
              });
            }
          }
          break;
        }

        case 'DELETE_TRANSACTION': {
          const deletedTx = currentState.transactions.find((t) => t.id === action.payload);
          const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', action.payload);
          if (error) throw error;
          if (deletedTx && deletedTx.account_id) {
            const reverseChange = deletedTx.type === 'expense'
              ? deletedTx.amount
              : -deletedTx.amount;
            const acct = currentState.accounts.find((a) => a.id === deletedTx.account_id);
            if (acct) {
              const newBal = acct.balance + reverseChange;
              await supabase
                .from('accounts')
                .update({ balance: newBal })
                .eq('id', deletedTx.account_id);
              baseDispatch({
                type: 'UPDATE_ACCOUNT_BALANCE',
                payload: { id: deletedTx.account_id, amount: reverseChange },
              });
            }
          }
          break;
        }

        case 'EDIT_TRANSACTION': {
          const { id, ...updates } = action.payload;
          const { error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id);
          if (error) throw error;
          break;
        }

        case 'ADD_BUDGET': {
          const { error } = await supabase
            .from('budgets')
            .insert({
              category: action.payload.category,
              limit: action.payload.limit,
              period: action.payload.period,
              user_id: user.id,
            });
          if (error) throw error;
          break;
        }

        case 'DELETE_BUDGET': {
          const { error } = await supabase
            .from('budgets')
            .delete()
            .eq('id', action.payload);
          if (error) throw error;
          break;
        }

        case 'EDIT_BUDGET': {
          const { id, ...updates } = action.payload;
          const { error } = await supabase
            .from('budgets')
            .update(updates)
            .eq('id', id);
          if (error) throw error;
          break;
        }

        case 'ADD_RECURRING': {
          const { error } = await supabase
            .from('recurring_transactions')
            .insert({
              type: action.payload.type,
              category: action.payload.category,
              amount: action.payload.amount,
              description: action.payload.description,
              frequency: action.payload.frequency,
              next_date: action.payload.next_date,
              active: action.payload.active !== undefined ? action.payload.active : true,
              user_id: user.id,
            });
          if (error) throw error;
          break;
        }

        case 'DELETE_RECURRING': {
          const { error } = await supabase
            .from('recurring_transactions')
            .delete()
            .eq('id', action.payload);
          if (error) throw error;
          break;
        }

        case 'TOGGLE_RECURRING': {
          const recurringItem = currentState.recurringTransactions.find((r) => r.id === action.payload);
          if (recurringItem) {
            const { error } = await supabase
              .from('recurring_transactions')
              .update({ active: !recurringItem.active })
              .eq('id', action.payload);
            if (error) throw error;
          }
          break;
        }

        case 'ADD_GOAL': {
          const { error } = await supabase
            .from('goals')
            .insert({
              name: action.payload.name,
              target_amount: action.payload.target_amount,
              current_amount: action.payload.current_amount || 0,
              deadline: action.payload.deadline || null,
              icon: action.payload.icon,
              color: action.payload.color,
              user_id: user.id,
            });
          if (error) throw error;
          break;
        }

        case 'DELETE_GOAL': {
          const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', action.payload);
          if (error) throw error;
          break;
        }

        case 'EDIT_GOAL': {
          const { id, ...updates } = action.payload;
          const { error } = await supabase
            .from('goals')
            .update(updates)
            .eq('id', id);
          if (error) throw error;
          break;
        }

        case 'UPDATE_GOAL_AMOUNT': {
          const goal = currentState.goals.find((g) => g.id === action.payload.id);
          if (goal) {
            const newAmount = Math.max(0, goal.current_amount + action.payload.amount);
            const { error } = await supabase
              .from('goals')
              .update({ current_amount: newAmount })
              .eq('id', action.payload.id);
            if (error) throw error;
          }
          break;
        }

        case 'ADD_REMINDER': {
          const { error } = await supabase
            .from('reminders')
            .insert({
              name: action.payload.name,
              amount: action.payload.amount,
              due_date: action.payload.due_date,
              frequency: action.payload.frequency,
              category: action.payload.category || null,
              notify_before_days: action.payload.notify_before_days || 3,
              is_paid: action.payload.is_paid || false,
              user_id: user.id,
            });
          if (error) throw error;
          break;
        }

        case 'DELETE_REMINDER': {
          const { error } = await supabase
            .from('reminders')
            .delete()
            .eq('id', action.payload);
          if (error) throw error;
          break;
        }

        case 'EDIT_REMINDER': {
          const { id, ...updates } = action.payload;
          const { error } = await supabase
            .from('reminders')
            .update(updates)
            .eq('id', id);
          if (error) throw error;
          break;
        }

        case 'MARK_REMINDER_PAID': {
          const reminder = currentState.reminders.find((r) => r.id === action.payload);
          if (reminder) {
            if (reminder.frequency === 'once') {
              const { error } = await supabase
                .from('reminders')
                .update({ is_paid: true })
                .eq('id', action.payload);
              if (error) throw error;
            } else {
              const nextDue = getNextDate(reminder.due_date, reminder.frequency);
              const { error } = await supabase
                .from('reminders')
                .update({ due_date: nextDue.toISOString().split('T')[0], is_paid: false })
                .eq('id', action.payload);
              if (error) throw error;
            }
          }
          break;
        }

        case 'ADD_ACCOUNT': {
          const { error } = await supabase
            .from('accounts')
            .insert({
              name: action.payload.name,
              type: action.payload.type,
              balance: action.payload.balance || 0,
              icon: action.payload.icon,
              color: action.payload.color,
              user_id: user.id,
            });
          if (error) throw error;
          break;
        }

        case 'DELETE_ACCOUNT': {
          const { error } = await supabase
            .from('accounts')
            .delete()
            .eq('id', action.payload);
          if (error) throw error;
          break;
        }

        case 'EDIT_ACCOUNT': {
          const { id, ...updates } = action.payload;
          const { error } = await supabase
            .from('accounts')
            .update(updates)
            .eq('id', id);
          if (error) throw error;
          break;
        }

        case 'UPDATE_ACCOUNT_BALANCE': {
          const account = currentState.accounts.find((a) => a.id === action.payload.id);
          if (account) {
            const newBalance = account.balance + action.payload.amount;
            const { error } = await supabase
              .from('accounts')
              .update({ balance: newBalance })
              .eq('id', action.payload.id);
            if (error) throw error;
          }
          break;
        }

        case 'ADD_BUDGET_SHARE': {
          const { error } = await supabase
            .from('budget_shares')
            .insert({
              budget_id: action.payload.budget_id,
              shared_by: user.id,
              permission: 'view',
            });
          if (error) throw error;
          // Fetch only the newly created share to get the server-generated share_token
          const { data: newShare } = await supabase
            .from('budget_shares')
            .select('*')
            .eq('budget_id', action.payload.budget_id)
            .eq('shared_by', user.id)
            .single();
          if (newShare) {
            baseDispatch({ type: 'SET_BUDGET_SHARES', payload: [...stateRef.current.budgetShares.filter(s => !String(s.id).startsWith('temp-')), newShare] });
          }
          break;
        }

        case 'DELETE_BUDGET_SHARE': {
          const { error } = await supabase
            .from('budget_shares')
            .delete()
            .eq('id', action.payload);
          if (error) throw error;
          break;
        }

        case 'CLEAR_ALL_DATA': {
          await Promise.all([
            supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            supabase.from('budgets').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            supabase.from('goals').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            supabase.from('accounts').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
          ]);
          break;
        }

        default:
          break;
      }
    },
    [user]
  );

  // Replay queued offline actions when coming back online
  const replayQueue = useCallback(async () => {
    const queue = getQueue();
    if (queue.length === 0) return;

    for (const action of queue) {
      try {
        await syncActionToSupabase(action);
      } catch (err) {
        console.error('Failed to replay queued action:', err);
      }
    }
    clearQueue();
    // Refetch data to ensure consistency after replaying
    fetchData();
  }, [syncActionToSupabase, fetchData]);

  // Watch for online status change to replay queue
  useEffect(() => {
    if (isOnline && user) {
      replayQueue();
    }
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  // Enhanced dispatch that syncs to Supabase (or queues when offline)
  const dispatch = useCallback(
    async (action) => {
      // Optimistic: update local state immediately
      baseDispatch(action);

      if (!user) return;

      // Skip Supabase sync for UI-only actions
      if (UI_ONLY_ACTIONS.has(action.type)) return;

      if (isOnline) {
        try {
          await syncActionToSupabase(action);
        } catch (err) {
          console.error(`Supabase sync failed for ${action.type}:`, err);
          baseDispatch({ type: 'SET_ERROR', payload: err.message });
          // Refetch to restore consistency
          fetchData();
        }
      } else {
        // Offline: queue the action for later replay
        addToQueue(action);
      }
    },
    [user, isOnline, syncActionToSupabase, fetchData]
  );

  return (
    <BudgetContext.Provider value={{ state, dispatch, fetchData }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within BudgetProvider');
  return context;
};

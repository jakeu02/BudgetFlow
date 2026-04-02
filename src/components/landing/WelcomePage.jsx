import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineViewGrid,
  HiOutlineChartPie,
  HiOutlineFlag,
  HiOutlineCreditCard,
  HiOutlineBell,
  HiOutlineChartBar,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineCheck,
  HiOutlineStar,
  HiOutlineArrowRight,
  HiOutlineDeviceMobile,
} from 'react-icons/hi';

const features = [
  { icon: HiOutlineViewGrid, title: 'Smart Dashboard', desc: 'Real-time overview of your income, expenses, and balances with beautiful charts and insights.' },
  { icon: HiOutlineChartPie, title: 'Budget Tracking', desc: 'Set spending limits by category and period. Get alerts when approaching your budget caps.' },
  { icon: HiOutlineFlag, title: 'Savings Goals', desc: 'Define goals, track progress, and add funds as you go. Visual progress bars keep you motivated.' },
  { icon: HiOutlineCreditCard, title: 'Multi-Account', desc: 'Manage cash, bank accounts, credit cards, savings, and investments all in one place.' },
  { icon: HiOutlineBell, title: 'Bill Reminders', desc: 'Never miss a payment. Set recurring reminders with smart notifications before due dates.' },
  { icon: HiOutlineChartBar, title: 'Detailed Reports', desc: 'Category breakdowns, trend analysis, and period comparisons to understand spending patterns.' },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '$2M+', label: 'Budgets Tracked' },
  { value: '50K+', label: 'Goals Achieved' },
  { value: '99.9%', label: 'Uptime' },
];

const steps = [
  { num: '1', title: 'Sign Up Free', desc: 'Create your account in under 30 seconds. No credit card required.' },
  { num: '2', title: 'Connect & Track', desc: 'Add your accounts and start logging income and expenses effortlessly.' },
  { num: '3', title: 'Reach Your Goals', desc: 'Watch your savings grow with smart budgets, reminders, and insights.' },
];

const testimonials = [
  { quote: 'BudgetFlow helped me save $3,000 in just 3 months. The visual budget tracking keeps me accountable every day.', name: 'Sarah M.', role: 'Freelancer' },
  { quote: 'I finally understand where my money goes. The category breakdowns and trend reports are a game-changer.', name: 'James T.', role: 'Software Engineer' },
  { quote: 'Setting savings goals and watching the progress bar fill up is so satisfying. Best budgeting app I\'ve used.', name: 'Maria L.', role: 'Student' },
];

const freePlanFeatures = ['Unlimited transactions', 'Budget tracking', 'Savings goals', 'Bill reminders', 'Category reports', 'Multi-account support'];
const proPlanFeatures = ['Everything in Free, plus:', 'AI-powered insights', 'CSV/PDF export', 'Shared budgets', 'Priority support'];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
};

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function WelcomePage({ onNavigate }) {
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      const saved = JSON.parse(localStorage.getItem('budgetflow_ui') || '{}');
      saved.darkMode = next;
      localStorage.setItem('budgetflow_ui', JSON.stringify(saved));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-surface-200 bg-white/80 backdrop-blur-xl dark:border-surface-800 dark:bg-surface-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}bf-transparent.png`} alt="BudgetFlow" className="h-9 w-9 rounded-xl" />
            <div>
              <span className="text-base font-bold text-surface-900 dark:text-white">BudgetFlow</span>
              <span className="ml-1.5 hidden text-xs text-surface-400 sm:inline">Smart Tracker</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleDark} className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800">
              {darkMode ? <HiOutlineSun className="h-5 w-5" /> : <HiOutlineMoon className="h-5 w-5" />}
            </button>
            <button onClick={() => onNavigate('login')} className="text-sm font-medium text-surface-600 transition-colors hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400">
              Sign In
            </button>
            <button onClick={() => onNavigate('signup')} className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl sm:px-5 sm:py-2.5">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="mb-4 inline-block rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300">
              Trusted by 10,000+ users
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-4 text-4xl font-extrabold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl dark:text-white"
          >
            Take Control of{' '}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Your Finances</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-5 max-w-2xl text-base text-surface-500 sm:text-lg dark:text-surface-400"
          >
            Track spending, set budgets, achieve savings goals, and get smart insights — all in one beautiful dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <button onClick={() => onNavigate('signup')} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl">
              Start Free <HiOutlineArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => scrollTo('features')} className="rounded-xl border border-surface-300 px-7 py-3.5 text-sm font-semibold text-surface-700 transition-all hover:bg-surface-100 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800">
              See How It Works
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-surface-400 sm:text-sm"
          >
            <span className="flex items-center gap-1.5"><HiOutlineShieldCheck className="h-4 w-4 text-success-500" /> Bank-grade security</span>
            <span className="flex items-center gap-1.5"><HiOutlineLightningBolt className="h-4 w-4 text-warning-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><HiOutlineCheck className="h-4 w-4 text-primary-500" /> Free forever plan</span>
          </motion.div>

          {/* Download App Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <p className="flex items-center gap-1.5 text-xs font-medium text-surface-400 sm:text-sm">
              <HiOutlineDeviceMobile className="h-4 w-4" /> Also available on mobile
            </p>
            <a
              href={`${import.meta.env.BASE_URL}BudgeFlow.apk`}
              download
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl"
            >
              <HiOutlineDeviceMobile className="h-5 w-5" />
              Download App
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-surface-900 sm:text-3xl dark:text-white">Everything You Need to Manage Money</h2>
            <p className="mx-auto mt-3 max-w-2xl text-surface-500 dark:text-surface-400">Powerful features designed to help you take control of your finances.</p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg sm:p-6 dark:border-surface-800 dark:bg-surface-900"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary-50 p-3 dark:bg-primary-500/10">
                  <f.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-surface-900 dark:text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-surface-500 dark:text-surface-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-br from-primary-50 to-surface-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:from-primary-500/5 dark:to-surface-950">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">{s.value}</div>
                <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-surface-900 sm:text-3xl dark:text-white">How It Works</h2>
            <p className="mt-3 text-surface-500 dark:text-surface-400">Get started in three simple steps.</p>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-700 text-lg font-bold text-white shadow-lg shadow-primary-500/30">
                  {s.num}
                </div>
                <h3 className="mb-2 text-base font-semibold text-surface-900 dark:text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-surface-500 dark:text-surface-400">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-100/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:bg-surface-900/50">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-surface-900 sm:text-3xl dark:text-white">Loved by Thousands</h2>
            <p className="mt-3 text-surface-500 dark:text-surface-400">See what our users have to say.</p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-2xl border border-surface-200 bg-white p-5 sm:p-6 dark:border-surface-800 dark:bg-surface-900"
              >
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <HiOutlineStar key={j} className="h-4 w-4 fill-warning-400 text-warning-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-surface-600 dark:text-surface-300">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-surface-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-surface-900 sm:text-3xl dark:text-white">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-surface-500 dark:text-surface-400">Start free and upgrade when you're ready.</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Free Plan */}
            <motion.div {...fadeUp} className="rounded-2xl border border-surface-200 bg-white p-6 sm:p-8 dark:border-surface-800 dark:bg-surface-900">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">Free</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-surface-900 dark:text-white">$0</span>
                <span className="text-sm text-surface-400">/month</span>
              </div>
              <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">Everything you need to get started.</p>
              <ul className="mt-6 space-y-3">
                {freePlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                    <HiOutlineCheck className="h-4 w-4 shrink-0 text-success-500" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate('signup')}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl"
              >
                Get Started Free
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div {...fadeUp} className="relative rounded-2xl border-2 border-primary-500 bg-white p-6 sm:p-8 dark:bg-surface-900">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-1 text-xs font-bold text-white">
                COMING SOON
              </span>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">Pro</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-surface-900 dark:text-white">$4.99</span>
                <span className="text-sm text-surface-400">/month</span>
              </div>
              <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">For power users who want more.</p>
              <ul className="mt-6 space-y-3">
                {proPlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                    <HiOutlineCheck className="h-4 w-4 shrink-0 text-primary-500" /> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="mt-8 w-full rounded-xl border border-surface-300 py-3 text-sm font-semibold text-surface-400 dark:border-surface-700"
              >
                Coming Soon
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to Take Control of Your Money?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-primary-100 sm:text-base">
              Join thousands of users who are already managing their finances smarter.
            </p>
            <button
              onClick={() => onNavigate('signup')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:bg-primary-50"
            >
              Create Free Account <HiOutlineArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* About Creator */}
      <section id="about" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-surface-900 sm:text-3xl dark:text-white">Meet the Creator</h2>
            <p className="mt-3 text-surface-500 dark:text-surface-400">The person behind BudgetFlow.</p>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="rounded-2xl border border-surface-200 bg-white p-6 text-center sm:p-8 dark:border-surface-800 dark:bg-surface-900"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-2xl font-bold text-white shadow-lg shadow-primary-500/30">
              JP
            </div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-white">Jake Paragas</h3>
            <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400">Creator & Developer</p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-surface-500 dark:text-surface-400">
              Passionate developer who built BudgetFlow to help people take control of their finances
              with a simple, beautiful, and free tool.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-surface-50 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 dark:border-surface-800 dark:bg-surface-900">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <img src={`${import.meta.env.BASE_URL}bf-transparent.png`} alt="BudgetFlow" className="h-8 w-8 rounded-lg" />
                <span className="text-base font-bold text-surface-900 dark:text-white">BudgetFlow</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                Smart budget tracking for everyone. Take control of your finances today.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-surface-900 dark:text-white">Product</h4>
              <ul className="space-y-2 text-sm text-surface-500 dark:text-surface-400">
                <li><button onClick={() => scrollTo('features')} className="hover:text-primary-600 dark:hover:text-primary-400">Features</button></li>
                <li><button onClick={() => scrollTo('pricing')} className="hover:text-primary-600 dark:hover:text-primary-400">Pricing</button></li>
                <li><button onClick={() => scrollTo('how-it-works')} className="hover:text-primary-600 dark:hover:text-primary-400">How It Works</button></li>
                <li><button onClick={() => scrollTo('about')} className="hover:text-primary-600 dark:hover:text-primary-400">About</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-surface-900 dark:text-white">Support</h4>
              <ul className="space-y-2 text-sm text-surface-500 dark:text-surface-400">
                <li><span className="cursor-default">Help Center</span></li>
                <li><span className="cursor-default">Contact</span></li>
                <li><button onClick={() => onNavigate('privacy')} className="hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</button></li>
                <li><button onClick={() => onNavigate('terms')} className="hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-surface-900 dark:text-white">Get Started</h4>
              <button
                onClick={() => onNavigate('signup')}
                className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl"
              >
                Create Free Account
              </button>
            </div>
          </div>
          <div className="mt-10 border-t border-surface-200 pt-6 text-center text-xs text-surface-400 dark:border-surface-800">
            <p>&copy; {new Date().getFullYear()} BudgetFlow by Jake Paragas. All rights reserved.</p>
            <p className="mt-1">
              <button onClick={() => onNavigate('terms')} className="underline hover:text-primary-500">Terms of Service</button>
              {' · '}
              <button onClick={() => onNavigate('privacy')} className="underline hover:text-primary-500">Privacy Policy</button>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

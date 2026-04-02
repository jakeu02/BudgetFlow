import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-surface-900 sm:text-3xl dark:text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-surface-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6 rounded-2xl border border-surface-200 bg-white p-6 sm:p-8 dark:border-surface-800 dark:bg-surface-900"
      >
        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">1. Information We Collect</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            When you use BudgetFlow, we collect the following information:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-surface-600 dark:text-surface-300">
            <li><strong>Account Information:</strong> Email address, full name, age (optional), and occupation (optional)</li>
            <li><strong>Financial Data:</strong> Transaction records, budget settings, savings goals, and account balances that you enter</li>
            <li><strong>Usage Data:</strong> App preferences such as dark mode, currency, and active view settings</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">2. How We Use Your Information</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">Your data is used to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-surface-600 dark:text-surface-300">
            <li>Provide and maintain the BudgetFlow service</li>
            <li>Display your financial data and generate insights</li>
            <li>Authenticate your identity and secure your account</li>
            <li>Save your preferences and settings</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">3. Data Storage & Security</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            Your data is stored securely using Supabase, which provides bank-grade encryption and security.
            We implement Row Level Security (RLS) to ensure that your data is only accessible to you.
            Your password is hashed and never stored in plain text.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">4. Data Sharing</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            We do <strong>not</strong> sell, trade, or share your personal or financial data with third parties.
            Your data stays between you and BudgetFlow. The only exception is if required by law or to
            protect the rights and safety of our users.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">5. Cookies & Local Storage</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            BudgetFlow uses browser local storage to save your UI preferences (dark mode, sidebar state, currency)
            and authentication session tokens. We do not use tracking cookies or third-party analytics.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">6. Your Rights</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">You have the right to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-surface-600 dark:text-surface-300">
            <li>Access your personal data at any time through the app</li>
            <li>Update or correct your profile information</li>
            <li>Delete your account and all associated data</li>
            <li>Export your financial data</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">7. Account Security</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            BudgetFlow includes an automatic logout feature after 30 minutes of inactivity to protect your account.
            We recommend using a strong, unique password for your account.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">8. Children's Privacy</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            BudgetFlow is not intended for users under the age of 13. We do not knowingly collect personal
            information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">9. Changes to This Policy</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            We may update this Privacy Policy from time to time. Any changes will be reflected on this page
            with an updated date. Continued use of the Service constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">10. Contact</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            If you have any questions about this Privacy Policy or your data, please reach out to the creator,
            Jake Paragas, through the app's About page.
          </p>
        </section>

        <div className="border-t border-surface-200 pt-4 dark:border-surface-700">
          <p className="text-xs text-surface-400">
            &copy; {new Date().getFullYear()} BudgetFlow by Jake Paragas. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

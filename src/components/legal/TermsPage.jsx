import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-surface-900 sm:text-3xl dark:text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-surface-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6 rounded-2xl border border-surface-200 bg-white p-6 sm:p-8 dark:border-surface-800 dark:bg-surface-900"
      >
        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            By accessing or using BudgetFlow ("the Service"), you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use the Service. BudgetFlow is created and maintained
            by Jake Paragas.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">2. Description of Service</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            BudgetFlow is a personal finance management application that allows users to track income, expenses,
            set budgets, create savings goals, and manage financial accounts. The Service is provided "as is"
            without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">3. User Accounts</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            You are responsible for maintaining the confidentiality of your account credentials. You agree to
            provide accurate information during registration and to keep your account information up to date.
            You are solely responsible for all activity that occurs under your account.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">4. Intellectual Property</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            All content, features, and functionality of BudgetFlow — including but not limited to the design,
            code, graphics, logos, and trademarks — are the exclusive property of Jake Paragas and are protected
            by copyright, trademark, and other intellectual property laws. Unauthorized copying, modification,
            distribution, or reproduction of any part of this application is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">5. Prohibited Use</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">You agree not to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-surface-600 dark:text-surface-300">
            <li>Copy, clone, or reverse-engineer any part of the application</li>
            <li>Redistribute, sell, or sublicense the application or its source code</li>
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to other user accounts or systems</li>
            <li>Upload malicious code or interfere with the Service's functionality</li>
            <li>Misrepresent your identity or impersonate others</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">6. Data & Privacy</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            Your use of the Service is also governed by our Privacy Policy. By using BudgetFlow, you consent
            to the collection and use of your data as described in the Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">7. Limitation of Liability</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            BudgetFlow and its creator shall not be liable for any indirect, incidental, special, or consequential
            damages arising from your use of the Service. The Service is not a substitute for professional
            financial advice.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">8. Termination</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            We reserve the right to suspend or terminate your account at any time for violations of these Terms
            or for any other reason at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">9. Changes to Terms</h2>
          <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
            We may update these Terms from time to time. Continued use of the Service after changes constitutes
            acceptance of the updated Terms.
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

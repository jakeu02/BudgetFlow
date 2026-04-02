import { motion } from 'framer-motion';
import {
  HiOutlineCode,
  HiOutlineLightBulb,
  HiOutlineHeart,
  HiOutlineGlobe,
} from 'react-icons/hi';

const skills = ['React', 'JavaScript', 'Tailwind CSS', 'Supabase', 'Node.js', 'UI/UX Design'];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-surface-900 sm:text-3xl dark:text-white">About BudgetFlow</h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">Meet the creator behind the app.</p>
      </motion.div>

      {/* Creator Card */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8 dark:border-surface-800 dark:bg-surface-900"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-3xl font-bold text-white shadow-lg shadow-primary-500/30 sm:h-28 sm:w-28">
            JP
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">Jake Paragas</h2>
            <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400">Creator & Developer</p>
            <p className="mt-3 leading-relaxed text-surface-600 dark:text-surface-300">
              Passionate full-stack developer with a love for building tools that make people's lives easier.
              BudgetFlow was born from the desire to create a simple yet powerful budget tracker that anyone can use
              to take control of their finances.
            </p>

            {/* Social Links */}
            <div className="mt-4 flex items-center justify-center gap-3 sm:justify-start">
              <a
                href="#"
                className="rounded-lg border border-surface-200 p-2 text-surface-500 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-surface-700 dark:hover:border-primary-500 dark:hover:text-primary-400"
              >
                <HiOutlineGlobe className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-lg border border-surface-200 p-2 text-surface-500 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-surface-700 dark:hover:border-primary-500 dark:hover:text-primary-400"
              >
                <HiOutlineCode className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8 dark:border-surface-800 dark:bg-surface-900"
      >
        <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Project Story */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8 dark:border-surface-800 dark:bg-surface-900"
      >
        <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">The Story Behind BudgetFlow</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10">
              <HiOutlineLightBulb className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-medium text-surface-900 dark:text-white">The Idea</h4>
              <p className="mt-1 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                Managing personal finances shouldn't require complex spreadsheets or expensive software.
                BudgetFlow was created to provide a beautiful, intuitive, and free way for everyone to track their money.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10">
              <HiOutlineCode className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-medium text-surface-900 dark:text-white">The Build</h4>
              <p className="mt-1 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                Built with React, Tailwind CSS, and Supabase — focusing on performance, clean design, and a seamless
                user experience. Every feature was carefully crafted to help users stay on top of their finances.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10">
              <HiOutlineHeart className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-medium text-surface-900 dark:text-white">The Mission</h4>
              <p className="mt-1 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                To empower people to make smarter financial decisions by providing the tools they need —
                completely free, no strings attached. Your financial wellness is our priority.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer note */}
      <motion.p
        {...fadeUp}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="pb-4 text-center text-sm text-surface-400"
      >
        Made with care by Jake Paragas &copy; {new Date().getFullYear()}
      </motion.p>
    </div>
  );
}

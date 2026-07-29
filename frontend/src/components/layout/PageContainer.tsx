import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageContainer = ({ children, title, subtitle, actions }: PageContainerProps) => {
  return (
    <main className="flex-1 overflow-y-auto bg-bg-deepest">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-6 lg:p-8 space-y-6"
      >
        {(title || actions) && (
          <header className="flex items-start justify-between">
            <div>
              {title && (
                <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
              )}
              {subtitle && (
                <p className="text-sm text-text-muted mt-1">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </header>
        )}
        {children}
      </motion.div>
    </main>
  );
};

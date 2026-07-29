import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accentColor?: string;
  suffix?: string;
  prefix?: string;
  delay?: number;
}

export const StatCard = ({
  label,
  value,
  icon: Icon,
  accentColor = 'var(--color-accent)',
  suffix = '',
  prefix = '',
  delay = 0,
}: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: delay / 1000, ease: 'easeOut' }}
      className="bg-card border border-border card-glow relative overflow-hidden group"
      style={{
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-6)',
        minWidth: 240,
      }}
    >
      {/* Accent top line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />

      {/* Icon + Label row */}
      <div className="flex items-center gap-2 mb-3">
        <Icon
          className="shrink-0"
          style={{ width: 20, height: 20, color: 'var(--color-primary-active)' }}
        />
        <p
          className="font-medium"
          style={{
            fontSize: 11,
            lineHeight: 1.4,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
          }}
        >
          {label}
        </p>
      </div>

      {/* Value */}
      <p
        className="font-display"
        style={{
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.2,
          color: 'var(--color-text-primary)',
        }}
      >
        {prefix}{displayValue.toLocaleString()}{suffix}
      </p>
    </motion.div>
  );
};

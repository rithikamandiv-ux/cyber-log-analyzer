import { useEffect, useState } from 'react';
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

  useEffect(() => {
    let animationFrameId: number | undefined;

    const timerId = window.setTimeout(() => {
      const duration = 1200;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setDisplayValue(Math.floor(easedProgress * value));

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
        }
      };

      animationFrameId = window.requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(timerId);

      if (animationFrameId !== undefined) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: delay / 1000,
        ease: 'easeOut',
      }}
      className="w-full min-w-0 max-w-full h-auto bg-card border border-border card-glow relative overflow-hidden group p-5"
      style={{
        borderRadius: 'var(--radius-card)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
        }}
      />

      <div className="flex items-center gap-2 mb-4">
        <Icon
          className="shrink-0"
          style={{
            width: 20,
            height: 20,
            color: 'var(--color-primary-active)',
          }}
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

      <p
        className="font-display"
        style={{
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.05,
          color: 'var(--color-text-primary)',
        }}
      >
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </p>
    </motion.div>
  );
};
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  delay?: number;
  size?: number;
}

export const AnimatedIcon = ({
  icon: Icon,
  className = '',
  delay = 0,
  size = 20,
}: AnimatedIconProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`inline-flex ${className}`}
    >
      <Icon size={size} />
    </motion.div>
  );
};

import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface ProcessingPipelineProps {
  currentStep: number; // 0-4
  steps?: string[];
}

const defaultSteps = [
  'Uploading',
  'Parsing',
  'Detection',
  'Generating Alerts',
  'Completed',
];

export const ProcessingPipeline = ({
  currentStep,
  steps = defaultSteps,
}: ProcessingPipelineProps) => {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        const isPending = idx > currentStep;
        void isPending;

        return (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            {/* Step circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted
                    ? 'bg-success/20 border-success text-success'
                    : isActive
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'bg-bg-elevated border-border text-text-dim'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="text-xs font-medium">{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-xs mt-2 whitespace-nowrap font-medium ${
                  isCompleted
                    ? 'text-success'
                    : isActive
                    ? 'text-accent'
                    : 'text-text-dim'
                }`}
              >
                {step}
              </span>
            </motion.div>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 mt-[-20px]">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.15, duration: 0.4 }}
                  style={{
                    transformOrigin: 'left',
                    background: isCompleted
                      ? 'var(--color-success)'
                      : 'var(--color-border)',
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

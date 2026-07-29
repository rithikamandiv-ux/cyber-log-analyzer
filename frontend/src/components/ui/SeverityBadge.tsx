interface SeverityBadgeProps {
  severity: string;
  size?: 'sm' | 'md';
}

const severityConfig: Record<string, { className: string; label: string }> = {
  critical: { className: 'badge-critical', label: 'Critical' },
  high: { className: 'badge-high', label: 'High' },
  medium: { className: 'badge-medium', label: 'Medium' },
  low: { className: 'badge-low', label: 'Low' },
  resolved: { className: 'badge-success', label: 'Resolved' },
};

export const SeverityBadge = ({ severity, size = 'sm' }: SeverityBadgeProps) => {
  const config = severityConfig[severity.toLowerCase()] || {
    className: 'bg-bg-elevated text-text-muted border border-border',
    label: severity,
  };

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wider ${config.className} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
};

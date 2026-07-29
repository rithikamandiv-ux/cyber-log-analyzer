import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Clock, MapPin, AlertTriangle, Brain, Target, Globe } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';

type Alert = {
  id: number;
  alert_type: string;
  severity: string;
  description: string;
  is_resolved: boolean;
  created_at: string;
  source_ip?: string;
};

interface InvestigationDrawerProps {
  alert: Alert | null;
  onClose: () => void;
}

const mockTimeline = [
  { time: '18:12:03', event: 'Failed Login Attempt', severity: 'medium' },
  { time: '18:13:15', event: 'Failed Login Attempt', severity: 'medium' },
  { time: '18:14:02', event: 'Invalid User Detected', severity: 'high' },
  { time: '18:15:44', event: 'New User Created', severity: 'low' },
  { time: '18:20:11', event: 'Log Tampering Detected', severity: 'critical' },
];

const severityDotColor: Record<string, string> = {
  critical: 'bg-critical',
  high: 'bg-high',
  medium: 'bg-medium',
  low: 'bg-low',
};

export const InvestigationDrawer = ({ alert, onClose }: InvestigationDrawerProps) => {
  return (
    <AnimatePresence>
      {alert && (
        <>
          {/* Overlay */}
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-bg-deep border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-critical-bg">
                  <Shield className="w-5 h-5 text-critical" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Investigation</h2>
                  <p className="text-xs text-text-muted">Alert #{alert.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Alert Details */}
              <section>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Alert Details</h3>
                <div className="bg-card rounded-[18px] border border-border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Alert Type</span>
                    <span className="text-sm font-medium text-text-primary">{alert.alert_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Severity</span>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Source IP
                    </span>
                    <span className="text-sm font-mono text-accent">{alert.source_ip || '192.168.1.105'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Timestamp
                    </span>
                    <span className="text-sm text-text-secondary">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Detection Source</span>
                    <span className="text-sm text-text-secondary">Rule Engine + ML</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Risk Score</span>
                    <span className="text-sm font-bold text-critical">87/100</span>
                  </div>
                </div>
              </section>

              {/* Description */}
              <section>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Description</h3>
                <p className="text-sm text-text-secondary bg-card rounded-[18px] border border-border p-4 leading-relaxed">
                  {alert.description}
                </p>
              </section>

              {/* Related Activity Timeline */}
              <section>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Related Activity Timeline
                </h3>
                <div className="space-y-0">
                  {mockTimeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative">
                      {/* Vertical line */}
                      {idx < mockTimeline.length - 1 && (
                        <div className="absolute left-[7px] top-5 w-[2px] h-full bg-border" />
                      )}
                      {/* Dot */}
                      <div className={`w-4 h-4 rounded-full mt-0.5 shrink-0 ${severityDotColor[item.severity] || 'bg-text-muted'}`} />
                      <div className="pb-5">
                        <p className="text-sm font-medium text-text-primary">{item.event}</p>
                        <p className="text-xs text-text-muted font-mono">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Placeholders */}
              <section>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" /> MITRE ATT&CK Mapping
                </h3>
                <div className="bg-card rounded-[18px] border border-border border-dashed p-6 text-center">
                  <p className="text-sm text-text-dim">ATT&CK technique mapping will appear here</p>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Threat Intelligence
                </h3>
                <div className="bg-card rounded-[18px] border border-border border-dashed p-6 text-center">
                  <p className="text-sm text-text-dim">Threat intelligence enrichment coming soon</p>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4" /> AI Explanation
                </h3>
                <div className="bg-card rounded-[18px] border border-border border-dashed p-6 text-center">
                  <p className="text-sm text-text-dim">ML-powered analysis explanation coming soon</p>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

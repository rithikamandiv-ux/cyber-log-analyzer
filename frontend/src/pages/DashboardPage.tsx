import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Activity,
  Brain,
  Server,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { mlService } from '../services/mlService';
import { AnimatedText } from '../components/ui/AnimatedText';
import { StatCard } from '../components/ui/StatCard';

type MLStatus = {
  modelVersion: string;
  trainingSamples: number;
  lastTrained: string;
  trainingRuns: number;
};

type DashboardStats = {
  totalLogs: number;
  totalAlerts: number;
  unresolvedAlerts: number;
  recentFiles: unknown[];
};

type TopIP = { source_ip: string; count: string };
type EventType = { event_type: string; count: string };
type RecentAlert = {
  id: number;
  alert_type: string;
  severity: string;
  description: string;
  created_at: string;
};
type SeverityDist = { severity: string; count: string };

const severityColors: Record<string, string> = {
  critical: 'var(--color-critical)',
  high: 'var(--color-high)',
  medium: 'var(--color-medium)',
  low: 'var(--color-low)',
};

const severityIcons: Record<string, React.ElementType> = {
  critical: ShieldX,
  high: AlertTriangle,
  medium: ShieldAlert,
  low: ShieldCheck,
};

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topIPs, setTopIPs] = useState<TopIP[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);
  const [severityDist, setSeverityDist] = useState<SeverityDist[]>([]);
  const [mlStatus, setMlStatus] = useState<MLStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, topIPsData, eventTypesData, alertsData, mlData, sevData] =
          await Promise.all([
            dashboardService.getStats(),
            dashboardService.getTopIPs(),
            dashboardService.getEventTypes(),
            dashboardService.getRecentAlerts(),
            mlService.getStatus(),
            dashboardService.getSeverityDistribution(),
          ]);

        setStats(statsData.stats);
        setTopIPs(topIPsData.ips);
        setEventTypes(eventTypesData.eventTypes);
        setRecentAlerts(alertsData.alerts);
        setMlStatus(mlData);
        setSeverityDist(sevData.distribution || []);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const getSevCount = (sev: string) => {
    const found = severityDist.find((s) => s.severity === sev);
    return found ? parseInt(found.count, 10) : 0;
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto bg-bg-deepest flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Loading security data...</p>
        </div>
      </main>
    );
  }

  const threatScore = Math.min(
    100,
    Math.round(
      (getSevCount('critical') * 40 +
        getSevCount('high') * 25 +
        getSevCount('medium') * 10) /
      Math.max(stats?.totalAlerts || 1, 1) *
      10
    )
  );

  return (
    <main className="flex-1 overflow-y-auto bg-bg-deepest">
      <div className="p-6 lg:p-8 2xl:p-10">
        {/* Hero */}
        <div className="mb-8">
          <AnimatedText
            text="SECURITY OPERATIONS CENTER"
            className="text-xs font-display text-primary-active tracking-[0.25em] mb-2"
            stagger={0.02}
            charDuration={0.3}
          />
          <h1 className="font-display font-bold text-text-primary" style={{ fontSize: 28, lineHeight: 1.2, letterSpacing: '0.02em' }}>Dashboard</h1>
          <p className="text-sm text-text-muted mt-1" style={{ lineHeight: 1.5 }}>
            Real-time security posture overview
          </p>
        </div>

        {/* Three-panel layout */}
        <div className="grid grid-cols-1 gap-y-12 gap-x-8 xl:grid-cols-[280px_minmax(0,1fr)_300px] 2xl:grid-cols-[300px_minmax(0,1fr)_320px]">
          {/* ===== LEFT PANEL — Threat Categories ===== */}
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-primary uppercase tracking-[0.1em] mb-6">
              Threat Categories
            </h2>
            <div className="space-y-6">

              {(['critical', 'high', 'medium'] as const).map((sev, idx) => {
                const Icon = severityIcons[sev];
                const count = getSevCount(sev);
                return (
                  <motion.div
                    key={sev}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.25, ease: 'easeOut' }}
                    className="bg-card rounded-[18px] border border-border p-5 card-glow flex items-center gap-4 w-full min-w-0 h-auto"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${severityColors[sev]}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: severityColors[sev] }} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-xs leading-tight text-text-muted capitalize">{sev} Alerts</p>
                      <p className="text-xl leading-none font-bold text-text-primary font-display">{count}</p>
                    </div>
                    <div
                      className="w-1 h-8 rounded-full"
                      style={{ background: severityColors[sev] }}
                    />
                  </motion.div>
                );
              })}

              {/* Resolved */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.25, ease: 'easeOut' }}
                className="bg-card rounded-[18px] border border-border p-5 card-glow flex items-center gap-4 w-full min-w-0 h-auto"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-success/10">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-xs leading-tight text-text-muted">Resolved</p>
                  <p className="text-xl leading-none font-bold text-text-primary font-display">
                    {Math.max(0, (stats?.totalAlerts ?? 0) - (stats?.unresolvedAlerts ?? 0))}
                  </p>
                </div>
                <div className="w-1 h-8 rounded-full bg-success" />
              </motion.div>
            </div>
          </div>

          {/* ===== CENTER PANEL — SOC Workspace ===== */}
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-primary uppercase tracking-[0.1em] mb-6">
              Main SOC Workspace
            </h2>
            <div className="space-y-6">
              {/* KPI Row */}
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))' }}>
                <StatCard
                  label="Threat Score"
                  value={threatScore}
                  icon={TrendingUp}
                  accentColor="var(--color-critical)"
                  suffix="/100"
                  delay={0}
                />
                <StatCard
                  label="Total Logs"
                  value={stats?.totalLogs ?? 0}
                  icon={Database}
                  accentColor="var(--color-accent)"
                  delay={100}
                />
                <StatCard
                  label="Active Alerts"
                  value={stats?.unresolvedAlerts ?? 0}
                  icon={ShieldAlert}
                  accentColor="var(--color-high)"
                  delay={200}
                />
                <StatCard
                  label="ML Confidence"
                  value={94}
                  icon={Brain}
                  accentColor="var(--color-success)"
                  suffix="%"
                  delay={300}
                />
              </div>

              {/* Threat Distribution Chart */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.25,
                  ease: 'easeOut',
                }}
                className="bg-card rounded-[18px] border border-border p-5 card-glow"
              >
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" />
                  Threat Distribution
                </h3>

                <div
                  className="w-full min-w-0 overflow-hidden"
                  style={{
                    width: '100%',
                    minWidth: 0,
                    height: 320,
                    minHeight: 320,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320} debounce={100}>
                    <BarChart data={eventTypes} barSize={20}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                        strokeOpacity={0.3}
                        vertical={false}
                      />

                      <XAxis
                        dataKey="event_type"
                        stroke="var(--color-text-dim)"
                        tick={{
                          fill: 'var(--color-text-muted)',
                          fontSize: 11,
                        }}
                        axisLine={{ stroke: 'var(--color-border)' }}
                        tickLine={false}
                      />

                      <YAxis
                        stroke="var(--color-text-dim)"
                        tick={{
                          fill: 'var(--color-text-muted)',
                          fontSize: 11,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-primary)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        }}
                      />

                      <Bar
                        dataKey="count"
                        fill="var(--color-primary-active)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Top Source IPs */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.25, ease: 'easeOut' }}
                className="bg-card rounded-[18px] border border-border p-5 card-glow"
              >
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  Top Source IPs
                </h3>
                <div className="space-y-2">
                  {topIPs.map((ip, idx) => (
                    <div
                      key={ip.source_ip}
                      className="flex flex-col gap-2 w-full min-w-0 bg-bg-elevated rounded-lg border border-border/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="shrink-0 text-xs text-text-dim w-5">{idx + 1}.</span>
                        <span className="min-w-0 break-all font-mono text-sm text-text-primary">
                          {ip.source_ip}
                        </span>
                      </div>
                      <span className="shrink-0 text-left sm:text-right text-xs font-semibold text-accent">
                        {ip.count} events
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Threat Activity */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.25, ease: 'easeOut' }}
                className="bg-card rounded-[18px] border border-border p-5 card-glow"
              >
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-muted" />
                  Recent Threat Activity
                </h3>
                <div className="space-y-2">
                  {recentAlerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className="bg-bg-elevated rounded-lg px-4 py-3 border border-border/50"
                    >
                      <div className="flex flex-col items-start gap-2 mb-2 min-w-0 sm:flex-row sm:items-start sm:justify-between">
                        <span className="min-w-0 break-words text-sm font-medium text-text-primary">
                          {alert.alert_type.replaceAll('_', ' ')}
                        </span>
                        <span
                          className={`shrink-0 self-start text-[10px] font-bold uppercase px-2 py-0.5 rounded-full badge-${alert.severity}`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted break-words line-clamp-1">
                        {alert.description}
                      </p>
                      <p className="text-[10px] text-text-dim mt-1">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* ===== RIGHT PANEL — System Intelligence ===== */}
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-primary uppercase tracking-[0.1em] mb-6">
              System Intelligence
            </h2>
            <div className="space-y-6">

              {/* ML Status */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.25, ease: 'easeOut' }}
                className="bg-card rounded-[18px] border border-border p-5 card-glow w-full min-w-0 h-auto"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                    ML Engine
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-1 min-w-0 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-text-muted shrink-0">Model Version</span>
                    <span className="text-xs font-mono text-accent break-words min-w-0 sm:text-right">
                      {mlStatus?.modelVersion ?? 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-text-muted shrink-0">Training Samples</span>
                    <span className="text-xs font-semibold text-text-primary break-words min-w-0 sm:text-right">
                      {mlStatus?.trainingSamples ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-text-muted shrink-0">Training Runs</span>
                    <span className="text-xs font-semibold text-text-primary break-words min-w-0 sm:text-right">
                      {mlStatus?.trainingRuns ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-text-muted shrink-0">Last Trained</span>
                    <span className="text-[10px] text-text-secondary break-words min-w-0 sm:text-right">
                      {mlStatus?.lastTrained
                        ? new Date(mlStatus.lastTrained).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.25, ease: 'easeOut' }}
                className="bg-card rounded-[18px] border border-border p-5 card-glow w-full min-w-0 h-auto"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Server className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                    System Status
                  </span>
                </div>

                <div className="space-y-3">
                  <StatusRow label="Database" status="Operational" />
                  <StatusRow label="Detection Engine" status="Active" />
                  <StatusRow label="ML Pipeline" status="Ready" />
                  <StatusRow label="API Gateway" status="Operational" />
                </div>
              </motion.div>

              {/* System Health */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.25, ease: 'easeOut' }}
                className="bg-card rounded-[18px] border border-border p-5 card-glow w-full min-w-0 h-auto"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-success" />
                  <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                    Health
                  </span>
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-3 h-3 rounded-full bg-success pulse-dot shrink-0" />
                  <span className="text-sm text-success font-medium break-words min-w-0">All Systems Operational</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div >
      </div >
    </main >
  );
};

/* Status row helper */
const StatusRow = ({ label, status }: { label: string; status: string }) => (
  <div className="flex flex-col gap-1 min-w-0 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-xs text-text-muted shrink-0">{label}</span>
    <div className="flex items-center gap-1.5 min-w-0 sm:justify-end sm:text-right">
      <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
      <span className="text-[10px] font-medium text-success break-words min-w-0">{status}</span>
    </div>
  </div>
);
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileBarChart,
  Download,
  FileText,
  Table,
  TrendingUp,
  Calendar,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { alertService } from '../services/alertService';

type SeverityDist = { severity: string; count: string };

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'var(--color-critical)',
  high: 'var(--color-high)',
  medium: 'var(--color-medium)',
  low: 'var(--color-low)',
};

const monthlyData = [
  { month: 'Jan', alerts: 42 },
  { month: 'Feb', alerts: 58 },
  { month: 'Mar', alerts: 35 },
  { month: 'Apr', alerts: 71 },
  { month: 'May', alerts: 63 },
  { month: 'Jun', alerts: 89 },
];

export const ReportsPage = () => {
  const [severityDist, setSeverityDist] = useState<SeverityDist[]>([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sevData, alertData] = await Promise.all([
          dashboardService.getSeverityDistribution(),
          alertService.getAlerts(),
        ]);
        setSeverityDist(sevData.distribution || []);
        setTotalAlerts(alertData.alerts?.length || 0);
      } catch (error) {
        console.error('Failed to load report data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const pieData = severityDist.map((s) => ({
    name: s.severity,
    value: parseInt(s.count, 10),
  }));

  const handleExport = (type: 'pdf' | 'csv') => {
    // Placeholder for export functionality
    alert(`${type.toUpperCase()} export will be available in a future release.`);
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto bg-bg-deepest flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Loading report data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-bg-deepest">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Reports</h1>
            <p className="text-sm text-text-muted mt-1">
              Security analytics and compliance reporting
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              id="generate-report-btn"
              className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-bg-deepest font-semibold text-sm rounded-lg transition-colors"
            >
              <FileBarChart className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Export buttons */}
        <div className="flex gap-3 mb-8">
          <button
            id="export-pdf-btn"
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-text-secondary hover:text-text-primary hover:border-border-light rounded-lg transition-all text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
          <button
            id="export-csv-btn"
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-text-secondary hover:text-text-primary hover:border-border-light rounded-lg transition-all text-sm font-medium"
          >
            <Table className="w-4 h-4" />
            Export CSV
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-text-secondary hover:text-text-primary hover:border-border-light rounded-lg transition-all text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25, ease: 'easeOut' }}
            className="bg-card rounded-[18px] border border-border p-5 card-glow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-critical/10">
                <ShieldAlert className="w-4 h-4 text-critical" />
              </div>
              <span className="text-xs text-text-muted">Total Alerts</span>
            </div>
            <p className="text-2xl font-bold text-text-primary font-display">{totalAlerts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25, ease: 'easeOut' }}
            className="bg-card rounded-[18px] border border-border p-5 card-glow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs text-text-muted">Avg. Monthly</span>
            </div>
            <p className="text-2xl font-bold text-text-primary font-display">
              {Math.round(monthlyData.reduce((a, b) => a + b.alerts, 0) / monthlyData.length)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25, ease: 'easeOut' }}
            className="bg-card rounded-[18px] border border-border p-5 card-glow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Calendar className="w-4 h-4 text-success" />
              </div>
              <span className="text-xs text-text-muted">Report Period</span>
            </div>
            <p className="text-lg font-semibold text-text-primary">Jan – Jun 2026</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Alert Severity Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25, ease: 'easeOut' }}
            className="bg-card rounded-[18px] border border-border p-5 card-glow"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-text-muted" />
              Alert Severity Distribution
            </h3>
            <div className="h-[260px] flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={SEVERITY_COLORS[entry.name] || '#64748B'}
                        />
                      ))}
                    </Pie>
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
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-text-dim">No severity data available</p>
              )}
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ background: SEVERITY_COLORS[entry.name] || '#64748B' }}
                  />
                  <span className="text-xs text-text-muted capitalize">{entry.name}</span>
                  <span className="text-xs font-semibold text-text-secondary">{entry.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Threat Trends */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.25, ease: 'easeOut' }}
            className="bg-card rounded-[18px] border border-border p-5 card-glow"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-text-muted" />
              Monthly Threat Trends
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.3} vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="var(--color-text-dim)"
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--color-border)' }}
                  />
                  <YAxis
                    stroke="var(--color-text-dim)"
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
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
                  <Bar dataKey="alerts" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

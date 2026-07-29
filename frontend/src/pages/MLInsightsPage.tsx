import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Database,
  RefreshCw,
  Calendar,
  Cpu,
  BarChart3,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { mlService } from '../services/mlService';
import { AnimatedText } from '../components/ui/AnimatedText';
import { StatCard } from '../components/ui/StatCard';

type MLStatus = {
  modelVersion: string;
  trainingSamples: number;
  lastTrained: string;
  trainingRuns: number;
};

// Mock data for charts (to be replaced when backend endpoints are available)
const accuracyData = [
  { epoch: '1', accuracy: 78 },
  { epoch: '2', accuracy: 82 },
  { epoch: '3', accuracy: 85 },
  { epoch: '4', accuracy: 87 },
  { epoch: '5', accuracy: 89 },
  { epoch: '6', accuracy: 91 },
  { epoch: '7', accuracy: 92 },
  { epoch: '8', accuracy: 94 },
];

const anomalyData = [
  { date: 'Mon', anomalies: 12, normal: 145 },
  { date: 'Tue', anomalies: 19, normal: 132 },
  { date: 'Wed', anomalies: 8, normal: 158 },
  { date: 'Thu', anomalies: 24, normal: 121 },
  { date: 'Fri', anomalies: 15, normal: 140 },
  { date: 'Sat', anomalies: 6, normal: 89 },
  { date: 'Sun', anomalies: 3, normal: 67 },
];

const trainingGrowth = [
  { month: 'Jan', samples: 1200 },
  { month: 'Feb', samples: 2400 },
  { month: 'Mar', samples: 3800 },
  { month: 'Apr', samples: 5100 },
  { month: 'May', samples: 7200 },
  { month: 'Jun', samples: 9800 },
];

export const MLInsightsPage = () => {
  const [mlStatus, setMlStatus] = useState<MLStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mlService.getStatus();
        setMlStatus(data);
      } catch (error) {
        console.error('Failed to load ML status:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto bg-bg-deepest flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Loading ML data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-bg-deepest">
      <div className="p-6 lg:p-8">
        {/* Hero */}
        <div className="mb-8">
          <AnimatedText
            text="THREAT DETECTION ENGINE"
            className="text-xs font-display text-accent/60 tracking-[0.25em] mb-2"
            stagger={0.02}
            charDuration={0.3}
          />
          <h1 className="font-display font-bold text-text-primary" style={{ fontSize: 28, lineHeight: 1.2, letterSpacing: '0.02em' }}>ML Insights</h1>
          <p className="text-sm text-text-muted mt-1" style={{ lineHeight: 1.5 }}>
            AI-powered threat detection and anomaly analysis
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Model Version"
            value={parseFloat(mlStatus?.modelVersion || '0') || 1}
            icon={Cpu}
            accentColor="var(--color-accent)"
            prefix="v"
            delay={0}
          />
          <StatCard
            label="Training Samples"
            value={mlStatus?.trainingSamples ?? 0}
            icon={Database}
            accentColor="var(--color-low)"
            delay={100}
          />
          <StatCard
            label="Training Runs"
            value={mlStatus?.trainingRuns ?? 0}
            icon={RefreshCw}
            accentColor="var(--color-medium)"
            delay={200}
          />
          <StatCard
            label="Detection Accuracy"
            value={94}
            icon={TrendingUp}
            accentColor="var(--color-success)"
            suffix="%"
            delay={300}
          />
        </div>

        {/* Last trained info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.25, ease: 'easeOut' }}
          className="bg-card rounded-[18px] border border-border p-4 mb-8 flex items-center gap-3"
        >
          <Calendar className="w-4 h-4 text-text-dim" />
          <span className="text-sm text-text-muted">Last Trained:</span>
          <span className="text-sm font-medium text-text-primary">
            {mlStatus?.lastTrained
              ? new Date(mlStatus.lastTrained).toLocaleString()
              : 'N/A'}
          </span>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Detection Accuracy */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.25, ease: 'easeOut' }}
            className="bg-card rounded-[18px] border border-border p-5 card-glow"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Detection Accuracy
            </h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.3} vertical={false} />
                  <XAxis
                    dataKey="epoch"
                    stroke="var(--color-text-dim)"
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--color-border)' }}
                  />
                  <YAxis
                    domain={[70, 100]}
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
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="var(--color-success)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--color-success)' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Anomaly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.25, ease: 'easeOut' }}
            className="bg-card rounded-[18px] border border-border p-5 card-glow"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-critical" />
              Anomaly Trends
            </h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={anomalyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.3} vertical={false} />
                  <XAxis
                    dataKey="date"
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
                  <Area
                    type="monotone"
                    dataKey="normal"
                    stroke="var(--color-accent)"
                    fill="rgba(125, 211, 252, 0.1)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="anomalies"
                    stroke="var(--color-critical)"
                    fill="rgba(248, 113, 113, 0.1)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Training Growth */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.25, ease: 'easeOut' }}
          className="bg-card rounded-[18px] border border-border p-5 card-glow"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-low" />
            Training Data Growth
          </h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingGrowth} barSize={32}>
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
                <Bar dataKey="samples" fill="var(--color-low)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

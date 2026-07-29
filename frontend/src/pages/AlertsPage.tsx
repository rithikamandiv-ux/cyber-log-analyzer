import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { alertService } from '../services/alertService';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { InvestigationDrawer } from '../components/ui/InvestigationDrawer';

type Alert = {
  id: number;
  alert_type: string;
  severity: string;
  description: string;
  is_resolved: boolean;
  created_at: string;
  source_ip?: string;
};

const filters = ['all', 'critical', 'high', 'medium', 'low', 'resolved'] as const;
type FilterType = (typeof filters)[number];

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <AlertOctagon className="w-4 h-4" />;
    case 'high':
    case 'medium':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

const severityIconColor: Record<string, string> = {
  critical: 'text-critical bg-critical/10',
  high: 'text-high bg-high/10',
  medium: 'text-medium bg-medium/10',
  low: 'text-low bg-low/10',
};

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await alertService.getAlerts();
        setAlerts(data.alerts);
      } catch (error) {
        console.error('Failed to load alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'resolved'
        ? alert.is_resolved
        : alert.severity === activeFilter;

    const matchesSearch =
      searchQuery === '' ||
      alert.alert_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getFilterCount = (filter: FilterType): number => {
    if (filter === 'all') return alerts.length;
    if (filter === 'resolved') return alerts.filter((a) => a.is_resolved).length;
    return alerts.filter((a) => a.severity === filter).length;
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto bg-bg-deepest flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Loading alerts...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-bg-deepest">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-text-primary">Threat Investigation</h1>
          <p className="text-sm text-text-muted mt-1">
            {alerts.length} alerts detected · {alerts.filter((a) => !a.is_resolved).length} active
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              id="alerts-search"
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1">
            <Filter className="w-4 h-4 text-text-dim ml-2 mr-1 shrink-0" />
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-accent/15 text-accent'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
                }`}
              >
                {filter}
                <span className="ml-1.5 text-[10px] opacity-60">{getFilterCount(filter)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Alert Cards */}
        <div className="space-y-5">
          {filteredAlerts.length === 0 ? (
            <div className="bg-card rounded-[18px] border border-border p-12 text-center">
              <p className="text-sm text-text-muted">No alerts match your filters</p>
            </div>
          ) : (
            filteredAlerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.25, ease: 'easeOut' }}
                onClick={() => setSelectedAlert(alert)}
                className="bg-card rounded-[18px] border border-border p-6 card-glow cursor-pointer hover:border-border-light transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Severity icon */}
                    <div
                      className={`p-2.5 rounded-lg shrink-0 ${
                        severityIconColor[alert.severity] || 'text-text-muted bg-bg-elevated'
                      }`}
                    >
                      {getSeverityIcon(alert.severity)}
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                          {alert.alert_type}
                        </h3>
                        <SeverityBadge severity={alert.severity} />
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2 mb-2">
                        {alert.description}
                      </p>
                      <p className="text-[10px] text-text-dim">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="shrink-0">
                    {alert.is_resolved ? (
                      <span className="flex items-center gap-1 text-success text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-medium text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-medium" /> Active
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Investigation Drawer */}
      <InvestigationDrawer
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </main>
  );
};
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Save, Check } from 'lucide-react';

export const SettingsPage = () => {
  const [saved, setSaved] = useState(false);

  const user = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-bg-deepest">
      <div className="p-6 lg:p-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-text-primary">Settings</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your account and platform preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25, ease: 'easeOut' }}
            className="bg-card rounded-[18px] border border-border p-6 card-glow"
          >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                defaultValue={user?.username || 'Security Analyst'}
                className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email || 'analyst@cyberlog.local'}
                className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Role
              </label>
              <input
                type="text"
                defaultValue={user?.role || 'Admin'}
                disabled
                className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-4 text-sm text-text-dim cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Department
              </label>
              <input
                type="text"
                defaultValue="Security Operations"
                className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
              />
            </div>
          </div>
        </motion.section>

          {/* Notifications Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25, ease: 'easeOut' }}
            className="bg-card rounded-[18px] border border-border p-6 card-glow"
          >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Notifications</h2>
          </div>

          <div className="space-y-4">
            <ToggleRow label="Critical Alert Notifications" description="Receive alerts for critical severity threats" defaultChecked={true} />
            <ToggleRow label="High Alert Notifications" description="Receive alerts for high severity threats" defaultChecked={true} />
            <ToggleRow label="ML Model Updates" description="Notify when the ML model is retrained" defaultChecked={false} />
            <ToggleRow label="Upload Completion" description="Notify when log file analysis completes" defaultChecked={true} />
          </div>
        </motion.section>

          {/* Security Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25, ease: 'easeOut' }}
            className="bg-card rounded-[18px] border border-border p-6 card-glow"
          >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Security</h2>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-4 text-sm text-text-primary placeholder-text-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all max-w-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-4 text-sm text-text-primary placeholder-text-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all max-w-sm"
              />
              </div>
            </div>
          </motion.section>
        </div>

        {/* Save button row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.25, ease: 'easeOut' }}
        >
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-bg-deepest font-semibold text-sm rounded-lg transition-all"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      </div>
    </main>
  );
};

/* Toggle row helper */
const ToggleRow = ({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  // Track: 40×22, Knob: 18×18, Padding: 2px each side
  // OFF translateX = 2px, ON translateX = 40 - 18 - 2*2 = 18px
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className="relative shrink-0"
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          backgroundColor: checked ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
          transition: 'background-color 0.2s ease',
        }}
      >
        <span
          className="absolute rounded-full shadow-sm"
          style={{
            width: 18,
            height: 18,
            top: 2,
            left: 0,
            backgroundColor: checked ? '#FFFFFF' : 'var(--color-text-muted)',
            transform: checked ? 'translateX(20px)' : 'translateX(2px)',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
          }}
        />
      </button>
    </div>
  );
};

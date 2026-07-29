import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Shield, Brain, FileSearch, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { NetworkVisualization } from '../components/ui/NetworkVisualization';
import { AnimatedText } from '../components/ui/AnimatedText';

const features = [
  { icon: Brain, text: 'ML-Powered Threat Detection' },
  { icon: FileSearch, text: 'Advanced Log Analysis' },
  { icon: Radio, text: 'Real-Time Security Monitoring' },
];

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@cyberlog.local');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deepest flex">
      {/* Left Side — Visual */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center">
        {/* Network background */}
        <NetworkVisualization />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-deepest/40 via-transparent to-bg-deepest/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deepest via-transparent to-bg-deepest/50" />

        {/* Content */}
        <div className="relative z-10 px-16 max-w-xl">
          {/* Shield icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-8"
          >
            <Shield className="w-8 h-8 text-accent" />
          </motion.div>

          {/* Hero text */}
          <AnimatedText
            text="CYBERLOG"
            className="text-4xl xl:text-5xl font-display font-bold text-text-primary mb-3"
            stagger={0.05}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-lg text-text-muted mb-12"
          >
            Security Intelligence Platform
          </motion.p>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + idx * 0.15, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-text-secondary">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Auth */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
              <Shield className="w-7 h-7 text-accent" />
            </div>
            <h1 className="font-display text-2xl font-bold text-text-primary tracking-widest">
              CYBERLOG
            </h1>
            <p className="text-sm text-text-muted mt-1">Security Intelligence Platform</p>
          </div>

          {/* Auth card */}
          <div className="bg-card rounded-[18px] border border-border p-8 card-glow">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text-primary">Sign In</h2>
              <p className="text-sm text-text-muted mt-1">
                Access the Security Operations Center
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-critical/8 border border-critical/20 text-critical rounded-lg px-4 py-3 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-text-dim" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                    placeholder="analyst@soc.local"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-text-dim" />
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    required
                    className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg-deepest font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <p className="text-center text-text-dim text-xs mt-6">
            Restricted access · Authorized personnel only
          </p>
        </motion.div>
      </div>
    </div>
  );
};
import { Bell, Search, User } from 'lucide-react';

interface NavbarProps {
  title?: string;
}

export const Navbar = ({ title }: NavbarProps) => {
  const user = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  return (
    <header className="h-14 bg-bg-deep/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-4">
        {title && (
          <h2 className="text-sm font-medium text-text-muted">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <button className="p-2 rounded-lg text-text-dim hover:text-text-muted hover:bg-bg-elevated transition-colors">
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-text-dim hover:text-text-muted hover:bg-bg-elevated transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-critical rounded-full pulse-dot" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-text-primary leading-none">
              {user?.username || 'Analyst'}
            </span>
            <span className="text-[10px] text-text-dim mt-0.5">
              {user?.role || 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

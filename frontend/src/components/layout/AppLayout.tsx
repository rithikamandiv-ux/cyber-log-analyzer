import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout = () => {
  return (
    <div className="flex h-screen w-full bg-bg-deepest overflow-hidden text-text-secondary font-body">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};


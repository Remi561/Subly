
import { Outlet } from 'react-router'
import { Sidebar } from '../components/Sidebar'
import { Navbar } from '../components/Navbar';
import { Toaster } from '@/components/ui/sonner';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="min-h-screen px-4 pb-28 pt-5 sm:px-6 lg:ml-72 lg:px-8 lg:pb-8">
        <Outlet />
        <Toaster richColors position="top-right" />
      </main>
      <Navbar />
    </div>
  );
}

export default Dashboard
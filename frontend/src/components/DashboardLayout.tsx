import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import FloatingChat from './FloatingChat';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0B1120] text-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-[#0B1120]">
          <Outlet />
        </main>
      </div>
      <FloatingChat />
    </div>
  );
};

export default DashboardLayout;

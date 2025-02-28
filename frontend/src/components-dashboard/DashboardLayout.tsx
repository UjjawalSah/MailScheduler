
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="flex-1 overflow-y-auto p-6 ml-[256px]">
      <div className="max-w-7xl mx-auto space-y-8">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;

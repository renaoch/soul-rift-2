"use client";

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}

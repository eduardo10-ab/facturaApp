// src/components/layout/Layout.tsx
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <>
      <Sidebar />
      <Header title={title} subtitle={subtitle} />
      <div className="main-content-with-sidebar">
        {children}
      </div>
    </>
  );
};
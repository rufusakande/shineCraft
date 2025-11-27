import React from 'react';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default MainLayout;

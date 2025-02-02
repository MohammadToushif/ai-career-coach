import React, { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return <div className="container mx-auto mt-24 mb-20">{children}</div>;
};

export default MainLayout;

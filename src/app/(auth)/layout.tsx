import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen pt-20 pb-4">
      {children}
    </div>
  );
};

export default AuthLayout;

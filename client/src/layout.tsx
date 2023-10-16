import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;

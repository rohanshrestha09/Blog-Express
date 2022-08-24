import { Layout } from "antd";
import React from "react";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout className="!font-sans" data-theme="winter">
      {children}
    </Layout>
  );
};

export default AppLayout;

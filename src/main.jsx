import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from './app/Layout';
import JointAuditWorkspace from './features/ja/components/JointAuditWorkspace';
import ExecutionWorkspace from './features/ex/ExecutionWorkspace';
// import './index.css'; // Tailwind base

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        {/* Toggle this to switch between JA and EX views during development */}
        {/* <JointAuditWorkspace /> */}
        <ExecutionWorkspace />
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
);

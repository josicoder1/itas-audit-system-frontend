import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from './app/Layout';
import JointAuditWorkspace from './features/ja/components/JointAuditWorkspace';
import ExecutionWorkspace from './features/ex/ExecutionWorkspace';

function App() {
  const [activeCluster, setActiveCluster] = useState('ja');

  return (
    <Layout activeCluster={activeCluster} onClusterChange={setActiveCluster}>
      {activeCluster === 'ja' && <JointAuditWorkspace />}
      {activeCluster === 'ex' && <ExecutionWorkspace />}
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

import React from 'react';
import LayoutShell from './components/LayoutShell';
import ToastContainer from './components/ToastContainer';
import './App.css';
import { ProjectStateProvider } from './context/ProjectStateContext';

function App() {
  // Ensure page starts at top on load
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ProjectStateProvider projectId="dashboard-project">
      <LayoutShell />
      <ToastContainer />
    </ProjectStateProvider>
  );
}

export default App;
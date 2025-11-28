import React from 'react';
import LayoutShell from './components/LayoutShell';
import ToastContainer from './components/ToastContainer';
import './App.css';

function App() {
  // Ensure page starts at top on load
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <LayoutShell />
      <ToastContainer />
    </>
  );
}

export default App;
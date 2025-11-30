import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProjectStateProvider } from './context/ProjectStateContext'

// Import debug utility for development
import { debugHealthCheck } from './utils/debugHealthCheck';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectStateProvider>
      <App />
    </ProjectStateProvider>
  </StrictMode>,
)

// Expose debug function globally in development
if (import.meta.env.DEV) {
  window.debugHealthCheck = debugHealthCheck;
}
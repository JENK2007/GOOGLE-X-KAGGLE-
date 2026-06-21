import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite WebSocket, HMR connection, and unexpected peer/closed errors
if (typeof window !== 'undefined') {
  const isWebsocketOrHmrError = (errMessage: string) => {
    if (!errMessage) return false;
    const lower = errMessage.toLowerCase();
    return (
      lower.includes('websocket') ||
      lower.includes('failed to connect') ||
      lower.includes('hmr') ||
      lower.includes('vite')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (isWebsocketOrHmrError(reason)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (isWebsocketOrHmrError(msg)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true); // Use capture phase to intercept early
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

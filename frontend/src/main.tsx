import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Intercept localStorage access for settings to redirect them to sessionStorage.
// This ensures that closing the browser tab/window completely resets settings to default,
// while simple page refreshes preserve them.
const sessionKeys = [
  "language",
  "prana-ui-theme",
  "measurement_unit",
  "system_timezone",
  "isAuthenticated",
  "flow",
  "prana-recent-searches",
  "waqi_api_key",
  "prana-copilot-sessions",
  "prana-copilot-messages",
  "prana-copilot-active-session"
];

const originalGetItem = localStorage.getItem.bind(localStorage);
const originalSetItem = localStorage.setItem.bind(localStorage);
const originalRemoveItem = localStorage.removeItem.bind(localStorage);

(localStorage as any).getItem = function(key: string): string | null {
  if (sessionKeys.includes(key)) {
    return sessionStorage.getItem(key);
  }
  return originalGetItem(key);
};

(localStorage as any).setItem = function(key: string, value: string): void {
  if (sessionKeys.includes(key)) {
    sessionStorage.setItem(key, value);
    return;
  }
  originalSetItem(key, value);
};

(localStorage as any).removeItem = function(key: string): void {
  if (sessionKeys.includes(key)) {
    sessionStorage.removeItem(key);
    return;
  }
  originalRemoveItem(key);
};

// Unconditionally clear localStorage and sessionStorage
// on every single load/reload to ensure the app starts with default settings.
try {
  localStorage.clear();
} catch (e) {}
try {
  sessionStorage.clear();
} catch (e) {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


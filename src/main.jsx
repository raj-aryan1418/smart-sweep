import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ComplaintsProvider } from './context/ComplaintsContext';
import { BulkPickupProvider } from './context/BulkPickupContext';
import { FleetProvider } from './context/FleetContext';
import { WorkforceProvider } from './context/WorkforceContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <AuthProvider>
              <ComplaintsProvider>
                <BulkPickupProvider>
                  <FleetProvider>
                    <WorkforceProvider>
                      <App />
                    </WorkforceProvider>
                  </FleetProvider>
                </BulkPickupProvider>
              </ComplaintsProvider>
            </AuthProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

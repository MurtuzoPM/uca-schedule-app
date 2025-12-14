import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/bootstrap-theme.css'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext'
import { ModalProvider } from './context/ModalContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <ModalProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ModalProvider>
    </ToastProvider>
  </StrictMode>,
)

import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import ChatPage from '@/pages/ChatPage'
import PaymentPage from '@/pages/PaymentPage'
import BillingReturnPage from '@/pages/BillingReturnPage'
import SpecialistAssistancePage from '@/pages/SpecialistAssistancePage'
import TermsPage from '@/pages/TermsPage'
import SettingsPage from '@/pages/SettingsPage'
import VerifyEmailPage from '@/pages/VerifyEmailPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/chat/:sessionId?"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route path="/contactos-emergencia" element={<SpecialistAssistancePage />} />
      <Route path="/asistencia-especializada" element={<Navigate to="/contactos-emergencia" replace />} />
      <Route path="/terminos" element={<TermsPage />} />
      {/* Public: these paths must match app.frontend.*-path on the backend. */}
      <Route path="/verificar-correo" element={<VerifyEmailPage />} />
      <Route path="/restablecer-contrasena" element={<ResetPasswordPage />} />
      <Route
        path="/configuracion"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pago/:plan"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing/:result"
        element={
          <ProtectedRoute>
            <BillingReturnPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

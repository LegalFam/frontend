import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import ChatPage from '@/pages/ChatPage'
import PaymentPage from '@/pages/PaymentPage'
import BillingReturnPage from '@/pages/BillingReturnPage'
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

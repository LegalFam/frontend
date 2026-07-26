import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar           from '@/components/layout/Navbar'
import HeroSection      from '@/components/landing/HeroSection'
import SobreSection     from '@/components/landing/SobreSection'
import ComoSection      from '@/components/landing/ComoSection'
import PreciosSection   from '@/components/landing/PreciosSection'
import { BannerSection, Footer } from '@/components/landing/BannerSection'
import SeguridadSection from '@/components/landing/SeguridadSection'
import PrivacidadSection from '@/components/landing/PrivacidadSection'
import LoginModal       from '@/components/auth/LoginModal'
import RegisterModal    from '@/components/auth/RegisterModal'
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal'
import { useAuth }      from '@/hooks/useAuth'
import { usePaymentStore } from '@/store/paymentStore'

const AUTH_MODALS = ['login', 'register', 'forgot']

export default function LandingPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated, signout } = useAuth()
  const { subscription, refreshBilling } = usePaymentStore()
  // Also opened via ?auth=..., so /verificar-correo and /restablecer-contrasena can hand off.
  const requestedModal = searchParams.get('auth')
  const [modal, setModal] = useState(
    AUTH_MODALS.includes(requestedModal) ? requestedModal : null
  ) // 'login' | 'register' | 'forgot' | null
  const [forgotEmail, setForgotEmail] = useState('')

  useEffect(() => {
    if (!searchParams.has('auth')) return
    const next = new URLSearchParams(searchParams)
    next.delete('auth')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (isAuthenticated) {
      refreshBilling().catch(() => {})
    }
  }, [isAuthenticated, refreshBilling])

  const scrollComo = () =>
    document.getElementById('como')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLoginClick={()    => setModal('login')}
        onRegisterClick={() => isAuthenticated ? navigate('/chat') : setModal('register')}
        onChatClick={() => navigate('/chat')}
        onSignoutClick={signout}
      />

      <main>
        <HeroSection
          isAuthenticated={isAuthenticated}
          onPrimaryClick={() => isAuthenticated ? navigate('/chat') : setModal('register')}
          onScrollComo={scrollComo}
        />
        <SobreSection />
        <ComoSection />
        <PreciosSection
          isAuthenticated={isAuthenticated}
          currentPlanCode={subscription?.planCode}
          onRegisterClick={() => setModal('register')}
        />
        <BannerSection />
        <SeguridadSection />
        <PrivacidadSection />
      </main>

      <Footer />

      {!isAuthenticated && modal === 'login' && (
        <LoginModal
          onClose={()             => setModal(null)}
          onSwitchToRegister={() => setModal('register')}
          onForgotPassword={(email) => { setForgotEmail(email || ''); setModal('forgot') }}
        />
      )}
      {!isAuthenticated && modal === 'register' && (
        <RegisterModal
          onClose={()          => setModal(null)}
          onSwitchToLogin={() => setModal('login')}
        />
      )}
      {!isAuthenticated && modal === 'forgot' && (
        <ForgotPasswordModal
          onClose={()          => setModal(null)}
          onSwitchToLogin={() => setModal('login')}
          initialEmail={forgotEmail}
        />
      )}
    </>
  )
}

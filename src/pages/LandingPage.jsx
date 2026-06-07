import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { useAuth }      from '@/hooks/useAuth'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, signout } = useAuth()
  const [modal, setModal] = useState(null) // 'login' | 'register' | null

  const scrollComo = () =>
    document.getElementById('como')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLoginClick={()    => setModal('login')}
        onRegisterClick={() => setModal('register')}
        onChatClick={() => navigate('/chat')}
        onSignoutClick={signout}
      />

      <main>
        <HeroSection
          onRegisterClick={() => setModal('register')}
          onScrollComo={scrollComo}
        />
        <SobreSection />
        <ComoSection />
        <PreciosSection onRegisterClick={() => setModal('register')} />
        <BannerSection />
        <SeguridadSection />
        <PrivacidadSection />
      </main>

      <Footer />

      {modal === 'login' && (
        <LoginModal
          onClose={()             => setModal(null)}
          onSwitchToRegister={() => setModal('register')}
        />
      )}
      {modal === 'register' && (
        <RegisterModal
          onClose={()          => setModal(null)}
          onSwitchToLogin={() => setModal('login')}
        />
      )}
    </>
  )
}

import { useState } from 'react'
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

export default function LandingPage() {
  const [modal, setModal] = useState(null) // 'login' | 'register' | null

  const scrollComo = () =>
    document.getElementById('como')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <Navbar
        onLoginClick={()    => setModal('login')}
        onRegisterClick={() => setModal('register')}
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

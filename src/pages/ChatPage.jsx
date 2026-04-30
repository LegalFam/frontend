import { useEffect, useRef, useState } from 'react'
import { useChat }        from '@/hooks/useChat'
import { useAuth }        from '@/hooks/useAuth'
import ChatSidebar        from '@/components/chat/ChatSidebar'
import ChatMessage        from '@/components/chat/ChatMessage'
import ChatInput          from '@/components/chat/ChatInput'
import TypingIndicator    from '@/components/chat/TypingIndicator'
import logoImg            from '@/assets/logo.png'
import styles             from './ChatPage.module.css'

export default function ChatPage() {
  const { signout } = useAuth()
  const isMobile = () => window.innerWidth <= 768
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobile())

  const {
    sessions, activeSessionId, messages, loading,
    loadSessions, selectSession, startNewChat,
    sendMessage, rateMessage, deleteSession, renameSession,
  } = useChat()

  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadSessions().then(() => startNewChat())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const closeSidebarOnMobile = () => {
    if (isMobile()) setSidebarOpen(false)
  }

  const activeKey      = activeSessionId || 'new'
  const activeMessages = messages[activeKey] || []
  const sessionTitle   = activeSessionId
    ? sessions.find((s) => s.id === activeSessionId)?.name || 'Consulta'
    : 'Nueva consulta'

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <button className="icon-btn" onClick={() => setSidebarOpen((p) => !p)} aria-label="Toggle sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className={styles.topbarLogo}>
          <img src={logoImg} alt="LegalFam" className={styles.topbarLogoImg} />
          <span className={styles.topbarLogoText}>LEGALFAM</span>
        </div>

        <span className={styles.topbarTitle}>{sessionTitle}</span>

        <button className="icon-btn" onClick={signout} title="Cerrar sesión" style={{ marginLeft: 'auto' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </header>

      <div className={styles.body}>
        {/* Backdrop overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div className={styles.backdrop} onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        )}

        <ChatSidebar
          open={sidebarOpen}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={selectSession}
          onNewChat={startNewChat}
          onRenameSession={renameSession}
          onDeleteSession={deleteSession}
          onClose={closeSidebarOnMobile}
        />

        <div className={styles.main}>
          <div className={styles.messages}>
            <div className={styles.messagesInner}>
              {activeMessages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} onRate={rateMessage} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <ChatInput onSend={sendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  )
}

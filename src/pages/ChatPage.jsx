import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useChat }        from '@/hooks/useChat'
import { useAuth }        from '@/hooks/useAuth'
import { useEdgeSafeTooltip } from '@/hooks/useEdgeSafeTooltip'
import { usePaymentStore } from '@/store/paymentStore'
import ChatSidebar        from '@/components/chat/ChatSidebar'
import ChatMessage        from '@/components/chat/ChatMessage'
import ChatInput          from '@/components/chat/ChatInput'
import BillingDialog      from '@/components/billing/BillingDialog'
import TypingIndicator    from '@/components/chat/TypingIndicator'
import logoImg            from '@/assets/logo-transparent.png'
import SelectorIdioma from '@/components/common/SelectorIdioma'
import TextoLegalBilingue from '@/components/common/TextoLegalBilingue'
import { useT }           from '@/i18n/traducir'
import styles             from './ChatPage.module.css'

// Se traducen tanto el rótulo como la pregunta: la pregunta se envía tal cual como mensaje
// del usuario, así que tiene que estar en la lengua en la que el usuario la habría escrito.
const CONVERSATION_PRESETS = ['alimentos', 'tenencia', 'filiacion', 'proteccion']

export default function ChatPage() {
  const t = useT()
  const { signout } = useAuth()
  const { sessionId: routeSessionId } = useParams()
  const isMobile = () => window.innerWidth <= 960
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobile())
  const [billingOpen, setBillingOpen] = useState(false)
  const [glossaryTerm, setGlossaryTerm] = useState(null)
  const { subscription, refreshBilling } = usePaymentStore()

  const {
    sessions, sessionsNextCursor, sessionsLoading, sessionsLoadingMore,
    activeSessionId, messages, messagesNextCursors, messagesLoadingMore,
    loading, processingStatus, connectionState, error, drafts,
    loadSessions, loadMoreSessions, loadMoreMessages, selectSession, startNewChat,
    sendMessage, retryMessage, rateMessage, deleteSession, renameSession,
  } = useChat()

  const messagesContainerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const loadingOlderMessagesRef = useRef(false)
  const { ref: tokenTooltipRef, recalc: recalcTokenTooltip } = useEdgeSafeTooltip()

  const activeKey      = activeSessionId || 'new'
  const activeMessages = messages[activeKey] || []
  const activeSessionProcessing = processingStatus?.processing &&
    processingStatus.chatSessionId &&
    processingStatus.chatSessionId === activeSessionId
  const hasMoreMessages = Boolean(activeSessionId && messagesNextCursors[activeSessionId])
  const messagesLoadingMoreForActive = Boolean(activeSessionId && messagesLoadingMore[activeSessionId])

  useEffect(() => {
    loadSessions()
    refreshBilling().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (routeSessionId) {
      selectSession(routeSessionId, { updateRoute: false })
      return
    }
    startNewChat({ updateRoute: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSessionId])

  useEffect(() => {
    if (loadingOlderMessagesRef.current) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSessionId, activeMessages.length, loading])

  const closeSidebarOnMobile = () => {
    if (isMobile()) setSidebarOpen(false)
  }

  const handleSelectSession = (sessionId) => {
    setGlossaryTerm(null)
    selectSession(sessionId)
  }

  const handleNewChat = () => {
    setGlossaryTerm(null)
    startNewChat()
  }

  const showConnectionNotice = Boolean(error || (activeSessionId && connectionState === 'reconnecting'))
  const sessionTitle   = glossaryTerm
    ? `${t('chat.glosario.titulo')} · ${t(`glosario.${glossaryTerm}.termino`)}`
    : activeSessionId
      ? sessions.find((s) => s.id === activeSessionId)?.title || sessions.find((s) => s.id === activeSessionId)?.name || t('chat.consulta')
      : t('chat.consultaActual')
  const tokenLabel = subscription
    ? t('chat.tokensBadge', {
        plan: subscription.planCode,
        restantes: subscription.remainingTokens,
        limite: subscription.monthlyTokenLimit,
      })
    : null
  const showPresets = !activeSessionId &&
    activeMessages.length === 1 &&
    activeMessages[0]?.id === 'welcome'
  const inputDisabled = Boolean(loading || processingStatus?.processing)
  const inputDisabledReason = inputDisabled
    ? activeSessionProcessing
      ? t('chat.esperandoRespuesta')
      : t('chat.otraEnProceso')
    : null


  const handleMessagesScroll = async () => {
    const container = messagesContainerRef.current
    if (
      !container ||
      !activeSessionId ||
      !hasMoreMessages ||
      messagesLoadingMoreForActive ||
      loadingOlderMessagesRef.current ||
      container.scrollTop > 48
    ) {
      return
    }

    loadingOlderMessagesRef.current = true
    const previousScrollHeight = container.scrollHeight
    const previousScrollTop = container.scrollTop

    try {
      await loadMoreMessages(activeSessionId)
      window.requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight - previousScrollHeight + previousScrollTop
        loadingOlderMessagesRef.current = false
      })
    } catch {
      loadingOlderMessagesRef.current = false
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <button className="icon-btn" onClick={() => setSidebarOpen((p) => !p)} aria-label={t('chat.abrirHistorial')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link to="/" className={styles.topbarLogo} aria-label={t('chat.irAlInicio')}>
          <img src={logoImg} alt="LegalFam" className={styles.topbarLogoImg} />
          <span className={styles.topbarLogoText}>LEGALFAM</span>
        </Link>

        <span className={styles.topbarTitle}>{sessionTitle}</span>
        {tokenLabel && (
          <span
            className={styles.tokenControl}
            onPointerEnter={recalcTokenTooltip}
            onFocus={recalcTokenTooltip}
          >
            <button
              type="button"
              className={styles.tokenBadge}
              onClick={() => setBillingOpen(true)}
              title={t('chat.verPlanYTokens')}
              aria-describedby="token-cost-hint"
            >
              {tokenLabel}
              <svg
                className={styles.tokenInfoIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="11" x2="12" y2="16.5"/>
                <line x1="12" y1="7.5" x2="12" y2="7.5"/>
              </svg>
            </button>
            <span
              id="token-cost-hint"
              className={styles.tooltip}
              role="note"
              ref={tokenTooltipRef}
            >
              {t('facturacion.costeTokens')}
            </span>
          </span>
        )}

        {/* El mismo control en sus dos formas: ancha cuando la barra da de sí, compacta
            cuando no. El CSS decide cuál se ve; ambas escriben en el mismo store. */}
        <SelectorIdioma className={styles.topbarIdioma} />
        <SelectorIdioma compacto className={styles.topbarIdiomaCompacto} />

        {/* En móvil este botón se oculta: el cajón ya tiene uno en la fila de usuario. */}
        <button className={`icon-btn ${styles.topbarSignout}`} onClick={signout} title={t('chat.cerrarSesion')}>
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
          hasMoreSessions={Boolean(sessionsNextCursor)}
          loadingSessions={sessionsLoading}
          loadingMoreSessions={sessionsLoadingMore}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onLoadMoreSessions={loadMoreSessions}
          onNewChat={handleNewChat}
          onRenameSession={renameSession}
          onDeleteSession={deleteSession}
          onSelectGlossaryTerm={setGlossaryTerm}
          activeGlossaryTerm={glossaryTerm}
          onClose={closeSidebarOnMobile}
        />

        <div className={styles.main}>
          {glossaryTerm ? (
            <div className={styles.glossaryView}>
              <article className={styles.glossaryCard}>
                <span className={styles.glossaryEyebrow}>{t('chat.glosario.titulo')}</span>
                <h1>{t(`glosario.${glossaryTerm}.termino`)}</h1>
                <TextoLegalBilingue>
                  {(tLegal) => (
                    <>
                      <p>{tLegal(`glosario.${glossaryTerm}.definicion`)}</p>
                      <p className={styles.glossaryNote}>{tLegal('chat.glosario.nombresEnEspanol')}</p>
                    </>
                  )}
                </TextoLegalBilingue>
                <div className={styles.glossaryActions}>
                  <button
                    type="button"
                    className={styles.glossaryBackBtn}
                    onClick={() => setGlossaryTerm(null)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
                      <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    {t('chat.glosario.volver')}
                  </button>
                </div>
              </article>
            </div>
          ) : (
          <>
          {showConnectionNotice && (
            <div className={styles.notice}>
              {error || t('chat.reconectando')}
            </div>
          )}
          <div
            className={styles.messages}
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
          >
            <div className={styles.messagesInner}>
              {messagesLoadingMoreForActive && (
                <div className={styles.historyLoader}>{t('chat.cargandoAnteriores')}</div>
              )}
              {activeMessages.map((msg, index) => {
                const isLastMessage = index === activeMessages.length - 1
                const isErrorMessage = msg.isError || msg.role === 'SYSTEM'
                const previousUserMessage = activeMessages
                  .slice(0, index)
                  .reverse()
                  .find((item) => item.role === 'USER')
                const retryText = isLastMessage && isErrorMessage && msg.errorCode !== 'insufficient_tokens'
                  ? msg.retryText || previousUserMessage?.content
                  : null
                return (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onRate={rateMessage}
                    onRetry={retryMessage}
                    retryText={retryText}
                    onUpgrade={() => setBillingOpen(true)}
                  />
                )
              })}
              {showPresets && (
                <div className={styles.presets}>
                  <p className={styles.presetsLabel}>{t('chat.presetsLabel')}</p>
                  <div className={styles.presetsGrid}>
                    {CONVERSATION_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={styles.presetBtn}
                        onClick={() => sendMessage(t(`chat.presets.${preset}Pregunta`))}
                        disabled={inputDisabled}
                      >
                        <strong>{t(`chat.presets.${preset}Label`)}</strong>
                        <span>{t(`chat.presets.${preset}Pregunta`)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {(loading || activeSessionProcessing) && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <ChatInput
            onSend={sendMessage}
            disabled={inputDisabled}
            disabledReason={inputDisabledReason}
            draft={drafts[activeKey] || null}
          />
          </>
          )}
        </div>
      </div>

      {billingOpen && <BillingDialog onClose={() => setBillingOpen(false)} />}
    </div>
  )
}

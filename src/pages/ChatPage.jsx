import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useChat }        from '@/hooks/useChat'
import { useAuth }        from '@/hooks/useAuth'
import { usePaymentStore } from '@/store/paymentStore'
import {
  STATIC_PLANS,
  formatPlanName,
  formatPlanPrice,
  formatPlanPeriod,
  formatPlanTokens,
  planSlug,
} from '@/utils/plans'
import ChatSidebar        from '@/components/chat/ChatSidebar'
import ChatMessage        from '@/components/chat/ChatMessage'
import ChatInput          from '@/components/chat/ChatInput'
import TypingIndicator    from '@/components/chat/TypingIndicator'
import logoImg            from '@/assets/logo-transparent.png'
import styles             from './ChatPage.module.css'

const TOKEN_COST_HINT = 'Cada consulta descuenta tokens cuando la respuesta queda lista: 1 token para preguntas simples o no relacionadas con Derecho de Familia, y hasta 3 tokens cuando la respuesta se apoya en fuentes legales.'

const CONVERSATION_PRESETS = [
  { label: 'Alimentos', question: '¿Cómo solicito una pensión de alimentos para mi hijo?' },
  { label: 'Tenencia', question: '¿Qué necesito para pedir la tenencia de mi hijo?' },
  { label: 'Filiación', question: '¿Cómo puedo reconocer legalmente a mi hijo o iniciar un proceso de filiación?' },
  { label: 'Medidas de protección', question: '¿Cómo solicito medidas de protección por violencia familiar?' },
]

export default function ChatPage() {
  const { signout } = useAuth()
  const navigate = useNavigate()
  const { sessionId: routeSessionId } = useParams()
  const isMobile = () => window.innerWidth <= 768
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobile())
  const [billingOpen, setBillingOpen] = useState(false)
  const [glossaryTerm, setGlossaryTerm] = useState(null)
  const { plans, subscription, refreshBilling, cancelSubscription, loading: billingLoading } = usePaymentStore()

  const {
    sessions, sessionsNextCursor, sessionsLoading, sessionsLoadingMore,
    activeSessionId, messages, messagesNextCursors, messagesLoadingMore,
    loading, processingStatus, connectionState, error,
    loadSessions, loadMoreSessions, loadMoreMessages, selectSession, startNewChat,
    sendMessage, retryMessage, rateMessage, deleteSession, renameSession,
  } = useChat()

  const messagesContainerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const loadingOlderMessagesRef = useRef(false)

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
    ? `Glosario · ${glossaryTerm.term}`
    : activeSessionId
      ? sessions.find((s) => s.id === activeSessionId)?.title || sessions.find((s) => s.id === activeSessionId)?.name || 'Consulta'
      : 'Consulta Actual'
  const tokenLabel = subscription
    ? `${subscription.planCode} · ${subscription.remainingTokens}/${subscription.monthlyTokenLimit} tokens`
    : null
  const availablePlans = plans.length ? plans : STATIC_PLANS
  const currentPlan = availablePlans.find((plan) => plan.code === subscription?.planCode)
  const tokenLimit = subscription?.monthlyTokenLimit || currentPlan?.monthlyTokenLimit || 0
  const remainingTokens = subscription?.remainingTokens ?? 0
  const usedTokens = Math.max(tokenLimit - remainingTokens, 0)
  const tokenPercent = tokenLimit ? Math.max(0, Math.min(100, (remainingTokens / tokenLimit) * 100)) : 0
  const showPresets = !activeSessionId &&
    activeMessages.length === 1 &&
    activeMessages[0]?.id === 'welcome'
  const inputDisabled = Boolean(loading || processingStatus?.processing)
  const inputDisabledReason = inputDisabled
    ? activeSessionProcessing
      ? 'Estamos preparando la respuesta de esta consulta. Cuando termine, se actualizarán tus tokens y podrás enviar otra.'
      : 'Hay otra consulta en proceso. Puedes revisar tus sesiones, pero espera a que termine para enviar una nueva.'
    : null

  const switchPlan = (plan) => {
    setBillingOpen(false)
    if (plan.code === subscription?.planCode) return
    navigate(`/pago/${planSlug(plan)}`)
  }

  const handleCancelSubscription = async () => {
    await cancelSubscription().catch(() => {})
  }

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
        <button className="icon-btn" onClick={() => setSidebarOpen((p) => !p)} aria-label="Abrir o cerrar historial">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link to="/" className={styles.topbarLogo} aria-label="Ir al inicio">
          <img src={logoImg} alt="LegalFam" className={styles.topbarLogoImg} />
          <span className={styles.topbarLogoText}>LEGALFAM</span>
        </Link>

        <span className={styles.topbarTitle}>{sessionTitle}</span>
        {tokenLabel && (
          <span className={styles.tokenControl}>
            <button
              type="button"
              className={styles.tokenBadge}
              onClick={() => setBillingOpen(true)}
              title="Ver plan y tokens"
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
            <span id="token-cost-hint" className={styles.tooltip} role="note">
              {TOKEN_COST_HINT}
            </span>
          </span>
        )}

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
                <span className={styles.glossaryEyebrow}>Glosario legal</span>
                <h1>{glossaryTerm.term}</h1>
                <p>{glossaryTerm.definition}</p>
                <div className={styles.glossaryActions}>
                  <button
                    type="button"
                    className={styles.glossaryBackBtn}
                    onClick={() => setGlossaryTerm(null)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
                      <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Volver al chat
                  </button>
                </div>
              </article>
            </div>
          ) : (
          <>
          {showConnectionNotice && (
            <div className={styles.notice}>
              {error || 'Reconectando con el chat...'}
            </div>
          )}
          <div
            className={styles.messages}
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
          >
            <div className={styles.messagesInner}>
              {messagesLoadingMoreForActive && (
                <div className={styles.historyLoader}>Cargando mensajes anteriores...</div>
              )}
              {activeMessages.map((msg, index) => {
                const isLastMessage = index === activeMessages.length - 1
                const isErrorMessage = msg.isError || msg.role === 'SYSTEM'
                const previousUserMessage = activeMessages
                  .slice(0, index)
                  .reverse()
                  .find((item) => item.role === 'USER')
                const retryText = isLastMessage && isErrorMessage
                  ? msg.retryText || previousUserMessage?.content
                  : null
                return (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onRate={rateMessage}
                    onRetry={retryMessage}
                    retryText={retryText}
                  />
                )
              })}
              {showPresets && (
                <div className={styles.presets}>
                  <p className={styles.presetsLabel}>Empieza con una consulta frecuente</p>
                  <div className={styles.presetsGrid}>
                    {CONVERSATION_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        className={styles.presetBtn}
                        onClick={() => sendMessage(preset.question)}
                        disabled={inputDisabled}
                      >
                        <strong>{preset.label}</strong>
                        <span>{preset.question}</span>
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
          />
          </>
          )}
        </div>
      </div>

      {billingOpen && subscription && (
        <div className={styles.modalLayer} role="presentation" onMouseDown={() => setBillingOpen(false)}>
          <section
            className={styles.billingDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="billing-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.dialogHeader}>
              <div>
                <p className={styles.dialogEyebrow}>Suscripción</p>
                <h2 id="billing-title">Plan y tokens</h2>
              </div>
              <button className="icon-btn" onClick={() => setBillingOpen(false)} aria-label="Cerrar">
                <svg viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.billingSummary}>
              <div>
                <span>Plan actual</span>
                <strong>{formatPlanName(currentPlan) || subscription.planCode}</strong>
              </div>
              <div>
                <span>Tokens disponibles</span>
                <strong>{remainingTokens}/{tokenLimit}</strong>
              </div>
            </div>

            <div className={styles.tokenMeterBlock}>
              <div className={styles.tokenMeterLabels}>
                <span>{usedTokens} usados</span>
                <span>{remainingTokens} restantes</span>
              </div>
              <div className={styles.tokenMeter} aria-hidden="true">
                <span style={{ width: `${tokenPercent}%` }} />
              </div>
              <p className={styles.tokenHint}>{TOKEN_COST_HINT}</p>
            </div>

            <div className={styles.planGrid}>
              {availablePlans.map((plan) => {
                const isCurrent = plan.code === subscription.planCode
                return (
                  <button
                    type="button"
                    key={plan.code}
                    className={`${styles.planOption} ${isCurrent ? styles.currentPlan : ''}`}
                    onClick={() => switchPlan(plan)}
                    disabled={isCurrent}
                  >
                    <span>{formatPlanName(plan)}</span>
                    <strong>{formatPlanPrice(plan)} {formatPlanPeriod(plan)}</strong>
                    <small>{formatPlanTokens(plan)}</small>
                    <em>{isCurrent ? 'Plan activo' : 'Cambiar plan'}</em>
                  </button>
                )
              })}
            </div>
            {subscription.provider === 'MERCADO_PAGO' && (
              <button
                type="button"
                className={styles.cancelSubscriptionBtn}
                onClick={handleCancelSubscription}
                disabled={billingLoading}
              >
                {billingLoading ? 'Cancelando...' : 'Cancelar suscripción'}
              </button>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

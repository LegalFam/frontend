import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import { useAuth } from '@/hooks/useAuth'
import { LEGAL_GLOSSARY } from './legalGlossary'
import { useT } from '@/i18n/translate'
import styles from './ChatSidebar.module.css'

const normalize = (value) =>
  (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

// La fecha se formatea en es-PE: Intl no tiene datos de quechua ni de aymara.
const formatDate = (iso, textoPorDefecto) => {
  if (!iso) return textoPorDefecto
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
}

const sessionLabel = (session, textoPorDefecto) =>
  session.title || session.name || formatDate(session.createdAt, textoPorDefecto)

export default function ChatSidebar({
  open,
  sessions,
  activeSessionId,
  hasMoreSessions,
  loadingSessions,
  loadingMoreSessions,
  onSelectSession,
  onLoadMoreSessions,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  onSelectGlossaryTerm,
  activeGlossaryTerm,
  onClose,
}) {
  const t = useT()
  const { user, signout } = useAuth()
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [query, setQuery] = useState('')
  const [glossaryOpen, setGlossaryOpen] = useState(true)

  const filteredSessions = useMemo(() => {
    const term = normalize(query).trim()
    if (!term) return sessions
    return sessions.filter((s) => normalize(sessionLabel(s, t('chat.consulta'))).includes(term))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, query, t.idioma])

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'LF'

  const startEdit = (e, session) => {
    e.stopPropagation()
    setEditingId(session.id)
    setEditValue(session.title || session.name || '')
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') setQuery('')
  }

  const saveEdit = (sessionId) => {
    onRenameSession(sessionId, editValue.trim() || t('chat.consulta'))
    setEditingId(null)
  }

  const handleKeyDown = (e, sessionId) => {
    if (e.key === 'Enter') saveEdit(sessionId)
    if (e.key === 'Escape') setEditingId(null)
  }

  const handleSelectSession = (id) => {
    onSelectSession(id)
    onClose?.()
  }

  const handleSelectGlossaryTerm = (entry) => {
    onSelectGlossaryTerm(entry)
    onClose?.()
  }

  const handleNewChat = () => {
    onNewChat()
    onClose?.()
  }

  const askDeleteSession = (e, session) => {
    e.stopPropagation()
    setDeleteTarget(session)
  }

  const confirmDeleteSession = () => {
    if (!deleteTarget) return
    onDeleteSession(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <aside className={`${styles.sidebar} ${!open ? styles.closed : ''}`}>
      {/* En móvil el logo no cabe en la barra superior sin quedar aplastado, así que la marca
          —y con ella el enlace a la portada— vive aquí, en la cabecera del cajón. */}
      <Link to="/" className={styles.brandRow} onClick={onClose} aria-label={t('chat.irAlInicio')}>
        <img src={logoImg} alt="LegalFam" className={styles.brandLogo} />
        <span className={styles.brandText}>LEGALFAM</span>
      </Link>

      <button className={styles.newBtn} onClick={handleNewChat}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        {t('chat.sidebar.nueva')}
      </button>

      <div className={styles.listLabel}>{t('chat.sidebar.historial')}</div>

      {sessions.length > 0 && (
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.searchInput}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t('chat.sidebar.buscar')}
            aria-label={t('chat.sidebar.buscarAria')}
          />
          {query && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setQuery('')}
              title={t('chat.sidebar.limpiarBusqueda')}
              aria-label={t('chat.sidebar.limpiarBusqueda')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      )}

      <div className={styles.list}>
        {loadingSessions && sessions.length === 0 && (
          <p className={styles.emptyMsg}>{t('chat.sidebar.cargandoHistorial')}</p>
        )}
        {!loadingSessions && sessions.length === 0 && (
          <p className={styles.emptyMsg}>
            {t('chat.sidebar.sinConsultas')}<br/>{t('chat.sidebar.primeraPregunta')}
          </p>
        )}
        {sessions.length > 0 && filteredSessions.length === 0 && (
          <p className={styles.emptyMsg}>{t('chat.sidebar.sinResultados')}</p>
        )}
        {filteredSessions.map((s) => (
          <div
            key={s.id}
            className={`${styles.item} ${s.id === activeSessionId ? styles.active : ''}`}
            onClick={() => handleSelectSession(s.id)}
          >
            <svg className={styles.itemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>

            {editingId === s.id ? (
              <input
                className={styles.editInput}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(s.id)}
                onKeyDown={(e) => handleKeyDown(e, s.id)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <span className={styles.name}>{sessionLabel(s, t('chat.consulta'))}</span>
            )}

            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={(e) => startEdit(e, s)} title={t('chat.sidebar.renombrar')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button className={styles.actionBtn} onClick={(e) => askDeleteSession(e, s)} title={t('chat.sidebar.eliminar')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
        {hasMoreSessions && (
          <button
            type="button"
            className={styles.loadMoreBtn}
            onClick={onLoadMoreSessions}
            disabled={loadingMoreSessions}
          >
            {loadingMoreSessions ? t('comun.cargando') : t('chat.sidebar.cargarMas')}
          </button>
        )}
      </div>

      <button
        type="button"
        className={styles.glossaryHeader}
        onClick={() => setGlossaryOpen((v) => !v)}
        aria-expanded={glossaryOpen}
        title={glossaryOpen ? t('chat.sidebar.ocultarGlosario') : t('chat.sidebar.mostrarGlosario')}
      >
        <span>{t('chat.glosario.titulo')}</span>
        <svg
          className={`${styles.glossaryChevron} ${glossaryOpen ? styles.glossaryChevronOpen : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {glossaryOpen && (
        <div className={styles.glossary}>
          {LEGAL_GLOSSARY.map((clave) => (
            <button
              key={clave}
              type="button"
              className={`${styles.glossaryItem} ${activeGlossaryTerm === clave ? styles.glossaryItemActive : ''}`}
              onClick={() => handleSelectGlossaryTerm(clave)}
            >
              <svg className={styles.itemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              {t(`glosario.${clave}.termino`)}
            </button>
          ))}
        </div>
      )}

      <div className={styles.userRow}>
        <Link
          to="/configuracion"
          className={styles.userLink}
          onClick={onClose}
          title={t('chat.sidebar.irAConfiguracion')}
        >
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || t('chat.sidebar.usuario')}</span>
            <span className={styles.userEmail}>{user?.email || ''}</span>
          </div>
        </Link>
        <button className={styles.logoutBtn} onClick={signout} title={t('chat.cerrarSesion')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

      {deleteTarget && (
        <div className={styles.confirmLayer} role="presentation" onMouseDown={() => setDeleteTarget(null)}>
          <section
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-session-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="delete-session-title">{t('chat.sidebar.eliminarTitulo')}</h2>
            <p>{t('chat.sidebar.eliminarTexto', { titulo: sessionLabel(deleteTarget, t('chat.consulta')) })}</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>
                {t('comun.cancelar')}
              </button>
              <button className={styles.deleteBtn} onClick={confirmDeleteSession}>
                {t('chat.sidebar.eliminar')}
              </button>
            </div>
          </section>
        </div>
      )}
    </aside>
  )
}

import { useState } from 'react'
import logoImg from '@/assets/logo-transparent.png'
import { useAuth } from '@/hooks/useAuth'
import styles from './ChatSidebar.module.css'

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
  onClose,
}) {
  const { user, signout } = useAuth()
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'LF'

  const startEdit = (e, session) => {
    e.stopPropagation()
    setEditingId(session.id)
    setEditValue(session.title || session.name || '')
  }

  const saveEdit = (sessionId) => {
    onRenameSession(sessionId, editValue.trim() || 'Consulta')
    setEditingId(null)
  }

  const handleKeyDown = (e, sessionId) => {
    if (e.key === 'Enter') saveEdit(sessionId)
    if (e.key === 'Escape') setEditingId(null)
  }

  const formatDate = (iso) => {
    if (!iso) return 'Consulta'
    return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
  }

  const handleSelectSession = (id) => {
    onSelectSession(id)
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
      <div className={styles.sidebarLogo}>
        <img src={logoImg} alt="LegalFam" className={styles.sidebarLogoImg} />
        <span className={styles.sidebarLogoText}>LEGALFAM</span>
      </div>

      <button className={styles.newBtn} onClick={handleNewChat}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nueva consulta
      </button>

      <div className={styles.listLabel}>Historial</div>

      <div className={styles.list}>
        {loadingSessions && sessions.length === 0 && (
          <p className={styles.emptyMsg}>Cargando historial...</p>
        )}
        {!loadingSessions && sessions.length === 0 && (
          <p className={styles.emptyMsg}>No hay consultas aun.<br/>Haz tu primera pregunta.</p>
        )}
        {sessions.map((s) => (
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
              <span className={styles.name}>{s.title || s.name || formatDate(s.createdAt)}</span>
            )}

            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={(e) => startEdit(e, s)} title="Renombrar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button className={styles.actionBtn} onClick={(e) => askDeleteSession(e, s)} title="Eliminar">
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
            {loadingMoreSessions ? 'Cargando...' : 'Cargar más'}
          </button>
        )}
      </div>

      <div className={styles.userRow}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name || 'Usuario'}</span>
          <span className={styles.userEmail}>{user?.email || ''}</span>
        </div>
        <button className={styles.logoutBtn} onClick={signout} title="Cerrar sesion">
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
            <h2 id="delete-session-title">Eliminar consulta</h2>
            <p>
              Se eliminara "{deleteTarget.title || deleteTarget.name || formatDate(deleteTarget.createdAt)}" del historial.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>
                Cancelar
              </button>
              <button className={styles.deleteBtn} onClick={confirmDeleteSession}>
                Eliminar
              </button>
            </div>
          </section>
        </div>
      )}
    </aside>
  )
}

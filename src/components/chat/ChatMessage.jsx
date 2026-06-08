import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './ChatMessage.module.css'

const normalizeMarkdownContent = (content) => {
  if (typeof content !== 'string') return ''
  const trimmed = content.trim()
  if (!trimmed.startsWith('"') || !trimmed.endsWith('"')) return content

  try {
    const parsed = JSON.parse(trimmed)
    return typeof parsed === 'string' ? parsed : content
  } catch {
    return content
  }
}

const normalizeTextField = (value) => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed.startsWith('"') || !trimmed.endsWith('"')) return trimmed

  try {
    const parsed = JSON.parse(trimmed)
    return typeof parsed === 'string' ? parsed.trim() : trimmed
  } catch {
    return trimmed.replace(/^"+|"+$/g, '').trim()
  }
}

const normalizeSourceUrl = (value) => {
  const cleaned = normalizeTextField(value)
  if (!cleaned) return ''

  try {
    return new URL(cleaned).href
  } catch {
    return cleaned
  }
}

export default function ChatMessage({ message, onRate }) {
  const isBot = message.role === 'ASSISTANT'
  const isSystem = message.role === 'SYSTEM'
  const isUser = message.role === 'USER'
  const markdownContent = normalizeMarkdownContent(message.content)
  const citations = (message.citations || [])
    .map((citation) => ({
      sourceTitle: normalizeTextField(citation.sourceTitle) || 'Fuente legal',
      sourceSnippet: normalizeTextField(citation.sourceSnippet),
      sourceUrl: normalizeSourceUrl(citation.sourceUrl),
    }))
    .filter((citation) => citation.sourceTitle || citation.sourceSnippet || citation.sourceUrl)
  const [rated, setRated] = useState(message.rating || 0)
  const [comment, setComment] = useState(message.feedbackComment || '')
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [ratingPending, setRatingPending] = useState(false)
  const [hover, setHover] = useState(0)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const clarifyingQuestions = Array.isArray(message.clarifyingQuestions) ? message.clarifyingQuestions : []
  const preliminaryActions = Array.isArray(message.preliminaryActions) ? message.preliminaryActions : []
  const lowConfidence = message.confidenceStatus === 'LOW'

  const handleRate = async (stars) => {
    if (!message.id || message.id.startsWith('tmp_') || message.id === 'welcome') return
    const previous = rated
    setRated(stars)
    setRatingPending(true)
    try {
      await onRate?.(message.id, stars, comment)
      setFeedbackOpen(false)
    } catch {
      setRated(previous)
    } finally {
      setRatingPending(false)
    }
  }

  return (
    <div className={`${styles.wrap} ${isUser ? styles.user : styles.bot} ${isSystem ? styles.system : ''}`}>
      <span className={styles.label}>{isUser ? 'Tu' : isSystem ? 'Sistema' : 'LegalFam'}</span>

      <div className={styles.bubble}>
        {isBot || isSystem ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            allowedElements={['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'code', 'pre', 'a', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td']}
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        ) : (
          message.content
        )}
      </div>

      {message.state === 'sending' && <span className={styles.status}>Enviando...</span>}
      {message.state === 'processing' && <span className={styles.status}>Procesando...</span>}
      {message.state === 'unknown_delivery' && <span className={styles.status}>Verificando entrega...</span>}

      {isBot && (lowConfidence || message.confidenceReason) && (
        <div className={styles.safetyNote}>
          <strong>{lowConfidence ? 'Evidencia limitada' : 'Nota de alcance'}</strong>
          {message.confidenceReason && <span>{message.confidenceReason}</span>}
        </div>
      )}

      {isBot && preliminaryActions.length > 0 && (
        <div className={styles.guidanceBlock}>
          <span className={styles.blockTitle}>Opciones preliminares</span>
          <ul>{preliminaryActions.map((item, index) => <li key={index}>{item}</li>)}</ul>
        </div>
      )}

      {isBot && clarifyingQuestions.length > 0 && (
        <div className={styles.guidanceBlock}>
          <span className={styles.blockTitle}>Datos generales utiles</span>
          <ul>{clarifyingQuestions.map((item, index) => <li key={index}>{item}</li>)}</ul>
        </div>
      )}

      {isBot && citations.length > 0 && (
        <div className={styles.citations}>
          <button type="button" className={styles.sourcesToggle} onClick={() => setSourcesOpen((open) => !open)} aria-expanded={sourcesOpen}>
            <span>Fuentes utilizadas</span>
            <span className={styles.sourcesCount}>{citations.length}</span>
          </button>

          {sourcesOpen && (
            <div className={styles.sourcesPanel}>
              {citations.map((citation, index) => (
                <div key={index} className={styles.citation}>
                  <div className={styles.citationTitle}>{citation.sourceTitle}</div>
                  {citation.sourceSnippet && <div className={styles.citationSnippet}>{citation.sourceSnippet}</div>}
                  {citation.sourceUrl && (
                    <a href={citation.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.citationLink}>
                      Ver fuente
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isBot && message.id && !message.id.startsWith('tmp_') && message.id !== 'welcome' && !message.isError && (
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`${styles.star} ${n <= (hover || rated) ? styles.starActive : ''}`}
              onClick={() => handleRate(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              disabled={ratingPending}
              title={`Calificar ${n} estrella${n > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
          <button type="button" className={styles.feedbackToggle} onClick={() => setFeedbackOpen((open) => !open)} disabled={ratingPending}>
            Comentario
          </button>
          {ratingPending && <span className={styles.ratingStatus}>Guardando...</span>}
        </div>
      )}

      {isBot && feedbackOpen && (
        <div className={styles.feedbackBox}>
          <textarea
            value={comment}
            maxLength={1000}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comentario opcional sobre la respuesta"
          />
          <button type="button" onClick={() => handleRate(rated || 5)} disabled={ratingPending}>
            Guardar feedback
          </button>
        </div>
      )}
    </div>
  )
}

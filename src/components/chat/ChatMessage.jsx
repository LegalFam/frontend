import { useState } from 'react'
import { Link } from 'react-router-dom'
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

const LOCATOR_KINDS = new Set(['exact', 'prefix', 'fuzzy'])

function groupCitationsByDocument(citations) {
  const groups = []
  const byKey = new Map()

  for (const citation of citations) {
    const key = citation.sourceUrl || citation.sourceTitle
    let group = byKey.get(key)
    if (!group) {
      group = { key, sourceTitle: citation.sourceTitle, sourceUrl: citation.sourceUrl, entries: [] }
      byKey.set(key, group)
      groups.push(group)
    }
    group.entries.push(citation)
  }

  return groups
}

export default function ChatMessage({ message, onRate, onRetry, retryText }) {
  const isBot = message.role === 'ASSISTANT'
  const isSystem = message.role === 'SYSTEM'
  const isUser = message.role === 'USER'
  const markdownContent = normalizeMarkdownContent(message.content)
  const citations = (message.citations || [])
    .map((citation) => ({
      sourceTitle: normalizeTextField(citation.sourceTitle) || 'Fuente legal',
      sourceSnippet: normalizeTextField(citation.sourceSnippet),
      sourceUrl: normalizeSourceUrl(citation.sourceUrl),
      // Solo exact/prefix/fuzzy son una ubicacion juridica. markdown_heading es el asunto
      // del caso o ruido del OCR en resoluciones sin articulado: ahi no se muestra nada,
      // porque el titulo de la cita ya dice lo mismo.
      sourceLocator: LOCATOR_KINDS.has(citation.sourceLocatorKind)
        ? normalizeTextField(citation.sourceLocator)
        : '',
      sourceBreadcrumb: normalizeTextField(citation.sourceBreadcrumb),
    }))
    .filter((citation) => citation.sourceTitle || citation.sourceSnippet || citation.sourceUrl)

  // Un documento puede aportar varias citas, una por articulo. Se agrupan para que la
  // lista de fuentes no crezca, sin perder la precision por articulo.
  const citationGroups = groupCitationsByDocument(citations)
  const [rated, setRated] = useState(message.rating || 0)
  const [comment, setComment] = useState(message.feedbackComment || '')
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [ratingPending, setRatingPending] = useState(false)
  const [hover, setHover] = useState(0)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const nextSteps = Array.isArray(message.nextSteps) ? message.nextSteps : []
  const citationSupportStatus = ['GOOD', 'WEAK', 'NONE'].includes(message.citationSupportStatus)
    ? message.citationSupportStatus
    : null
  const lowConfidence = message.confidenceStatus === 'LOW'
  const showLowConfidenceFallback = lowConfidence && !citationSupportStatus
  const canRetry = isSystem && retryText && !message.retryAttempted
  const citationNotice = citationSupportStatus === 'WEAK'
    ? {
        title: 'Fuentes de apoyo limitadas',
        text: 'Estas fuentes pueden orientar, pero no respaldan de forma directa todos los puntos de la respuesta.',
      }
    : citationSupportStatus === 'NONE'
      ? {
          title: 'Sin fuentes recuperadas',
          text: 'Esta orientación es general y debe verificarse con una fuente oficial o asesoría especializada antes de tomar decisiones.',
        }
      : null

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

      {isBot && message.specialistSupportRecommended === true && (
        <div className={styles.specialistNotice} role="note">
          <div className={styles.specialistText}>
            <strong>Apoyo especializado recomendado</strong>
            <span>
              Por el tipo de situación, considera acudir a una entidad especializada como CEM, PNP o DEMUNA, según corresponda, para recibir orientación y protección directa.
            </span>
          </div>
          <Link className={styles.specialistLink} to="/contactos-emergencia">
            Ver contactos de emergencia
          </Link>
        </div>
      )}

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
      {message.state === 'failed' && <span className={styles.status}>No enviado</span>}

      {canRetry && (
        <button
          type="button"
          className={styles.retryBtn}
          onClick={() => onRetry?.(retryText, message.id)}
        >
          Reintentar consulta
        </button>
      )}

      {isBot && citationNotice && (
        <div className={styles.citationNotice}>
          <strong>{citationNotice.title}</strong>
          <span>{citationNotice.text}</span>
        </div>
      )}

      {isBot && showLowConfidenceFallback && (
        <div className={styles.safetyNote}>
          <strong>Información de alcance limitado</strong>
          <span>Esta orientación es general y puede no cubrir todos los detalles de tu caso. Para decisiones importantes, consulta con un abogado o una entidad competente.</span>
        </div>
      )}

      {isBot && nextSteps.length > 0 && (
        <div className={styles.guidanceBlock}>
          <span className={styles.blockTitle}>Siguientes pasos</span>
          <ul>{nextSteps.map((item, index) => <li key={index}>{item}</li>)}</ul>
        </div>
      )}

      {isBot && citations.length > 0 && (
        <div className={styles.citations}>
          <button type="button" className={styles.sourcesToggle} onClick={() => setSourcesOpen((open) => !open)} aria-expanded={sourcesOpen}>
            <span>Fuentes utilizadas</span>
            <span className={styles.sourcesCount}>{citationGroups.length}</span>
          </button>

          {sourcesOpen && (
            <div className={styles.sourcesPanel}>
              {citationGroups.map((group, groupIndex) => (
                <div key={group.key || groupIndex} className={styles.citation}>
                  <div className={styles.citationTitle}>{group.sourceTitle}</div>

                  {group.entries.map((entry, entryIndex) => (
                    <div key={entryIndex} className={styles.citationEntry}>
                      {entry.sourceLocator && (
                        <div className={styles.citationLocator} title={entry.sourceBreadcrumb || undefined}>
                          {entry.sourceLocator}
                        </div>
                      )}
                      {entry.sourceSnippet && <div className={styles.citationSnippet}>{entry.sourceSnippet}</div>}
                    </div>
                  ))}

                  {group.sourceUrl && (
                    <a href={group.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.citationLink}>
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

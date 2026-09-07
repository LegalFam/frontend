import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { avisoTraduccion, idiomaPorCodigo } from '@/i18n/languages'
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

const passageKeyText = (value) => String(value || '').toLowerCase().replace(/[^0-9a-záéíóúüñ]+/g, '')

// El asistente puede citar dos veces el mismo pasaje del mismo articulo y redactar un
// resumen distinto para cada copia; el segundo dice lo mismo con otras palabras. Sin esto
// el articulo aparece repetido. El recorte del pasaje lo elige el modelo, asi que dos
// copias del mismo tramo pueden diferir en los bordes: se comparan por contencion.
const isSamePassage = (a, b) => {
  if (a.sourceLocator !== b.sourceLocator) return false

  const left = passageKeyText(a.sourceOriginalSnippet)
  const right = passageKeyText(b.sourceOriginalSnippet)
  if (!left || !right) return left === right
  return left.includes(right) || right.includes(left)
}

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
    // El flujo ya deduplica, pero las conversaciones guardadas antes traen el duplicado
    // persistido: se filtra tambien al mostrar.
    if (group.entries.some((entry) => isSamePassage(entry, citation))) continue
    group.entries.push(citation)
  }

  return groups
}

// El pasaje literal puede ocupar varias lineas y empuja el resumen fuera de la vista.
// Se muestra recortado a dos lineas y se despliega a pedido.
function CitationQuote({ text }) {
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)
  const textRef = useRef(null)

  // El boton solo aparece si el pasaje realmente se corta, y eso depende del ancho, no del
  // largo del texto: se mide contra el alto real del elemento recortado. Mientras esta
  // desplegado no se vuelve a medir, porque sin recorte no habria nada que detectar.
  useLayoutEffect(() => {
    const node = textRef.current
    if (!node || expanded) return undefined

    // Sin ancho todavia no hay recorte que medir: cada palabra caeria en su propia linea y
    // hasta un pasaje de una linea pareceria cortado. El observer vuelve a medir despues.
    const measure = () => {
      if (!node.clientWidth) return
      setClamped(node.scrollHeight - node.clientHeight > 1)
    }
    measure()

    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [text, expanded])

  return (
    <blockquote className={styles.citationQuote}>
      <span className={styles.citationLabel}>Texto de la fuente</span>
      <div
        ref={textRef}
        className={`${styles.citationQuoteText} ${expanded ? styles.citationQuoteTextExpanded : ''}`}
      >
        {text}
      </div>
      {clamped && (
        <button
          type="button"
          className={styles.citationQuoteToggle}
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </blockquote>
  )
}

export default function ChatMessage({ message, onRate, onRetry, retryText, onUpgrade }) {
  const isBot = message.role === 'ASSISTANT'
  const isSystem = message.role === 'SYSTEM'
  const isUser = message.role === 'USER'

  // El español es siempre la versión canónica y nunca se descarta. Cuando la conversación
  // es en quechua o aymara se muestra la traducción, con un conmutador para ver el original:
  // es la única forma de que el usuario, o un abogado que lo acompañe, pueda contrastar la
  // orientación contra las normas citadas, que solo existen en español.
  const translated = normalizeTextField(message.contentLocalized)
  const isTranslated = Boolean(translated) && message.language && message.language !== 'es'
  const translationNotice = avisoTraduccion(message.language)
  const [showSpanish, setShowSpanish] = useState(false)
  const markdownContent = normalizeMarkdownContent(
    isTranslated && !showSpanish ? translated : message.content
  )

  const nextStepsTranslated = Array.isArray(message.nextStepsLocalized)
    ? message.nextStepsLocalized
    : []

  const citations = (message.citations || [])
    .map((citation) => ({
      sourceTitle: normalizeTextField(citation.sourceTitle) || 'Fuente legal',
      // Solo el resumen se traduce; el pasaje literal de abajo se queda en español.
      sourceSnippet: normalizeTextField(
        isTranslated && !showSpanish && citation.sourceSnippetLocalized
          ? citation.sourceSnippetLocalized
          : citation.sourceSnippet
      ),
      // El pasaje literal del documento, del que sale la ubicacion. Se muestra aparte del
      // resumen para que se vea que dice la fuente y que agrego el asistente.
      sourceOriginalSnippet: normalizeTextField(citation.sourceOriginalSnippet),
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
  const spanishNextSteps = Array.isArray(message.nextSteps) ? message.nextSteps : []
  // Si la traducción de los pasos falló o vino incompleta, se muestran los del español en
  // lugar de una lista a medias.
  const nextSteps = isTranslated && !showSpanish && nextStepsTranslated.length === spanishNextSteps.length
    ? nextStepsTranslated
    : spanishNextSteps
  const citationSupportStatus = ['GOOD', 'WEAK', 'NONE'].includes(message.citationSupportStatus)
    ? message.citationSupportStatus
    : null
  const lowConfidence = message.confidenceStatus === 'LOW'
  const showLowConfidenceFallback = lowConfidence && !citationSupportStatus
  const canRetry = isSystem && retryText && !message.retryAttempted
  const showUpgrade = isSystem && message.errorCode === 'insufficient_tokens'
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
          isTranslated && !showSpanish ? translated : message.content
        )}
      </div>

      {isTranslated && (
        <div className={styles.translationNotice}>
          <div className={styles.translationNoticeText}>
            {/* El aviso en la lengua del usuario primero: uno en español no cumple su
                función con quien eligió no leer en español. */}
            {translationNotice.propio && (
              <span lang={message.language}>{translationNotice.propio}</span>
            )}
            <span className={styles.translationNoticeSpanish}>{translationNotice.espanol}</span>
          </div>
          <button
            type="button"
            className={styles.translationToggle}
            onClick={() => setShowSpanish((open) => !open)}
            aria-pressed={showSpanish}
          >
            {showSpanish ? `Ver en ${idiomaPorCodigo(message.language).etiqueta}` : 'Ver en español'}
          </button>
        </div>
      )}


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

      {showUpgrade && (
        <button
          type="button"
          className={styles.upgradeBtn}
          onClick={() => onUpgrade?.()}
        >
          Ver planes y tokens
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
                      {entry.sourceOriginalSnippet && (
                        <CitationQuote text={entry.sourceOriginalSnippet} />
                      )}
                      {entry.sourceSnippet && (
                        <div className={styles.citationSnippet}>
                          {entry.sourceOriginalSnippet && (
                            <span className={styles.citationLabel}>Resumen del asistente</span>
                          )}
                          {entry.sourceSnippet}
                        </div>
                      )}
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

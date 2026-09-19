import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { TranslationNotice } from '@/components/common/BilingualLegalText'
import { languageByCode } from '@/i18n/languages'
import { tIn, tOptional, useT } from '@/i18n/translate'
import { useLanguageStore } from '@/store/languageStore'
import styles from './ChatMessage.module.css'

const INLINE_MARKDOWN_ELEMENTS = ['p', 'br', 'strong', 'em', 'code', 'a']

const InlineMarkdown = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    allowedElements={INLINE_MARKDOWN_ELEMENTS}
    components={{
      p: ({ children: content }) => <>{content}</>,
      a: ({ href, children: content }) => (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ),
    }}
  >
    {children}
  </ReactMarkdown>
)

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
    if (group.entries.some((entry) => isSamePassage(entry, citation))) continue
    group.entries.push(citation)
  }

  return groups
}

function CitationQuote({ text }) {
  const t = useT()
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)
  const textRef = useRef(null)

  useLayoutEffect(() => {
    const node = textRef.current
    if (!node || expanded) return undefined

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
      <span className={styles.citationLabel}>{t('chat.mensaje.textoFuente')}</span>
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
          {expanded ? t('comun.verMenos') : t('comun.verMas')}
        </button>
      )}
    </blockquote>
  )
}

export default function ChatMessage({ message, onRate, onRetry, retryText, onUpgrade }) {
  const t = useT()
  const isBot = message.role === 'ASSISTANT'
  const isSystem = message.role === 'SYSTEM'
  const isUser = message.role === 'USER'

  const contenidoBase = message.messageKey
    ? t(message.messageKey, message.messageVars)
    : (isSystem && message.errorCode && tOptional(`errores.${message.errorCode}`)) || message.content

  const translated = normalizeTextField(message.contentLocalized)
  const hasTranslation = Boolean(translated) && message.language && message.language !== 'es'
  const isTranslated = hasTranslation && !isUser
  const languageSwitched = Boolean(
    message.languageRequested && message.languageRequested !== message.language
  )
  const activeLanguage = useLanguageStore((state) => state.language)
  const changeLanguage = useLanguageStore((state) => state.changeLanguage)

  const [showSpanish, setShowSpanish] = useState(false)
  const showTranslated = hasTranslation && (isUser || !showSpanish)
  const markdownContent = normalizeMarkdownContent(
    showTranslated ? translated : contenidoBase
  )

  const nextStepsTranslated = Array.isArray(message.nextStepsLocalized)
    ? message.nextStepsLocalized
    : []

  const citations = (message.citations || [])
    .map((citation) => ({
      sourceTitle: normalizeTextField(citation.sourceTitle) || t('chat.mensaje.fuenteLegal'),
      sourceSnippet: normalizeTextField(
        isTranslated && !showSpanish && citation.sourceSnippetLocalized
          ? citation.sourceSnippetLocalized
          : citation.sourceSnippet
      ),
      sourceOriginalSnippet: normalizeTextField(citation.sourceOriginalSnippet),
      sourceUrl: normalizeSourceUrl(citation.sourceUrl),
      sourceLocator: LOCATOR_KINDS.has(citation.sourceLocatorKind)
        ? normalizeTextField(citation.sourceLocator)
        : '',
      sourceBreadcrumb: normalizeTextField(citation.sourceBreadcrumb),
    }))
    .filter((citation) => citation.sourceTitle || citation.sourceSnippet || citation.sourceUrl)

  const citationGroups = groupCitationsByDocument(citations)
  const [rated, setRated] = useState(message.rating || 0)
  const [comment, setComment] = useState(message.feedbackComment || '')
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [ratingPending, setRatingPending] = useState(false)
  const [hover, setHover] = useState(0)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const spanishNextSteps = Array.isArray(message.nextSteps) ? message.nextSteps : []
  const nextSteps = isTranslated && !showSpanish && nextStepsTranslated.length === spanishNextSteps.length
    ? nextStepsTranslated
    : spanishNextSteps
  const citationSupportStatus = ['GOOD', 'WEAK', 'NONE'].includes(message.citationSupportStatus)
    ? message.citationSupportStatus
    : null
  const lowConfidence = message.confidenceStatus === 'LOW'
  const showLowConfidenceFallback = lowConfidence && citationSupportStatus !== 'NONE'
  const canRetry = isSystem && retryText && !message.retryAttempted
  const showUpgrade = isSystem && message.errorCode === 'insufficient_tokens'
  const citationNotice = citationSupportStatus === 'WEAK'
    ? { title: t('chat.mensaje.fuentesDebilesTitulo'), text: t('chat.mensaje.fuentesDebilesTexto') }
    : citationSupportStatus === 'NONE'
      ? { title: t('chat.mensaje.sinFuentesTitulo'), text: t('chat.mensaje.sinFuentesTexto') }
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
      <span className={styles.label}>
        {isUser ? t('chat.mensaje.tu') : isSystem ? t('chat.mensaje.sistema') : 'LegalFam'}
      </span>

      {isBot && message.specialistSupportRecommended === true && (
        <div className={styles.specialistNotice} role="note">
          <div className={styles.specialistText}>
            <strong>{t('chat.mensaje.especialistaTitulo')}</strong>
            <span>{t('chat.mensaje.especialistaTexto')}</span>
          </div>
          <Link className={styles.specialistLink} to="/contactos-emergencia">
            {t('chat.mensaje.especialistaEnlace')}
          </Link>
        </div>
      )}

      {isBot && languageSwitched && (
        <div className={styles.languageNotice} role="note" lang={message.language}>
          <div className={styles.specialistText}>
            <strong>{tIn(message.language, 'chat.mensaje.idiomaDetectadoTitulo')}</strong>
            <span>
              {tIn(message.language, 'chat.mensaje.idiomaDetectadoTexto', {
                idioma: languageByCode(message.language).label,
                interfaz: languageByCode(message.languageRequested).label,
              })}
            </span>
          </div>
          {activeLanguage !== message.language && (
            <button
              type="button"
              className={styles.languageAction}
              onClick={() => changeLanguage(message.language)}
            >
              {tIn(message.language, 'chat.mensaje.idiomaDetectadoAccion', {
                idioma: languageByCode(message.language).label,
              })}
            </button>
          )}
        </div>
      )}

      {isTranslated && (
        <TranslationNotice
          language={message.language}
          showingSpanish={showSpanish}
          onToggle={() => setShowSpanish((open) => !open)}
          above
        />
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
          showTranslated ? translated : contenidoBase
        )}
      </div>

      {message.state === 'sending' && <span className={styles.status}>{t('chat.mensaje.enviando')}</span>}
      {message.state === 'processing' && <span className={styles.status}>{t('chat.mensaje.procesando')}</span>}
      {message.state === 'unknown_delivery' && <span className={styles.status}>{t('chat.mensaje.verificando')}</span>}
      {message.state === 'failed' && <span className={styles.status}>{t('chat.mensaje.noEnviado')}</span>}

      {canRetry && (
        <button
          type="button"
          className={styles.retryBtn}
          onClick={() => onRetry?.(retryText, message.id)}
        >
          {t('chat.mensaje.reintentar')}
        </button>
      )}

      {showUpgrade && (
        <button
          type="button"
          className={styles.upgradeBtn}
          onClick={() => onUpgrade?.()}
        >
          {t('chat.mensaje.verPlanes')}
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
          <strong>{t('chat.mensaje.alcanceLimitadoTitulo')}</strong>
          <span>{t('chat.mensaje.alcanceLimitadoTexto')}</span>
        </div>
      )}

      {isBot && nextSteps.length > 0 && (
        <div className={styles.guidanceBlock}>
          <span className={styles.blockTitle}>{t('chat.mensaje.siguientesPasos')}</span>
          <ul>
            {nextSteps.map((item, index) => (
              <li key={index}><InlineMarkdown>{item}</InlineMarkdown></li>
            ))}
          </ul>
        </div>
      )}

      {isBot && citations.length > 0 && (
        <div className={styles.citations}>
          <button type="button" className={styles.sourcesToggle} onClick={() => setSourcesOpen((open) => !open)} aria-expanded={sourcesOpen}>
            <span>{t('chat.mensaje.fuentesUtilizadas')}</span>
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
                            <span className={styles.citationLabel}>{t('chat.mensaje.resumenAsistente')}</span>
                          )}
                          {entry.sourceSnippet}
                        </div>
                      )}
                    </div>
                  ))}

                  {group.sourceUrl && (
                    <a href={group.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.citationLink}>
                      {t('chat.mensaje.verFuente')}
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
              title={t.plural('chat.mensaje.calificar', n)}
            >
              ★
            </button>
          ))}
          <button type="button" className={styles.feedbackToggle} onClick={() => setFeedbackOpen((open) => !open)} disabled={ratingPending}>
            {t('chat.mensaje.comentario')}
          </button>
          {ratingPending && <span className={styles.ratingStatus}>{t('chat.mensaje.guardando')}</span>}
        </div>
      )}

      {isBot && feedbackOpen && (
        <div className={styles.feedbackBox}>
          <textarea
            value={comment}
            maxLength={1000}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('chat.mensaje.comentarioPlaceholder')}
          />
          <button type="button" onClick={() => handleRate(rated)} disabled={ratingPending || !rated}>
            {t('chat.mensaje.guardarFeedback')}
          </button>
          {!rated && <span className={styles.ratingStatus}>{t('chat.mensaje.calificaPrimero')}</span>}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import styles from './ChatMessage.module.css'

export default function ChatMessage({ message, onRate }) {
  const isBot  = message.role === 'ASSISTANT'
  const [rated, setRated] = useState(message.rating || 0)
  const [hover, setHover] = useState(0)

  const handleRate = async (stars) => {
    if (!message.id || message.id.startsWith('tmp_') || message.id === 'welcome') return
    setRated(stars)
    onRate?.(message.id, stars)
  }

  return (
    <div className={`${styles.wrap} ${isBot ? styles.bot : styles.user}`}>
      <span className={styles.label}>{isBot ? 'LegalFam' : 'Tú'}</span>

      <div className={styles.bubble}>
        {isBot ? (
          <span dangerouslySetInnerHTML={{ __html: message.content }} />
        ) : (
          message.content
        )}
      </div>

      {/* Citations */}
      {isBot && message.citations?.length > 0 && (
        <div className={styles.citations}>
          {message.citations.map((c, i) => (
            <div key={i} className={styles.citation}>
              <div className={styles.citationTitle}>
                {c.sourceTitle || 'Fuente legal'}
              </div>
              <div className={styles.citationSnippet}>{c.sourceSnippet}</div>
              {c.sourceUrl && (
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.citationLink}
                >
                  Ver fuente →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Star rating — only for real bot messages */}
      {isBot &&
        message.id &&
        !message.id.startsWith('tmp_') &&
        message.id !== 'welcome' &&
        !message.isError && (
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`${styles.star} ${n <= (hover || rated) ? styles.starActive : ''}`}
                onClick={() => handleRate(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                title={`Calificar ${n} estrella${n > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>
        )}
    </div>
  )
}

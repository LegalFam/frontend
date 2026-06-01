import { useState } from 'react'
import styles from './ChatMessage.module.css'

export default function ChatMessage({ message, onRate }) {
  const isBot = message.role === 'ASSISTANT'
  const isSystem = message.role === 'SYSTEM'
  const isUser = message.role === 'USER'
  const [rated, setRated] = useState(message.rating || 0)
  const [hover, setHover] = useState(0)

  const handleRate = async (stars) => {
    if (!message.id || message.id.startsWith('tmp_') || message.id === 'welcome') return
    setRated(stars)
    onRate?.(message.id, stars)
  }

  return (
    <div className={`${styles.wrap} ${isUser ? styles.user : styles.bot} ${isSystem ? styles.system : ''}`}>
      <span className={styles.label}>{isUser ? 'Tu' : isSystem ? 'Sistema' : 'LegalFam'}</span>

      <div className={styles.bubble}>
        {isBot || isSystem ? (
          <span dangerouslySetInnerHTML={{ __html: message.content }} />
        ) : (
          message.content
        )}
      </div>

      {message.state === 'sending' && <span className={styles.status}>Enviando...</span>}
      {message.state === 'processing' && <span className={styles.status}>Procesando...</span>}
      {message.state === 'unknown_delivery' && (
        <span className={styles.status}>Verificando entrega...</span>
      )}

      {isBot && message.citations?.length > 0 && (
        <div className={styles.citations}>
          {message.citations.map((citation, index) => (
            <div key={index} className={styles.citation}>
              <div className={styles.citationTitle}>
                {citation.sourceTitle || 'Fuente legal'}
              </div>
              <div className={styles.citationSnippet}>{citation.sourceSnippet}</div>
              {citation.sourceUrl && (
                <a
                  href={citation.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.citationLink}
                >
                  Ver fuente
                </a>
              )}
            </div>
          ))}
        </div>
      )}

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

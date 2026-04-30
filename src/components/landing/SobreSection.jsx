import styles from './SobreSection.module.css'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Tecnología RAG',
    desc: 'Recuperamos normativa y jurisprudencia peruana vigente para garantizar respuestas precisas y fundamentadas en cada consulta.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    title: 'Explicabilidad XAI',
    desc: 'Mostramos siempre las fuentes legales que respaldan cada respuesta para que entiendas el razonamiento detrás de la orientación.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    title: 'Para todos',
    desc: 'Lenguaje claro y accesible, sin tecnicismos legales. Diseñado para personas de bajos recursos y poblaciones vulnerables del Perú.',
  },
]

export default function SobreSection() {
  return (
    <section id="sobre" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.images}>
          <img
            className={styles.imgMain}
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80"
            alt="Asesoría legal"
            loading="lazy"
          />
          <img
            className={styles.imgAccent}
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80"
            alt="Documentos legales"
            loading="lazy"
          />
          <div className={styles.badge}>
            <div className={styles.badgeNum}>UPC</div>
            <div className={styles.badgeLbl}>
              Universidad Peruana de<br />Ciencias Aplicadas
            </div>
          </div>
        </div>

        <div className={styles.text}>
          <span className="section-eyebrow">Sobre nosotros</span>
          <h2 className="section-title">
            Democratizando el acceso a la justicia en el Perú
          </h2>
          <p className={styles.intro}>
            LegalFam nació en la UPC para eliminar las barreras económicas,
            geográficas y de comprensión que impiden a miles de peruanos
            ejercer sus derechos fundamentales en temas de familia.
          </p>
          <div className={styles.features}>
            {features.map((f) => (
              <div key={f.title} className={styles.featureItem}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <p>
                  <strong>{f.title}:</strong> {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Un archivo por idioma (no por superficie): el riesgo principal de este i18n es que el quechua
// y el aymara se desincronicen del espanol, y tenerlos en tres archivos paralelos hace que la
// paridad se revise a ojo y con `npm run i18n:check`.

import es from './es'
import qu from './qu'
import ay from './ay'

export default { es, qu, ay }

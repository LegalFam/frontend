// Catálogo de idiomas de la aplicación: define qué lenguas existen y cómo se llaman.
//
// Un mismo idioma decide dos cosas a la vez: en qué lengua se lee la interfaz (los catálogos
// están en i18n/locales, ver i18n/translate.js) y en qué lengua el usuario escribe su consulta
// y lee la respuesta. Son una sola preferencia porque en ambos casos el español es la versión
// que prevalece, así que separarlas no aportaría nada.
//
// El pipeline jurídico (clasificación, búsqueda en el corpus, redacción y citas) opera
// siempre en español, porque las normas peruanas solo existen en español. La traducción
// ocurre en los bordes, y el español viaja junto a la traducción como versión que prevalece.
//
// La preferencia vive en localStorage, igual que el tema (ver theme.js), y la expone al resto
// de la app el store de Zustand store/languageStore.js; no se guarda en el servidor. Lo que sí
// queda en la base de datos es el idioma de cada mensaje, para que el
// historial se siga leyendo igual aunque después se cambie de lengua.

const KEY = 'legalfam-idioma'
const POR_DEFECTO = 'es'

export const IDIOMAS = [
  {
    codigo: 'es',
    // Etiqueta en la propia lengua: quien busca su idioma en la lista lo reconoce así, no
    // por su nombre en español.
    etiqueta: 'Español',
    nombre: 'Español',
  },
  {
    codigo: 'qu',
    etiqueta: 'Runasimi',
    // Quechua sureño (Chanka-Collao), que es el de mayor número de hablantes en Perú. Las
    // variantes centrales no son mutuamente inteligibles con esta y no están cubiertas.
    nombre: 'Quechua sureño',
    aviso: 'Kay kutichiyqa maquinawan t’ikrasqam. Kastilla simipi kaqmi chiqap.',
  },
  {
    codigo: 'ay',
    etiqueta: 'Aymara',
    nombre: 'Aymara',
    aviso: 'Aka jaysawixa maquinampi jaqukipatawa. Kastilla arunxa chiqapawa.',
  },
]

const CODIGOS = IDIOMAS.map((idioma) => idioma.codigo)

export const esIdiomaSoportado = (codigo) => CODIGOS.includes(codigo)

export function idiomaPorCodigo(codigo) {
  return IDIOMAS.find((idioma) => idioma.codigo === codigo) || IDIOMAS[0]
}

export function leerIdioma() {
  try {
    const guardado = localStorage.getItem(KEY)
    return esIdiomaSoportado(guardado) ? guardado : POR_DEFECTO
  } catch {
    // Modo privado o almacenamiento bloqueado: se sigue en español.
    return POR_DEFECTO
  }
}

export function guardarIdioma(codigo) {
  const idioma = esIdiomaSoportado(codigo) ? codigo : POR_DEFECTO
  try {
    localStorage.setItem(KEY, idioma)
  } catch {
    /* modo privado */
  }
  return idioma
}

// Aviso que acompaña a toda respuesta traducida. Es material de orientación legal: el
// usuario tiene que poder saber que lee una traducción automática y llegar al original.
export const AVISO_TRADUCCION = 'Traducción automática. La versión en español es la que prevalece.'

export function avisoTraduccion(codigo) {
  return {
    propio: idiomaPorCodigo(codigo).aviso || '',
    espanol: AVISO_TRADUCCION,
  }
}

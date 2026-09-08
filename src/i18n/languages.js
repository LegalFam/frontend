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

// Ojo: el valor de la clave no se toca aunque el identificador esté en inglés. Cambiarlo
// dejaría huérfana la preferencia ya guardada de quien tiene la app en quechua o aymara.
const KEY = 'legalfam-idioma'
const DEFAULT_CODE = 'es'

export const LANGUAGES = [
  {
    code: 'es',
    // Etiqueta en la propia lengua: quien busca su idioma en la lista lo reconoce así, no
    // por su nombre en español.
    label: 'Español',
    name: 'Español',
  },
  {
    code: 'qu',
    label: 'Runasimi',
    // Quechua sureño (Chanka-Collao), que es el de mayor número de hablantes en Perú. Las
    // variantes centrales no son mutuamente inteligibles con esta y no están cubiertas.
    name: 'Quechua sureño',
    notice: 'Kay kutichiyqa maquinawan t’ikrasqam. Kastilla simipi kaqmi chiqap.',
  },
  {
    code: 'ay',
    label: 'Aymara',
    name: 'Aymara',
    notice: 'Aka jaysawixa maquinampi jaqukipatawa. Kastilla arunxa chiqapawa.',
  },
]

const CODES = LANGUAGES.map((language) => language.code)

export const isSupportedLanguage = (code) => CODES.includes(code)

export function languageByCode(code) {
  return LANGUAGES.find((language) => language.code === code) || LANGUAGES[0]
}

export function readLanguage() {
  try {
    const stored = localStorage.getItem(KEY)
    return isSupportedLanguage(stored) ? stored : DEFAULT_CODE
  } catch {
    // Modo privado o almacenamiento bloqueado: se sigue en español.
    return DEFAULT_CODE
  }
}

export function saveLanguage(code) {
  const language = isSupportedLanguage(code) ? code : DEFAULT_CODE
  try {
    localStorage.setItem(KEY, language)
  } catch {
    /* modo privado */
  }
  return language
}

// Aviso que acompaña a toda respuesta traducida. Es material de orientación legal: el
// usuario tiene que poder saber que lee una traducción automática y llegar al original.
export const TRANSLATION_NOTICE = 'Traducción automática. La versión en español es la que prevalece.'

export function translationNotice(code) {
  return {
    own: languageByCode(code).notice || '',
    spanish: TRANSLATION_NOTICE,
  }
}

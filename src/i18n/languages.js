// No cambiar: dejaría huérfana la preferencia ya guardada.
const KEY = 'legalfam-idioma'
const DEFAULT_CODE = 'es'

export const LANGUAGES = [
  {
    code: 'es',
    label: 'Español',
    name: 'Español',
  },
  {
    code: 'qu',
    label: 'Runasimi',
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

export const TRANSLATION_NOTICE = 'Traducción automática. La versión en español es la que prevalece.'

export function translationNotice(code) {
  return {
    own: languageByCode(code).notice || '',
    spanish: TRANSLATION_NOTICE,
  }
}

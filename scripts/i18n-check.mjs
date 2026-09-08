// Paridad de claves entre los tres catalogos de interfaz. Sin dependencias: `npm run i18n:check`.
//
// Una clave que existe en es y falta en qu no rompe nada visible (translate.js cae al espanol),
// y por eso mismo es el fallo mas facil de dejar pasar. Este script lo convierte en un error.

import es from '../src/i18n/locales/es.js'
import qu from '../src/i18n/locales/qu.js'
import ay from '../src/i18n/locales/ay.js'

const aplanar = (objeto, prefijo = '', salida = new Set()) => {
  for (const [clave, valor] of Object.entries(objeto)) {
    const ruta = prefijo ? `${prefijo}.${clave}` : clave
    if (valor && typeof valor === 'object') aplanar(valor, ruta, salida)
    else salida.add(ruta)
  }
  return salida
}

const catalogos = { es: aplanar(es), qu: aplanar(qu), ay: aplanar(ay) }
const referencia = catalogos.es
let fallos = 0

for (const [idioma, claves] of Object.entries(catalogos)) {
  if (idioma === 'es') continue
  const faltan = [...referencia].filter((c) => !claves.has(c))
  const sobran = [...claves].filter((c) => !referencia.has(c))
  if (faltan.length) {
    fallos += faltan.length
    console.error(`\n[${idioma}] faltan ${faltan.length} claves:`)
    faltan.forEach((c) => console.error(`  - ${c}`))
  }
  if (sobran.length) {
    fallos += sobran.length
    console.error(`\n[${idioma}] ${sobran.length} claves que no existen en es:`)
    sobran.forEach((c) => console.error(`  + ${c}`))
  }
}

const vacias = []
for (const [idioma, claves] of Object.entries(catalogos)) {
  const fuente = { es, qu, ay }[idioma]
  for (const clave of claves) {
    const valor = clave.split('.').reduce((n, p) => (n == null ? n : n[p]), fuente)
    if (typeof valor !== 'string' || !valor.trim()) vacias.push(`${idioma}:${clave}`)
  }
}
if (vacias.length) {
  fallos += vacias.length
  console.error(`\n${vacias.length} valores vacios o no textuales:`)
  vacias.forEach((v) => console.error(`  ! ${v}`))
}

if (fallos) {
  console.error(`\ni18n: ${fallos} problema(s). Total de claves en es: ${referencia.size}`)
  process.exit(1)
}
console.log(`i18n: ok — ${referencia.size} claves en es, qu y ay.`)

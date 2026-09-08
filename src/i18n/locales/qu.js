// Catalogo de interfaz — qu. Ver i18n/translate.js para las reglas de uso.
// Las claves siguen el patron <superficie>.<bloque>.<slot>. La paridad con los otros catalogos
// se comprueba con `npm run i18n:check`.

export default {
  comun: {
    idioma: 'Simi',
    verEnEspanol: 'Kastilla simipi qhaway',
    verEn: '{{idioma}} simipi qhaway',
    verMas: 'Astawan qhaway',
    verMenos: 'Pisita qhaway',
    volver: 'Kutiy',
    cancelar: 'Saqiy',
    cerrar: 'Wichqay',
    guardar: 'Waqaychay',
    cargando: 'Chaqnashan...',
  },

  meta: {
    titulo: 'LegalFam — Ayllu kamachiymanta yanapay',
    descripcion:
      'Perú suyupi ayllu kamachiymanta yanapay, pitaq nisqan rikuchisqa, kastilla, runasimi, aymara simipipas.',
  },

  nav: {
    inicio: 'LegalFam qallariy',
    menu: 'Menú',
    sobre: 'Ñuqaykumanta',
    como: 'Imayna llamk’an',
    precios: 'Chaninkuna',
    seguridad: 'Amachay',
    privacidad: 'Pakasqa kay',
    irAlChat: 'Rimanaman riy',
    cerrarSesion: 'Lluqsiy',
    iniciarSesion: 'Yaykuy',
    registrarse: 'Qillqakuy',
  },

  landing: {
    hero: {
      pill: 'Perú suyupi Ayllu Kamachiy',
      titulo1: 'Chiqan kayman',
      tituloEnfasis: 'hayñiykiqa',
      titulo2: 'manam',
      titulo3: 'chaninchayuqchu.',
      descripcion:
        'Ayllu Kamachiymanta yanapay: mikhuy qullqimanta, wawa hap’iymanta, tayta-mama riqsichiymanta, amachay kamachikuymantawan sut’i, chaskinalla, tukuy p’unchaw tuta ima.',
      comenzar: 'Qallariy',
      irAlChat: 'Rimanaman riy',
      verComo: 'Imayna llamk’asqanta qhaway',
      sello1: 'ISO/IEC 27001',
      sello2: 'Ley N. 29733',
      sello3: 'UPC 2026 llamk’ay',
      stat1: 'Chiqap kasqan taripasqa',
      stat2: 'Sapa kuti kachkan',
      stat3: 'Mana chaniyuq',
      stat3Info: 'Kay aplicación ukhupi rantiykunapas kachkanmi',
    },

    sobre: {
      eyebrow: 'Ñuqaykumanta',
      titulo: 'Perú suyupi chiqan kayman llapanpaq chayana',
      intro:
        'LegalFam UPC yachay wasipi paqarirqan, chayqa qullqi pisiy, karu kay, mana hamut’ay atiy hark’aykunata chinkachinanpaq, waranqa waranqa peruanokuna ayllunkupi hayñinkuta hap’ikunankupaq.',
      imgPrincipal: 'Kamachiymanta yanapay',
      imgSecundaria: 'Kamachiy qillqakuna',
      badge: 'Universidad Peruana de Ciencias Aplicadas',
      rag: 'RAG teqnolohiya',
      ragDesc:
        'Kunan kamachikuykunata, taripaykunatawan Perú suyumanta maskaykuniku, sapa tapuypi chiqap, sayachisqa kutichiykuna kananpaq.',
      xai: 'XAI sut’inchay',
      xaiDesc:
        'Sapa kutichiyta sayachiq kamachiy pukyukunata rikuchiyku, yanapay maymanta hamusqanta hamut’anaykipaq.',
      todos: 'Llapanpaq',
      todosDesc:
        'Sut’i, chaskina rimay, mana sasa kamachiy simikunawan. Pisi qullqiyuq runakunapaq, Perú suyupi llakisqa ayllukunapaqwan ruwasqa.',
    },

    como: {
      eyebrow: 'Ruway ñan',
      titulo: 'Imayna llamk’an',
      sub: 'Tawa pisi ruwaykunallawan kunan Perú kamachikuypi sayachisqa yanapayta chaskinki.',
      paso1: 'Mana chaniyuq qillqakuy',
      paso1Desc: 'Cuentaykita ruway correowan, sutiykiwan, Perú celular yupaykiwan ima. Mana tarjeta de créditota munanchu.',
      paso2: 'Imayna kasqaykita willay',
      paso2Desc: 'Tapuyniykita kikin rimayniykipi qillqay. Sistemaqa ayllu kawsayniykipa kasqanta hamut’anmi.',
      paso3: 'Yanapayta chaskiy',
      paso3Desc: 'Sut’i kutichiy kamachiy pukyukuna rikuchisqawan: Código Civil nisqamanta articulokuna, kunan Perú kamachikuykunapas.',
      paso4: 'Kutichiyta chaninchay',
      paso4Desc: 'Chaskisqayki yanapayta chaninchay, sistemap chiqap kasqanta sapa kuti allinchanaykupaq.',
    },

    seguridad: {
      eyebrow: 'Amachay',
      titulo: 'Willakuyniykiqa amachasqam',
      sub: 'Teqsimuyu kamachiykunata, kunan Perú kamachikuytawan hunt’aniku runap willakuynin amachaypi.',
      iso27001: 'ISO/IEC 27001',
      iso27001Desc:
        'Willakuy amachay kamachiy, teqsimuyu ñawpaq kamachiykunawan sayachisqa teqnolohiya sistemakunapaq.',
      ley29733: 'Ley N. 29733',
      ley29733Desc:
        'Perú suyup runap willakuynin amachay kamachiyninta hunt’ani, tukuy willakuyniykita apaykachaspa.',
      ssl: 'SSL/TLS pakay',
      sslDesc:
        'Aparanaykimanta servidorniykuman rin tukuy willakuy, puchukaymanta puchukaykama pakasqa.',
      iso29100: 'ISO/IEC 29100',
      iso29100Desc:
        'Pakasqa kay kamachiy, sistemata llamk’achiqkunap willakuyninta allin apaykachanapaq.',
      ley31814: 'Ley N. 31814',
      ley31814Desc:
        'Yuyayniyuq maquinawan allin llamk’ay, kunan Perú musuq ruway kamachikuyman hina.',
      jwt: 'JWT riqsichiy',
      jwtDesc:
        'Amachasqa yaykuna tokenkuna, kikinmanta muyuq, tukuynin churasqa, sesionniykita amachanapaq.',
    },

    privacidad: {
      eyebrow: 'Pakasqa kay',
      titulo: 'Pakasqa kayniykiqa ñawpaqninmi ñuqaykupaq',
      sub: 'Willakuyniykita Ley N.° 29733 Runap Willakuynin Amachay nisqaman hina, teqsimuyu allin ruwaykunaman hinawan apaykachayku.',
      contactoTitulo: 'Pakasqa kaymanta rimanakuy',
      contactoTexto:
        'ARCO hayñiykikunata (Yaykuy, Allinchay, Chinkachiy, Mana munay) hap’ikunaykipaq kayman qillqamuwayku:',
      control: 'Willakuyqa makiykipim',
      controlDesc:
        'Qammi willakuyniykip kamachiqnin kanki. Mayqan pachapipas willakuyniykita qhawayta, allinchayta, chinkachiyta atinki.',
      sinVenta: 'Mana willakuy qatuy',
      sinVentaDesc:
        'Manam hayk’aqpas willakuyniykita hukkunaman qatuykuchu nitaq willaykuchu qhatu nitaq willachiy ruwaypaq.',
      retencion: 'Pisi pacha waqaychay',
      retencionDesc:
        'Tapuy qillqasqaykikunata llamk’aypaq hayk’a pacha necesitasqallanta waqaychayku. Mayqan pachapipas cuentaykip chinkachiyninta mañakuyta atinki.',
      transparencia: 'Tukuy sut’i kay',
      transparenciaDesc:
        'Sut’ita willasqayki: ima willakuytas huñuyku, imapaqmi llamk’achiyku, pikunawanmi willaniku necesitakuptin.',
      anonimizacion: 'Tapuykuna mana sutiyuq',
      anonimizacionDesc:
        'Kamachiymanta tapuykunaqa mana sutiyuq apaykachasqam. Manam mayqan hawa abogadopas rimanakuy qillqasqaykiman yaykunchu.',
    },

    banner: {
      cita: '"Chiqan kayman chayayqa manam qullqi bolsilloykipi hayk’a kasqanmanta hina kananchu."',
      firma: '— LegalFam, 2026',
    },

    footer: {
      lema: 'Llapanpaq chaskina chiqan kay',
      terminos: 'Kamachiykuna, Ruwanakuykunapas',
      derechos: '© 2026 LegalFam — Universidad Peruana de Ciencias Aplicadas. Tukuy hayñikuna hark’asqa.',
      aviso: 'Kay sistemaqa willanapaqllam yanapan, manam qillqasqa abogadop yuyaychayninta rantinchu.',
    },
  },

  planes: {
    generico: 'Plan',
    nombre: {
      FREE: 'Mana chaniyuq plan',
      BASIC: 'Qallariy plan',
      PREMIUM: 'Hatun plan',
    },
    boton: {
      FREE: 'Mana chaniyuq qallariy',
      BASIC: 'Qatikuy',
      PREMIUM: 'Qatikuy',
      generico: 'Qatikuy',
    },
    porMes: '/ killapi',
    tokensMensuales: '{{cantidad}} token sapa killa',
    mensajes: '{{cantidad}} willay',
    dias: '{{cantidad}} p’unchaw',
    historialCompleto: 'Hunt’asqa',
    incluye: {
      asistente: 'Ayllu Kamachiymanta yanapaq',
      fuentes: 'Kamachiy pukyukuna rikuchisqa',
      calificacion: 'Kutichiykuna chaninchay',
    },

    seccion: {
      eyebrow: 'Plankuna',
      titulo: 'Planniykita akllay',
      sub: 'Yanapaqqa llapan planpi kikinmi. Sapa killa hayk’a atisqan, rimanakuypi yuyayninwan, qhawana qillqasqawanmi tikran.',
      tablaResumen: 'Sapa planpi chanikuna, sapa killa atiy, ima ruwaykunachus kachkan chaykunapa tinkuchiynin',
      caracteristica: 'Ima kaynin',
      masPopular: 'Aswan munasqa',
      incluido: 'Kachkanmi',
      planActual: 'Kunan plan',
      irAlChat: 'Rimanaman riy',
      cambiarPlan: 'Planta tikray',
      capacidad: 'Atiy',
      capacidadHint: 'mana chaniyuq planmanta',
      tokens: 'Sapa killa tokenkuna',
      memoria: 'Rimanakuypa yuyaynin',
      memoriaHint: 'yanapaqpa yuyasqan',
      historial: 'Qhawana qillqasqa',
      nota: 'Chanikunapi IGV kachkanmi. Mayqan pachapipas qatikusqaykita saqiyta atinki.',
    },
  },

  auth: {
    campos: {
      correo: 'Correo electrónico',
      correoPlaceholder: 'correoyki@ejemplo.com',
      contrasena: 'Yaykuna rimay',
      contrasenaPlaceholder: '••••••••',
      mostrarContrasena: 'Yaykuna rimayta rikuchiy',
      ocultarContrasena: 'Yaykuna rimayta pakay',
      nombre: 'Suti',
      nombrePlaceholder: 'María',
      apellido: 'Ayllu suti',
      apellidoPlaceholder: 'García',
      celular: 'Celular yupay',
      celularPlaceholder: '987654321',
      contrasenaNueva: 'Musuq yaykuna rimay',
      minimoPlaceholder: 'Pusaqmanta pacha sanampakuna',
      confirmar: 'Yaykuna rimayta takyachiy',
      confirmarPlaceholder: 'Yaykuna rimayta kutichiy',
    },

    validacion: {
      requerido: 'Kay chakiqa hunt’anam.',
      correoInvalido: 'Allin correota qillqay.',
      contrasenaRequerida: 'Yaykuna rimayqa munakunmi.',
      celularDigitos: 'Isqun yupaylla.',
      contrasenaCorta: 'Pusaqmanta pacha sanampakuna.',
      contrasenaNoCoincide: 'Yaykuna rimaykunaqa manam kikinchu.',
      terminosRequeridos: 'Kamachiykunata chaskinaykim, hinaspam qatinki.',
    },

    login: {
      titulo: 'Yaykuy',
      subtitulo: 'Cuentaykiman yaykuy qatinaykipaq',
      olvidaste: '¿Yaykuna rimayniykita qunqarqankichu?',
      entrar: 'Yaykuy',
      entrando: 'Yaykuchkan...',
      sinCuenta: '¿Manachu cuentayki kan?',
      registrate: 'Mana chaniyuq qillqakuy',
    },

    registro: {
      titulo: 'Cuentata ruway',
      subtitulo: 'Mana chaniyuq qillqakuy, hinaspa tapuyta qallariy',
      aceptoAntes: 'Chaskinim kay',
      aceptoEnlace: 'Kamachiykunata, Ruwanakuykunatawan',
      aceptoDespues: 'hinallataq willakuyniypa apaykachasqanta.',
      notaDatos:
        'Willakuyniykiqa Ley N.° 29733 nisqaman hinam apaykachasqa. Manam hukkunaman willaykuchu nitaq qatuykuchu willakuyniykita, tapuyniykikunapas mana sutiyuqmi apaykachasqa.',
      crear: 'Mana chaniyuq cuentata ruway',
      creando: 'Cuentata ruwachkan...',
      yaTienes: '¿Ñachu cuentayki kan?',
      inicia: 'Yaykuy',
      revisaCorreo: 'Correoykita qhaway',
      enviamosEnlace:
        '{{correo}} nisqaman takyachiy enlaceta apachimuyku. Kichay cuentaykita kawsarichinaykipaq, hinaspa yaykunaykipaq.',
      noLoVes: '¿Manachu rikunki? Spam qullqanapi maskay. Enlaceqa iskay chunka tawayuq horaspim tukun.',
      irAIniciar: 'Yaykunaman riy',
    },

    recuperar: {
      titulo: '¿Yaykuna rimayniykita qunqarqankichu?',
      subtitulo: 'Correoykita qillqay, musuqta ruwanaykipaq enlaceta apachimusqayki.',
      enviar: 'Enlaceta apachiy',
      enviando: 'Apachichkan...',
      errorEnvio: 'Manam correota apachiyta atirqanichu.',
      revisaCorreo: 'Correoykita qhaway',
      siRegistrado:
        '{{correo}} qillqasqa kaptinqa, yaykuna rimayniykita musuqchanaykipaq enlaceta apachimuykiku.',
      revisaSpam: 'Spam qullqanapipas maskay. Enlaceqa huk horaspim tukun.',
      volverIniciar: 'Yaykunaman kutiy',
      recordaste: '¿Yaykuna rimayniykita yuyarirqankichu?',
      inicia: 'Yaykuy',
    },

    reenvio: {
      boton: 'Takyachiy correota kutichiy apachiy',
      reenviando: 'Kutichispa apachichkan...',
      espera: '{{segundos}}s qhipata kutichiy apachiy',
      exito: 'Enlaceta kutichispa apachimuykiku. Chaskina qullqanaykipi, spam qullqanapipas maskay.',
      error: 'Manam correota kutichispa apachiyta atirqanichu.',
    },

    verificar: {
      verificando: 'Correoykita takyachichkan',
      espera: 'Kayqa pisi sigundollam.',
      exito: '¡Correoqa takyachisqañam!',
      exitoTexto: 'Cuentaykiqa kawsachkanñam. Yaykuyta, tapuyta qallariyta ima atinkiñam.',
      error: 'Manam correoykita takyachiyta atirqanikuchu',
      sinToken: 'Kay enlaceqa manam takyachina codigoyuqchu. Musuqta mañakuy.',
      errorGenerico: 'Manam correoykita takyachiyta atirqanikuchu.',
    },

    restablecer: {
      titulo: 'Musuq yaykuna rimayta ruway',
      subtitulo: 'Pusaqmanta pacha sanampayuq yaykuna rimayta akllay.',
      guardar: 'Yaykuna rimayta waqaychay',
      guardando: 'Waqaychachkan...',
      sinToken: 'Kay enlaceqa manam allin codigoyuqchu. Musuqta mañakuy.',
      errorGenerico: 'Manam yaykuna rimayniykita musuqchayta atirqanikuchu.',
      pedirNuevo: 'Musuq enlaceta mañakuy',
      listo: 'Yaykuna rimayqa musuqchasqañam',
      listoTexto: 'Musuq yaykuna rimayniykiwan yaykuyta atinkiñam.',
      listoHint: 'Amachanapaqmi huk aparanakunapi kicharisqa llapan sesionkunata wichqaykuniku.',
    },
  },

  config: {
    volverAlChat: 'Rimanaman riy',
    eyebrow: 'Cuenta',
    titulo: 'Churay',
    subtitulo: 'Willakuyniykita, yaykuna rimayniykita, qatikusqaykitawan musuqchay.',
    errorPerfil: 'Manam qillqasqaykita chaqnayta atirqanikuchu.',

    datos: {
      titulo: 'Runa willakuykuna',
      correoNota:
        'Correoykita tikranaykipaqqa musuq direcciónta takyachinaykum. Kay ruwayqa ñachalla kanqa.',
      guardar: 'Tikrasqata waqaychay',
      guardado: 'Willakuykunaqa musuqchasqañam.',
      error: 'Manam willakuyniykikunata waqaychayta atirqanikuchu.',
    },

    contrasena: {
      titulo: 'Yaykuna rimay',
      actual: 'Kunan yaykuna rimay',
      nueva: 'Musuq yaykuna rimay',
      confirmarPlaceholder: 'Musuq yaykuna rimayta kutichiy',
      cambiar: 'Yaykuna rimayta tikray',
      guardado: 'Yaykuna rimayqa musuqchasqañam.',
      error: 'Manam yaykuna rimayta tikrayta atirqanikuchu.',
      actualIncorrecta: 'Kunan yaykuna rimayqa manam allinchu.',
    },

    idioma: {
      titulo: 'Simi',
      intro:
        'Ima simipi LegalFamta llamk’achiyta munanki chayta akllay. Tikrayqa kunallanmi ruwakun, hinaspam kay navegadorpi waqaychakun.',
      nota:
        'Kikin akllasqaykim ima simipi tapuyniykita qillqanaykita, kutichiyta ñawinchanaykitawan churan. Yanapayqa kastilla simipim wiñaypaq qillqasqa, chaymantam t’ikrasqa: kastilla simipi kaqmi chiqap.',
    },

    apariencia: {
      titulo: 'Rikch’ay',
      intro:
        'Ima llimpiwan LegalFamta qhawayta munanki chayta akllay. Tikrayqa kunallanmi ruwakun, hinaspam kay navegadorpi waqaychakun.',
    },

    suscripcion: {
      titulo: 'Qatikuy',
      planActual: 'Kunan plan',
      tokensDisponibles: 'Kaq tokenkuna',
      cargando: 'Qatikusqaykimanta willakuyta chaqnachkan...',
      dadaDeBaja: 'Qatikuyqa saqisqañam.',
      noRenovara:
        'Manam musuqchakunqachu. Planniykita, tokenniykikunatawan {{fecha}} p’unchawkama hap’ikunki; chaymantam mana chaniyuq planman kikinmanta pasanki.',
      alDarDeBaja:
        'Saqiptiykiqa hamuq killapiqa manam musuqchakunqachu, ichaqa planniykita, tokenniykikunatawan {{fecha}} p’unchawkamam hap’ikunki.',
      darDeBaja: 'Qatikuyta saqiy',
      dandoDeBaja: 'Saqichkan...',
      errorBaja: 'Manam qatikuyta saqiyta atirqanikuchu.',
      esGratuito: 'Kunan planniykiqa mana chaniyuqmi, manam ima qatikuypas saqinapaq kanchu.',
      verPlanes: 'Plankunata, tokenkunatawan qhaway',
      finPeriodo: 'kunan pacha tukuypi',

      confirmarTitulo: 'Qatikuyta saqiy',
      confirmarTexto1:
        'Qatikusqaykiqa manam musuqchakunqañachu, ichaqa planniykita, {{tokens}} tokenniykikunatawan {{fecha}} p’unchawkamam hap’ikunki.',
      confirmarTexto2:
        'Chay pacha tukuptinmi mana chaniyuq planman pasanki, {{tokens}} token sapa killawan. Chaninchasqa planman kutinaykipaqqa musuqmantam mañakunayki.',
      confirmarBoton: 'Saqiy',
    },
  },

  facturacion: {
    eyebrow: 'Qatikuy',
    titulo: 'Plan, tokenkunapas',
    planActual: 'Kunan plan',
    tokensDisponibles: 'Kaq tokenkuna',
    usados: '{{cantidad}} llamk’achisqa',
    restantes: '{{cantidad}} puchusqa',
    vencen: 'Planniyki, tokenniykikunapas {{fecha}} p’unchawpim tukun; chaymantam mana chaniyuq planman pasanki.',
    renuevan: 'Tokenniykikunaqa {{fecha}} p’unchawpim musuqchakun.',
    costeTokens:
      'Sapa tapuyqa kutichiy listo kaptinmi tokenkunata pisiyachin: huk token pisi tapuypaq, kimsa tokenkama kutichiy kamachiy pukyukunapi sayaptin.',
    planActivo: 'Kawsaq plan',
    cambiarPlan: 'Planta tikray',
    cancelar: 'Qatikuyta saqiy',
    cancelando: 'Saqichkan...',
  },

  pago: {
    irAlInicio: 'Qallariyman riy',
    resumen: 'Planpa pisichasqan',
    procesadoPor: 'Mercado Pago nisqawan chaninchasqa',
    checkoutTitulo: 'Hawa chaninchay',
    checkoutSub:
      'LegalFamqa manam tarjeta willakuyta hap’inchu. Mercado Pago nisqamanmi apasqayki qatikuyta hunt’anaykipaq, tukuruspam kayman kutimunki.',
    checkoutTexto:
      'Qatiptiykiqa Mercado Pagom sapa killa chaninchayta apaykachanqa. Kutimuptiykim planniykita, tokenniykikunatawan musuqchasaqku.',
    continuar: 'Mercado Pagoman qatiy',
    abriendo: 'Mercado Pagota kichachkan...',
    errorCheckout: 'Manam chaninchayta qallariyta atirqanikuchu. Huk kutita ruway.',
    volverAlChat: 'Rimanaman kutiy',

    retorno: {
      chat: 'Rimanakuy',
      cancelado: 'Chaninchayqa saqisqam',
      canceladoTexto: 'Manam ima qullqipas hap’isqachu karqan.',
      confirmando: 'Chaninchasqaykita takyachichkan...',
      listo: '¡Listuñam! Planniykiqa kawsachkanñam.',
      verificando: 'Qatikusqaykita qhawachkaniku',
      confirmandoMP: 'Mercado Pagowan takyachichkan...',
      estado: 'Kunan plan: {{plan}}. Kaq tokenkuna: {{restantes}}/{{limite}}.',
      esperaHint:
        'Kayqa huk minutokamam unayta atin. Ama llakikuychu, chaninchasqaykiqa Mercado Pagopiñam qillqasqa — takyachiyllatam suyachkaniku planniykita kawsarichinaykupaq.',
      tardaHint:
        'Takyachiyqa yachasqamanta aswanmi unaychkan. Chaninchasqaykiqa manam chinkanchu: chaskiruspaykum planniyki kikinmanta kawsarinqa. Pisi minutomanta ñawpaq planllataraq rikunki chayqa, ñuqaykuman willamuwayku.',
      irAlChat: 'Rimanaman riy',
    },
  },

  errores: {
    unauthorized: 'Sesionniykim tukurqan. Musuqmanta yaykuy.',
    forbidden: 'Manam kayta ruwanaykipaq saqisqachu kanki.',
    malformed_json: 'Mañakuyqa manam allin ruwasqachu.',
    invalid_request: 'Qillqasqaykita qhaway, hinaspa musuqmanta ruway.',
    max_upload_size_exceeded: 'Kay qillqaqa saqisqa hatunmantam aswan hatun.',
    internal_server_error: 'Mana suyasqa sasachakuymi karqan. Musuqmanta ruway.',

    email_required: 'Correoykita qillqay.',
    email_invalid: 'Allin correota qillqay.',
    email_too_long: 'Correoqa nishu suniraqmi.',
    password_required: 'Yaykuna rimayniykita qillqay.',
    password_length_invalid: 'Yaykuna rimayqa manam munasqa sunichayuqchu.',
    name_required: 'Sutiykita qillqay.',
    name_too_long: 'Sutiqa nishu suniraqmi.',
    phone_required: 'Celular yupayniykita qillqay.',
    phone_too_long: 'Celular yupayqa nishu suniraqmi.',
    refresh_token_required: 'Manam sesionta musuqchayta atirqanikuchu. Musuqmanta yaykuy.',
    profile_request_required: 'Qillqasqaykita qhaway, hinaspa musuqmanta ruway.',
    password_request_required: 'Yaykuna rimay chakikunata hunt’ay, hinaspa musuqmanta ruway.',
    current_password_invalid: 'Kunan yaykuna rimayqa manam allinchu.',
    subscription_already_canceled: 'Qatikusqaykiqa saqisqañam, manam musuqchakunqachu.',
    message_required: 'Apachiyta manaraq tapuyta qillqay.',
    message_too_long: 'Tapuyniykiqa nishu suniraqmi. Pisiyachiy, hinaspa musuqmanta ruway.',
    session_id_required: 'Manam rimanakuyta tarirqanikuchu. Rimanata musuqmanta kichay.',
    session_title_required: 'Rimanakuypaq huk sutita qillqay.',
    session_title_too_long: 'Rimanakuypa sutinqa nishu suniraqmi.',
    rating_required: 'Huk chaninchayta akllay.',
    rating_out_of_range: 'Chaninchayqa hukmanta pichqakama kanan.',
    feedback_comment_too_long: 'Rimasqaykiqa nishu suniraqmi.',
    plan_code_required: 'Huk planta akllay.',
    plan_code_too_long: 'Planpa codigonqa nishu suniraqmi.',
    plan_code_invalid: 'Akllasqayki planqa manam allinchu.',
    success_url_too_long: 'Kutimuna URLqa nishu suniraqmi.',
    success_url_invalid: 'Kutimuna URLqa manam allinchu.',
    cancel_url_too_long: 'Saqiy URLqa nishu suniraqmi.',
    cancel_url_invalid: 'Saqiy URLqa manam allinchu.',

    email_already_exists: 'Kay correoqa qillqasqañam.',
    invalid_credentials: 'Correo icha yaykuna rimay manam allinchu.',
    invalid_refresh_token: 'Sesionniykim tukurqan. Musuqmanta yaykuy.',
    signup_request_required: 'Cuentaykita ruwanaykipaq willakuykunata hunt’ay.',
    login_request_required: 'Correoykita, yaykuna rimayniykitawan qillqay.',

    email_not_verified: 'Yaykunaykipaq ñawpaqta correoykita takyachiy. Chaskina qullqanaykita qhaway.',
    email_already_verified: 'Correoykiqa takyachisqañam. Yaykuy.',
    token_required: 'Kay enlaceqa manam allinchu. Musuqta mañakuy.',
    verification_token_invalid: 'Takyachina enlaceqa manam allinchu icha tukurqanñam. Musuqta mañakuy.',
    reset_token_invalid: 'Yaykuna rimay musuqchana enlaceqa manam allinchu icha tukurqanñam.',
    verify_email_request_required: 'Kay enlaceqa manam allinchu. Musuqta mañakuy.',
    resend_verification_request_required: 'Correoykita qillqay.',
    forgot_password_request_required: 'Correoykita qillqay.',
    reset_password_request_required: 'Yaykuna rimayniykita musuqchanaykipaq chakikunata hunt’ay.',

    chat_session_not_found: 'Manam kay rimanakuyta tarirqanikuchu.',
    chat_message_not_found: 'Manam kay willayta tarirqanikuchu.',
    assistant_delivery_event_not_found: 'Manam willaypa chayasqan takyachisqata tarirqanikuchu.',
    message_processing_pending: 'Huk tapuyñam ruwakuchkan. Tukunankama suyay, chaymanta hukta apachiy.',
    assistant_receipt_pending: 'Ñawpaq kutichiyqa takyachikuchkanraqmi. Pisi sigundota suyay.',
    personal_data_not_allowed: 'Ama DNIykita, celularniykita, correoykita, wasiykip kasqantapas apachiychu. Imayna kasqaykita hatunllamanta willay.',
    metadata_only_assistant: 'Metadataqa yanapaqpa kutichiyninkunallapim churakuyta atin.',
    only_assistant_messages_can_be_rated: 'Yanapaqpa kutichiynin sapallantam chaninchayta atinki.',
    receipt_only_assistant_messages: 'Yanapaqpa kutichiyninkunallapim ñawinchasqa kasqan takyachikuyta atin.',
    cursor_invalid: 'Manam chay tarisqa p’anqata chaqnayta atirqanikuchu. Musuqmanta ruway.',
    upstream_error: 'Manam kutichiyta wakichiyta atirqanichu huk pisi pacha sasachakuyrayku. Musuqmanta ruwayta atinki.',
    upstream_timeout: 'Kutichiyqa suyasqamanta aswanmi unaychkan. Pisi sigundomanta musuqmanta ruway.',
    upstream_empty_response: 'Yanapaqqa manam kutichiytachu qurqan. Tapuyniykita huk hinata qillqay.',
    upstream_invalid_response: 'Yanapaqqa mana ruway atina kutichiytam qurqan. Musuqmanta ruway.',
    upstream_not_configured: 'Yanapaqpa llamk’aynin manam churasqachu. Qhipaman ruway.',
    upstream_unavailable: 'Yanapaqpa llamk’aynin manam kachkanchu. Qhipaman ruway.',
    upstream_request_invalid: 'Manam tapuyta yanapaqpaq wakichiyta atirqanikuchu. Musuqmanta ruway.',
    agent_validation_failed: 'Manam yanapaqpa kutichiyninta takyachiyta atirqanikuchu. Musuqmanta ruway.',

    checkout_request_required: 'Manam chaninchayta qallariyta atirqanikuchu. Musuqmanta ruway.',
    paid_plan_required: 'Qatinaykipaq chaninchasqa planta akllay.',
    plan_not_purchasable: 'Kay planqa manam kunan rantinapaq kachkanchu.',
    checkout_plan_already_active: 'Kay planmanqa qatikuchkankiñam.',
    checkout_active_gateway_subscription: 'Planta tikranaykipaq ñawpaqta kunan qatikusqaykita saqiy.',
    no_gateway_subscription_to_cancel: 'Manam saqinaykipaq kawsaq qatikuyniyki kanchu.',
    subscription_not_found: 'Manam qatikusqaykita tarirqanikuchu.',
    subscription_inactive: 'Qatikusqaykiqa manam kawsachkanchu.',
    insufficient_tokens: 'Manam kay tapuyta apachinaykipaq tokenniyki hunt’anchu.',
    webhook_payload_required: 'Chaninchaymanta willakuyqa manam hunt’asqachu.',
    payment_webhook_unmatched_user: 'Manam chaninchayta huk cuentawan tinkichiyta atirqanikuchu.',
    webhook_payload_invalid: 'Chaninchaymanta willakuyqa manam allinchu.',
    webhook_user_reference_invalid: 'Chaninchaypa runa riqsichiyninqa manam allinchu.',
    webhook_request_id_required: 'Chaninchay willakuyqa manam mañakuy riqsichiyniyuqchu.',
    webhook_data_id_required: 'Chaninchay willakuyqa manam willakuy riqsichiyniyuqchu.',
    webhook_signature_invalid: 'Chaninchay willakuypa firmanqa manam allinchu.',
    webhook_signature_required: 'Chaninchay willakuyqa manam firmayuqchu.',
    webhook_signature_unverifiable: 'Manam chaninchay willakuypa firmanta takyachiyta atirqanikuchu.',
    payment_gateway_unavailable: 'Mercado Pagoqa manam kunan kachkanchu. Qhipaman ruway.',
    payment_gateway_empty_response: 'Mercado Pagoqa manam allin kutichiytachu qurqan. Musuqmanta ruway.',
    payment_gateway_misconfigured: 'Chaninchayqa manam allin churasqachu. Qhipaman ruway.',
    payment_gateway_payer_email_required: 'Mercado Pagoqa rantiqpa correontam munan.',
    payment_gateway_checkout_url_missing: 'Mercado Pagoqa manam chaninchay enlaceta qurqanchu. Musuqmanta ruway.',
    payment_gateway_subscription_id_required: 'Manam Mercado Pagopi qatikuypa riqsichiyninta tarirqanikuchu.',

    network_error: 'Tinkiyqa p’akikurqan. Rimanakuypa imayna kasqanta qhawachkaniku.',
    _defecto: 'Manam ruwayta tukuyta atirqanikuchu. Musuqmanta ruway.',
    _asistente: 'Manam kutichiyta ruwayta atirqanikuchu. Musuqmanta ruway.',
  },

  chat: {
    abrirHistorial: 'Qillqasqata kichay icha wichqay',
    irAlInicio: 'Qallariyman riy',
    cerrarSesion: 'Lluqsiy',
    consulta: 'Tapuy',
    consultaActual: 'Kunan tapuy',
    tokensBadge: '{{plan}} · {{restantes}}/{{limite}} token',
    verPlanYTokens: 'Planta, tokenkunatawan qhaway',
    reconectando: 'Rimanawan musuqmanta tinkichkan...',
    cargandoAnteriores: 'Ñawpaq willaykunata chaqnachkan...',
    presetsLabel: 'Sapa kuti tapusqa tapuywan qallariy',
    esperandoRespuesta:
      'Kay tapuypa kutichiyninta wakichichkaniku. Tukuruptinmi tokenniykikuna musuqchakunqa, hinaspam hukta apachiyta atinki.',
    otraEnProceso:
      'Huk tapuyñam ruwakuchkan. Sesionniykikunata qhawayta atinki, ichaqa tukunankama suyay musuqta apachinaykipaq.',
    bienvenida:
      'Napaykullayki, **{{nombre}}**. **LegalFam** nisqaman allin hamusqayki.\n\nKaypim kachkani Perú suyup **Ayllu Kamachiyninmanta** yanapasunaypaq: mikhuy qullqimanta, wawa hap’iymanta, tayta-mama riqsichiymanta, amachay kamachikuymantawan.\n\n¿Ima kamachiy sasachakuymantam kunan tapukuyta munanki?',
    usuario: 'Llamk’achiq',
    sinTokens: 'Tapuykuna apachinaykipaq tokenniykiqa tukurunmi. Planniykita hunt’achiy qatinaykipaq.',
    errorEnviar: 'Manam tapuyniykita apachiyta atirqanikuchu. Musuqmanta ruway.',
    errorSesiones: 'Manam sesionkunata chaqnayta atirqanikuchu.',
    errorMasSesiones: 'Manam aswan sesionkunata chaqnayta atirqanikuchu.',
    errorMensajes: 'Manam willaykunata chaqnayta atirqanikuchu.',
    errorMasMensajes: 'Manam aswan willaykunata chaqnayta atirqanikuchu.',
    errorCalificacion: 'Manam chaninchayta waqaychayta atirqanikuchu.',
    errorEliminar: 'Manam tapuyta chinkachiyta atirqanikuchu.',
    errorRenombrar: 'Manam tapuypa sutinta tikrayta atirqanikuchu.',

    presets: {
      alimentosLabel: 'Mikhuy qullqi',
      alimentosPregunta: '¿Imaynatam wawaypaq mikhuy qullqita mañakuni?',
      tenenciaLabel: 'Wawa hap’iy',
      tenenciaPregunta: '¿Imatam munani wawaypa hap’iyninta mañakunaypaq?',
      filiacionLabel: 'Tayta-mama riqsichiy',
      filiacionPregunta: '¿Imaynatam wawayta kamachiy ñawpaqpi riqsiyman icha tayta riqsichiy ruwayta qallariyman?',
      proteccionLabel: 'Amachay kamachikuykuna',
      proteccionPregunta: '¿Imaynatam ayllu maqanakuymanta amachay kamachikuykunata mañakuni?',
    },

    input: {
      placeholder: 'Kamachiymanta tapuyniykita qillqay...',
      placeholderEsperando: 'Ñawpaq kutichiyta suyay huk tapuyta apachinaykipaq...',
      enviar: 'Apachiy',
      preparando: 'Kutichiyqa wakichikuchkanmi',
      idiomaGrupo: 'Yanapaypa simin',
      datosPersonales:
        'Ama DNIykita, celularniykita, correoykita, wasiykip kasqantapas apachiychu. Imayna kasqaykita hatunllamanta willay.',
      nota:
        'Kutichiy listo kaptinmi tokenkunaqa pisiyan. Ama mana necesitasqa runa willakuyta churaychu.',
    },

    mensaje: {
      tu: 'Qam',
      sistema: 'Sistema',
      enviando: 'Apachichkan...',
      procesando: 'Ruwachkan...',
      verificando: 'Chayasqanta qhawachkan...',
      noEnviado: 'Mana apachisqa',
      reintentar: 'Tapuyta musuqmanta ruway',
      verPlanes: 'Plankunata, tokenkunatawan qhaway',
      fuenteLegal: 'Kamachiy pukyu',
      fuentesUtilizadas: 'Llamk’achisqa pukyukuna',
      resumenAsistente: 'Yanapaqpa pisichasqan',
      verFuente: 'Pukyuta qhaway',
      siguientesPasos: 'Qatiq ruwaykuna',
      comentario: 'Rimay',
      guardando: 'Waqaychachkan...',
      comentarioPlaceholder: 'Kutichiymanta munaptiyki rimay',
      guardarFeedback: 'Rimasqata waqaychay',
      calificar_one: '{{n}} quyllurwan chaninchay',
      calificar_other: '{{n}} quyllurwan chaninchay',

      especialistaTitulo: 'Yachaq yanapay munasqa',
      especialistaTexto:
        'Imayna kasqanrayku, yachaq wasiman riyta yuyaykuy: CEM, PNP icha DEMUNA nisqaman, imaynachus kaptin, yanapayta, amachaytawan chaskinaykipaq.',
      especialistaEnlace: 'Utqay yanapay tinkikunata qhaway',

      idiomaDetectadoTitulo: 'Kutichiypa simin',
      idiomaDetectadoTexto:
        '{{idioma}} simipim qillqarqanki, aplicacionmi ichaqa {{interfaz}} simipi kachkan. {{idioma}} simipim kutichirqaykiku.',
      idiomaDetectadoAccion: 'Aplicacionpi {{idioma}} simita churay',

      fuentesDebilesTitulo: 'Sayachiq pukyukunaqa pisim',
      fuentesDebilesTexto:
        'Kay pukyukunaqa yanapanmanmi, ichaqa manam kutichiypa llapan rimasqanta chiqanchanchu.',
      sinFuentesTitulo: 'Mana pukyu tarisqa',
      sinFuentesTexto:
        'Kay yanapayqa hatunllam, imatapas ruwanaykipaq ñawpaqta kamachikuy qillqawan icha yachaq runawan takyachinayki.',
      alcanceLimitadoTitulo: 'Pisi chayaq willakuy',
      alcanceLimitadoTexto:
        'Kay yanapayqa hatunllam, manam sasachakuyniykipa llapan kaqninta qhawanmanchu. Hatun ruwaykunapaqqa abogadowan icha kamachiq wasiwan rimay.',
    },

    sidebar: {
      nueva: 'Musuq tapuy',
      historial: 'Qillqasqa',
      buscar: 'Tapuyta maskay...',
      buscarAria: 'Qillqasqapi maskay',
      limpiarBusqueda: 'Maskayta pichay',
      cargandoHistorial: 'Qillqasqata chaqnachkan...',
      sinConsultas: 'Manaraqmi tapuykuna kanchu.',
      primeraPregunta: 'Ñawpaq tapuyniykita ruway.',
      sinResultados: 'Manam tapuykunata tarirqanikuchu.',
      cargarMas: 'Aswanta chaqnay',
      renombrar: 'Sutinta tikray',
      eliminar: 'Chinkachiy',
      irAConfiguracion: 'Churayman riy',
      usuario: 'Llamk’achiq',
      eliminarTitulo: 'Tapuyta chinkachiy',
      eliminarTexto: '"{{titulo}}" nisqam qillqasqamanta chinkanqa.',
      mostrarGlosario: 'Simi huñuyta rikuchiy',
      ocultarGlosario: 'Simi huñuyta pakay',
    },

    glosario: {
      titulo: 'Kamachiy simi huñuy',
      volver: 'Rimanaman kutiy',
      nombresEnEspanol:
        'Kay simikunap sutinqa kastilla simipim qipan, chaynam kamachikuykunapi rikurin, chaynatataqmi juzgadopi, comisariapi, DEMUNApipas mañakunayki. Sut’inchayninqa t’ikrasqam.',
    },
  },

  glosario: {
    casacion: {
      termino: 'Casación',
      definicion: 'Corte Suprema nisqaman churana hatun mañakuy, iskay kaq juzgadop kamachisqan kamachikuyta allinta hunt’asqanta icha ruwaypa ñanninta respetasqanta qhawananpaq. Manam ruwasqakunata nitaq rikuchiykunata musuqmanta rimanapaqchu, kamachiyllapaqmi.',
    },
    pensionAlimentos: {
      termino: 'Pensión de alimentos',
      definicion: 'Qullqi, tayta icha mama sapa kuti qunan wawanpa mikhuyninpaq, wasinpaq, yachayninpaq, hampinanpaq, pukllayninpaqwan. Wawap munasqanman, qullqi quqpa atisqanmanwan hinam churakun.',
    },
    alimentista: {
      termino: 'Alimentista',
      definicion: 'Mikhuy qullqita chaskinanpaq hayñiyuq runa. Achkaqa mana kuraq wawam, ichaqa yachakuq kuraq wawapas, warmi icha qusanpas, obligadop tayta-mamanpas kanmanmi.',
    },
    obligadoAlimentario: {
      termino: 'Obligado alimentario',
      definicion: 'Mikhuy qullqita qunan runa. Kay ruwanaqa ayllu tinkimantam paqarin, hinaspam qipan alimentistawan mana rimaptin nitaq tiyaptinpas.',
    },
    asignacionAnticipada: {
      termino: 'Asignación anticipada de alimentos',
      definicion: 'Ratulla qullqi qunapaq, juezpa kamachisqan ruway qallariyllapi, mana kamachisqan tukusqanta suyaspa, alimentistap munasqan utqaylla kaptin, ayllu tinki takyasqa kaptinwan.',
    },
    pensionesDevengadas: {
      termino: 'Pensiones devengadas',
      definicion: 'Ñam tukusqa qullqikuna, obligado mana qusqan. Juezpa chaskisqan yupaypim yupakun, hinaspam kamachiy ñanninta chaskiyta atikun, imaymana qullqi hark’aywan icha llamk’ay qullqimanta pisiyachiywanpas.',
    },
    prorrateo: {
      termino: 'Prorrateo de alimentos',
      definicion: 'Obligadop qullqinta achka alimentistakunaman rakiy, ganasqan mana llapan qullqita huk kutilla hunt’aptin. Juezmi mañakuptin kamachin.',
    },
    redam: {
      termino: 'REDAM',
      definicion: 'Mikhuy Qullqi Manukuq Mana Paqaqkunap Qillqan. Llapanpaq rikuna qillqa, maypim churakun kimsa qatipanakuq icha t’aqa killap qullqinta manukuqta. Chaypi qillqasqa kaspaqa sasam ruwaykuna: manu qullqi mañakuy, wakin kamachi llamk’aykuna hap’iypas.',
    },
    patriaPotestad: {
      termino: 'Patria potestad',
      definicion: 'Iskaynin tayta-mamap mana kuraq wawankunapaq ruwanan, hayñinkunawan: kamachiy ñawpaqpi rantin kay, imaynkunata apaykachay ima. Tayta-mama rakinasqa kaptinpas qipanmi.',
    },
    tenencia: {
      termino: 'Tenencia',
      definicion: 'Mayqin tayta-mamawanmi wawa sapa punchaw tiyan chayta churan, mana kuska tiyaptinku. Manam huk taytap patria potestadninta chinkachinchu nitaq mikhuy qullqi qunanta.',
    },
    tenenciaCompartida: {
      termino: 'Tenencia compartida',
      definicion: 'Iskaynin tayta-mama wawapa qhawariynin, kuska tiyayninwan pantay-pantay rakinku. Paykuna ukhupi pisi rimanakuy kanan, wawapaqpas allin kanan.',
    },
    variacionTenencia: {
      termino: 'Variación de tenencia',
      definicion: 'Juezman mañakuy, pi wawata hap’isqanta tikranapaq. Imaymana tikraptin, wawapaq allin kaptin ruwakun; achkaqa ñawpaq kamachisqamanta pisi pacha pasasqanmi munakun.',
    },
    regimenVisitas: {
      termino: 'Régimen de visitas',
      definicion: 'Ima pachapi, imayna hina mana hap’iyniyuq tayta icha mama wawanwan kayta atin. Paykuna ukhupi rimanakuywan icha juezpa churasqanwanpas.',
    },
    interesSuperior: {
      termino: 'Interés superior del niño',
      definicion: 'Kamachiy, juezkunata, kamachiqkunatawan sapa kuti warma icha wayna-sipaspaq aswan allin kaqta akllachin, tayta-mamap munasqanmanta aswan patapipas.',
    },
    filiacion: {
      termino: 'Filiación',
      definicion: 'Tayta-mamawan wawakunawan kamachiy tinki. Paqarisqan qillqapi munayninwan riqsisqanwan icha juezpa tayta riqsichiy ruwayninwanmi churakun, chayqa achkaqa ADN pruebawanmi sayachikun.',
    },
    reconocimientoVoluntario: {
      termino: 'Reconocimiento voluntario',
      definicion: 'Huk runa RENIEC ñawpaqpi icha notario ñawpaqpi pipa taytan icha maman kasqanta willan, mana juicio kaptin. Ruwasqaña kaptinqa manañam kutichiy atinachu.',
    },
    impugnacionPaternidad: {
      termino: 'Impugnación de paternidad',
      definicion: 'Ruway, qillqasqaña tayta kayta chinkachinapaq, mana yawar chiqanwan tupasqanta rikuchisqa kaptin. Sasa pachayuq, sasa munasqayuqmi.',
    },
    medidasProteccion: {
      termino: 'Medidas de protección',
      definicion: 'Ayllu juezpa kamachisqan, ayllu maqanakuymanta ñak’arisqa runata amachanapaq: maqaqta wasimanta qarquy, mana asuykuy, mana rimapayay ima.',
    },
    fichaValoracion: {
      termino: 'Ficha de valoración de riesgo',
      definicion: 'Tapuykuna, policiap icha juzgadop maqanakuy kaptin churasqan, ñak’arisqa runa hayk’a manchay ukhupi kasqanta tupunanpaq. Chaypa lluqsisqanmi churan hayk’a utqaylla, ima laya amachay kamachikuykuna kananta.',
    },
    violenciaFamiliar: {
      termino: 'Violencia familiar',
      definicion: 'Ima ruwaypas icha mana ruwaypas, ayllu ukhupi cuerpopi, sunqupi, sexo hinapi icha qullqipi nanachikuyta ruwaq. Sunqu nanachiy, qullqi hark’aypas kachkanmi, manam maqanakuyllachu.',
    },
    conciliacionExtrajudicial: {
      termino: 'Conciliación extrajudicial',
      definicion: 'Rimanakuq wasi ñawpaqpi ruwasqa rimanakuy, mana juicioman riy. Mikhuy qullqipi, wawa hap’iypi, watukuypipas chay qillqaqa juezpa kamachisqanwan kikinmi valen.',
    },
    separacionConvencional: {
      termino: 'Separación convencional',
      definicion: 'Iskaynin munayninwan rakinakuy ñan, mana pitapas huchachaspa, municipalidadpi, notariapi icha juzgadopipas ruwana. Mikhuy qullqimanta, wawa hap’iymanta, imaymanakunamantawan ñawpaqta rimanakusqa kanan; pacha pasaruptinqa divorciomanmi tikranman.',
    },
    sociedadGananciales: {
      termino: 'Sociedad de gananciales',
      definicion: 'Casarakuypa imaymana kamachiynin, mana huk akllasqa kaptin: kuska kachkaspa sapa runap tarisqanqa iskayninpam, tukuruptinmi kuskan-kuskan rakikun. Sapaqchasqa imaymanawanmi rantinakuyta atin.',
    },
    tutelaCuratela: {
      termino: 'Tutela y curatela',
      definicion: 'Sapallan mana atiq runata amachanapaq ruwaykuna. Tutelaqa mana patria potestadniyuq tayta-mamayuq wawakunapaqmi; curatelaqa, kuraq runa mana llapan atiyniyuqkunapaqmi.',
    },
    demuna: {
      termino: 'DEMUNA',
      definicion: 'Warmap, Wayna-sipaspa Municipal Amachaqnin. Mana chaniyuq municipal llamk’ay, yanapan hinaspa rimanachiyta atin mikhuy qullqipi, wawa hap’iypi, watukuy churaypipas, warmakunap hayñin p’akisqa kaptinpas qhawan.',
    },
    juzgadoPazLetrado: {
      termino: 'Juzgado de Paz Letrado',
      definicion: 'Kamachiy wasi, achkaqa mikhuy qullqi ruwaykunata qhawaq. Wawa hap’iy, watukuy, tayta riqsichiy, ayllu maqanakuy ruwaykunaqa Ayllu Juzgadomanmi rin.',
    },
    urp: {
      termino: 'Unidades de Referencia Procesal (URP)',
      definicion: 'Chani, kamachiy ruwaypi qullqikunata yupanapaq: aranselkunata, multakunata, mañakuypa hayk’a kasqantawan. UIT nisqap chunkantin kaqninmi (10%), chayraykum sapa wata sol qullqipi musuqchakun.',
    },
  },

  terminos: {
    eyebrow: 'Kamachiy',
    titulo: 'Kamachiykuna, Ruwanakuykunapas',
    intro:
      'Kay kamachiykunam LegalFam llamk’achiyta churan. Cuentaykita ruwaspaykim ñawinchasqaykita, chaskisqaykitawan willanki.',
    actualizacion: 'Qipa musuqchay: 2026 wata anta situwa killa',

    s1Titulo: '1. Llamk’aypa ruwanan',
    s1p1: 'LegalFamqa huk digital yanapaqmi, Perú suyup Ayllu Kamachiyninmanta willanapaq yanapaq: mikhuy qullqimanta, wawa hap’iymanta, tayta-mama riqsichiymanta, amachay kamachikuymantawan.',
    s1p2: 'Kay llamk’ayqa manam kamachiymanta yuyaychaychu nitaq kamachiy ñawpaqpi rantinchu, hinaspa manam qillqasqa abogadowan rimayta rantinchu. Kutichiykunaqa yanapanapaqllam, manam abogado-cliente tinkita paqarichinchu.',
    s1p3: 'Kunan qampaq, huk wawapaq icha huk runapaqpas manchay kaptinqa, kikillanmanta kamachiq utqay yanapay wasikunaman riy.',

    s2Titulo: '2. Llamk’achiqpa cuentan',
    s2p1: 'Rimanata llamk’achinaykipaqqa allin correowan, tinkina yupaywanmi cuentata ruwanayki. Chay willakuykunap chiqap kasqanmanta, yaykuna rimayniykip pakasqa kasqanmantawanmi qam kanki.',
    s2p2: 'Cuentaqa qampam, manam hukman qunachu. Manam qatu ruwaypaq, kutichiykunata qatunapaq, achka tapuykunata maquinawan ruwanapaqpas saqisqachu.',
    s2p3: 'Mayqan pachapipas cuentaykip, tapuy qillqasqaykikunapa chinkachiynintam mañakuyta atinki.',

    s3Titulo: '3. Tokenkuna, aplicación ukhupi rantiykunapas',
    s3p1: 'LegalFam llamk’achiyqa mana chaniyuqmi: llapa cuentam sapa killa mana chaniyuq tokenkunata chaskin. Sapa tapuyqa kutichiy listo kaptinmi tokenkunata pisiyachin: huk token pisi tapuypaq, kimsa tokenkama kutichiy kamachiy pukyukunapi sayaptin.',
    s3p2: 'Aplicaciónpi munaptiyki rantiykunam kachkan: sapa killa qatikuy plankuna, tokenkunata mirachiq. Manam mayqan chaninchasqa planpas munakunchu mana chaniyuq tokenkunawan llamk’achinaykipaq.',
    s3p3: 'Chaninchaykunaqa Mercado Pago nisqawanmi ruwakun. LegalFamqa manam tarjetaykip willakuyninta waqaychanchu. Mayqan pachapipas Churay qhawanamanta qatikusqaykita saqiyta atinki; planqa ñam chaninchasqa pacha tukuyninkama kawsan, hinaspa manam musuqchakunchu.',

    s4Titulo: '4. Runa willakuykuna apaykachay',
    s4p1: 'Willakuyniykikunataqa Ley N.° 29733, Runap Willakuynin Amachay Kamachiy nisqaman, kamachiyninmanwan hinam apaykachayku.',
    s4p2: 'Manam runa willakuyniykita hukkunaman willaykuchu nitaq qatuykuchu qhatu icha willachiy ruwaypaq. Kamachiymanta tapuykunaqa mana sutiyuqmi apaykachasqa, hinaspa manam mayqan hawa abogadopas rimanakuy qillqasqaykiman yaykunchu.',
    s4p3: 'Qillqasqaykitaqa llamk’aynikuta qusunaykipaq hayk’a pacha necesitasqallanta waqaychayku. Tapuyniykikunapi mana necesitasqa runa willakuyta ama churaychu: DNI, celular, correo, wasiyki maypi kasqantapas.',
    s4p4: 'ARCO hayñiykikunata (Yaykuy, Allinchay, Chinkachiy, Mana munay) hap’ikuyta atinki privacidad@legalfam.pe nisqaman qillqamuspa.',

    s5Titulo: '5. Huchapa pisichasqan',
    s5p1: 'LegalFamqa manam yanapaqpa nisqallanwan ruwasqa akllaykunamantachu huchayuq. Perú kamachikuyqa tikranmanmi, sapa sasachakuypas sapaq kasqanwanmi, chayraykum yachaq runap qhawariynin munakun.',
    s5p2: 'Kay llamk’ayqa imayna kachkan chaynam qusqa. Manam mana tanisqa kanantachu takyachiyku nitaq maquinawan ruwasqa kutichiykunapi mana pantay kanantapas.',

    s6Titulo: '6. Kamachiykunapi tikraykuna',
    s6p1: 'Kay kamachiykunata musuqchayta atiykum, llamk’aypi icha kamachikuypi tikraykunata rikuchinapaq. Kunan kaqtam kay kikin p’anqapi churasaqku, qipa musuqchay p’unchawta willaspa.',
    s6p2: 'Musuqchay qipaman llamk’achiyta qatiptiykiqa kunan kamachiykunata chaskisqaykitam nin.',

    ayudaTitulo: '¿Utqay yanapaytachu munanki?',
    ayudaTexto:
      'Qampaq icha huk wawapaq kunan manchay kaptinqa, ama yanapaqpa kutichiyninta suyaychu.',
    ayudaEnlace: 'Utqay yanapay tinkikunata qhaway',
  },

  contactos: {
    eyebrow: 'Utqay yanapay tinkikuna',
    titulo: 'Utqay yanapaypaq kamachiq wasikuna',
    intro:
      'Kunan qampaq, huk wawapaq icha huk runapaqpas manchay kaptinqa, utqay yanapay wasikunaman kikillanmanta riy. LegalFamqa manam qam rantiykipi wasikunaman rimanchu.',
    peligroLabel: 'Kunan manchay',
    peligroTitulo: 'PNPman 105 yupayman qayay',
    peligroTexto:
      'Maqanakuy kunan kachkaptin icha hatun manchachiy kaptinqa, ñawpaqta utqay yanapayman qayay icha aswan qaylla comisariaman riy.',
    llamar105: '105 qayay',
    listaAria: 'Yachaq yanapaq wasikuna',

    pnpNombre: 'Policía Nacional del Perú',
    pnpUso: 'Kunan manchay, maqanakuy kachkaptin, hatun manchachiykuna, comisariaman riy munaptiykipas.',
    pnpDisponibilidad: 'Llapan suyupi policía utqay yanapay.',
    pnpLlamar: '105 yupayman qayay',
    pnpContactos: 'PNP utqay yanapay tinkikuna',
    pnpComisaria: 'Qaylla comisariata tariy',

    cemNombre: 'Centros Emergencia Mujer',
    cemUso: 'Warmikunata, ayllu ukhupi runakunata maqay icha sexo hina maqay. Kamachiymanta, sunqumanta, runamasi kaymantawan yanapayta qunku.',
    cemDisponibilidad: 'Línea 100 nisqaqa llapan suyupaq yanapaywanmi kachkan; Chat 100 nisqaqa digital ñanninta atiendin, Warmi Ñan willasqan pachaman hina.',
    cemLlamar: 'Línea 100 nisqaman qayay',
    cemChat: 'Chat 100 nisqata kichay',
    cemDirectorio: 'CEM llamk’aykunap qillqan',

    demunaNombre: 'Defensoría Municipal del Niño y del Adolescente',
    demunaUso: 'Warmakunap, wayna-sipaskunap hayñin manchaypi icha p’akisqa kaptin: maqay, saqiy, mikhuy qullqi, wawa hap’iy, watukuy churaypas.',
    demunaDisponibilidad: 'Mana chaniyuq municipal llamk’ay. Atiendiyqa distritoykip icha provinciaykip municipalidadninmanmi hina.',
    demunaInfo: 'DEMUNA kamachiq willakuy',
    demunaMunicipalidad: 'Municipalidadniykita maskay',

    antesTitulo: 'Manaraq rimaspa',
    antesTexto:
      'Mana manchaypi churakuspa atiwaqchayqa, pisi rimaywan ima kasqanta, maypi kasqanta, ñak’arisqa runakunap hayk’a watayuq kasqanta, ima rikuchiykunatapas makiykipi hap’iy. Ama rikuchiykuna huñunaykipaq manchaypi churakuychu.',
  },

  // @@FIN@@
}

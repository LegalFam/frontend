// Catalogo de interfaz — es. Ver i18n/traducir.js para las reglas de uso.
// Las claves siguen el patron <superficie>.<bloque>.<slot>. La paridad con los otros catalogos
// se comprueba con `npm run i18n:check`.

export default {
  comun: {
    idioma: 'Idioma',
    verEnEspanol: 'Ver en español',
    verEn: 'Ver en {{idioma}}',
    verMas: 'Ver más',
    verMenos: 'Ver menos',
    volver: 'Volver',
    cancelar: 'Cancelar',
    cerrar: 'Cerrar',
    guardar: 'Guardar',
    cargando: 'Cargando...',
  },

  meta: {
    titulo: 'LegalFam — Orientación legal en derecho de familia',
    descripcion:
      'Orientación legal en derecho de familia para el Perú, con fuentes citadas y disponible en español, quechua y aymara.',
  },

  nav: {
    inicio: 'LegalFam inicio',
    menu: 'Menú',
    sobre: 'Sobre nosotros',
    como: 'Cómo funciona',
    precios: 'Precios',
    seguridad: 'Seguridad',
    privacidad: 'Privacidad',
    irAlChat: 'Ir al chat',
    cerrarSesion: 'Cerrar sesión',
    iniciarSesion: 'Iniciar sesión',
    registrarse: 'Registrarse',
  },

  landing: {
    hero: {
      pill: 'Derecho de Familia en el Perú',
      // El titular se parte en tres líneas en el diseño; la palabra en cursiva va aparte.
      titulo1: 'Tu derecho a la',
      tituloEnfasis: 'justicia',
      titulo2: 'no',
      titulo3: 'tiene precio.',
      descripcion:
        'Orientación jurídica en Derecho de Familia automatizada, clara y accesible para alimentos, tenencia, filiación y medidas de protección, disponible las 24 horas.',
      comenzar: 'Comenzar',
      irAlChat: 'Ir al chat',
      verComo: 'Ver cómo funciona',
      // Sellos y normas: los nombres propios de estándares y leyes no se traducen.
      sello1: 'ISO/IEC 27001',
      sello2: 'Ley N. 29733',
      sello3: 'Proyecto UPC 2026',
      stat1: 'Precisión validada',
      stat2: 'Disponibilidad',
      stat3: 'Gratuito',
      stat3Info: 'Se incluyen compras dentro de la aplicación',
    },

    sobre: {
      eyebrow: 'Sobre nosotros',
      titulo: 'Democratizando el acceso a la justicia en el Perú',
      intro:
        'LegalFam nació en la UPC para eliminar las barreras económicas, geográficas y de comprensión que impiden a miles de peruanos ejercer sus derechos fundamentales en temas de familia.',
      imgPrincipal: 'Asesoría legal',
      imgSecundaria: 'Documentos legales',
      badge: 'Universidad Peruana de Ciencias Aplicadas',
      rag: 'Tecnología RAG',
      ragDesc:
        'Recuperamos normativa y jurisprudencia peruana vigente para garantizar respuestas precisas y fundamentadas en cada consulta.',
      xai: 'Explicabilidad XAI',
      xaiDesc:
        'Mostramos siempre las fuentes legales que respaldan cada respuesta para que entiendas el razonamiento detrás de la orientación.',
      todos: 'Para todos',
      todosDesc:
        'Lenguaje claro y accesible, sin tecnicismos legales. Diseñado para personas de bajos recursos y poblaciones vulnerables del Perú.',
    },

    como: {
      eyebrow: 'Proceso',
      titulo: 'Cómo funciona',
      sub: 'En cuatro pasos simples obtienes orientación jurídica fundamentada en la normativa peruana vigente.',
      paso1: 'Regístrate gratis',
      paso1Desc: 'Crea tu cuenta con correo, nombre y número de celular peruano. Sin tarjeta de crédito requerida.',
      paso2: 'Describe tu situación',
      paso2Desc: 'Escribe tu consulta en lenguaje natural. El sistema entiende el contexto de tu caso familiar.',
      paso3: 'Recibe orientación',
      paso3Desc: 'Respuesta clara con fuentes legales citadas: artículos del Código Civil y normativa peruana vigente.',
      paso4: 'Evalúa la respuesta',
      paso4Desc: 'Califica la orientación recibida para ayudarnos a mejorar continuamente la precisión del sistema.',
    },

    seguridad: {
      eyebrow: 'Seguridad',
      titulo: 'Tu información está protegida',
      sub: 'Cumplimos estándares internacionales y la normativa peruana vigente en protección de datos personales.',
      iso27001: 'ISO/IEC 27001',
      iso27001Desc:
        'Gestión de seguridad de la información con estándares internacionales certificados para sistemas tecnológicos.',
      ley29733: 'Ley N. 29733',
      ley29733Desc:
        'Cumplimiento de la ley peruana de protección de datos personales en todo el tratamiento de tu información.',
      ssl: 'Cifrado SSL/TLS',
      sslDesc:
        'Toda la comunicación entre tu dispositivo y nuestros servidores viaja cifrada de extremo a extremo.',
      iso29100: 'ISO/IEC 29100',
      iso29100Desc:
        'Marco de privacidad para el tratamiento adecuado de información personal de los usuarios del sistema.',
      ley31814: 'Ley N. 31814',
      ley31814Desc:
        'Uso responsable de inteligencia artificial conforme a la normativa peruana vigente de innovación tecnológica.',
      jwt: 'Autenticación JWT',
      jwtDesc:
        'Tokens de acceso seguros con rotación automática y expiración configurable para proteger tu sesión.',
    },

    privacidad: {
      eyebrow: 'Privacidad',
      titulo: 'Tu privacidad es nuestra prioridad',
      sub: 'Tratamos tus datos conforme a la Ley N.° 29733 de Protección de Datos Personales y las mejores prácticas internacionales de privacidad.',
      contactoTitulo: 'Contacto de privacidad',
      contactoTexto:
        'Para ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación, Oposición) escríbenos a',
      control: 'Datos bajo tu control',
      controlDesc:
        'Eres el titular de tu información. Puedes consultar, rectificar o eliminar tus datos personales en cualquier momento.',
      sinVenta: 'Sin venta de datos',
      sinVentaDesc:
        'Nunca compartimos ni vendemos tu información personal a terceros con fines comerciales o publicitarios.',
      retencion: 'Retención limitada',
      retencionDesc:
        'Conservamos tu historial de consultas solo el tiempo necesario para brindarte el servicio. Puedes solicitar la eliminación de tu cuenta en todo momento.',
      transparencia: 'Transparencia total',
      transparenciaDesc:
        'Te informamos con claridad qué datos recopilamos, para qué los usamos y con quién los compartimos cuando sea necesario.',
      anonimizacion: 'Anonimización de consultas',
      anonimizacionDesc:
        'Las consultas legales se procesan de forma anonimizada. Ningún abogado externo tiene acceso a tu historial de conversaciones.',
    },

    banner: {
      cita: '"El acceso a la justicia no debería depender de cuánto dinero tienes en el bolsillo."',
      firma: '— LegalFam, 2026',
    },

    footer: {
      lema: 'Justicia accesible para todos',
      terminos: 'Términos y Condiciones',
      derechos: '© 2026 LegalFam — Universidad Peruana de Ciencias Aplicadas. Todos los derechos reservados.',
      aviso: 'Este sistema brinda orientación informativa y no reemplaza el asesoramiento de un abogado titulado.',
    },
  },

  planes: {
    // Nombres por código de plan. La clave es el código que devuelve el backend, así que no
    // hace falta un segundo mapa que mantener en paralelo.
    generico: 'Plan',
    nombre: {
      FREE: 'Plan gratuito',
      BASIC: 'Plan Básico',
      PREMIUM: 'Plan Premium',
    },
    boton: {
      FREE: 'Empezar gratis',
      BASIC: 'Suscribirse',
      PREMIUM: 'Suscribirse',
      generico: 'Suscribirse',
    },
    // Los precios y las cantidades se formatean siempre con es-PE: el formato del sol es
    // asunto de la moneda, no del lector, e Intl no tiene datos de quechua ni de aymara.
    porMes: '/ mes',
    tokensMensuales: '{{cantidad}} tokens mensuales',
    mensajes: '{{cantidad}} mensajes',
    dias: '{{cantidad}} días',
    historialCompleto: 'Completo',
    incluye: {
      asistente: 'Asistente de Derecho de Familia',
      fuentes: 'Fuentes legales citadas',
      calificacion: 'Calificación de respuestas',
    },

    seccion: {
      eyebrow: 'Planes',
      titulo: 'Elige tu plan',
      sub: 'El asistente es el mismo en todos los planes. Cambian la capacidad mensual, la memoria de la conversación y el historial disponible.',
      tablaResumen: 'Comparación de precios, capacidad mensual y funciones incluidas en cada plan',
      caracteristica: 'Característica',
      masPopular: 'Más popular',
      incluido: 'Incluido',
      planActual: 'Plan actual',
      irAlChat: 'Ir al chat',
      cambiarPlan: 'Cambiar plan',
      capacidad: 'Capacidad',
      capacidadHint: 'respecto al plan gratuito',
      tokens: 'Tokens mensuales',
      memoria: 'Memoria de la conversación',
      memoriaHint: 'contexto que recuerda el asistente',
      historial: 'Historial disponible',
      nota: 'Los precios incluyen IGV. Puedes cancelar tu suscripción en cualquier momento.',
    },
  },

  auth: {
    campos: {
      correo: 'Correo electrónico',
      correoPlaceholder: 'tucorreo@ejemplo.com',
      contrasena: 'Contraseña',
      contrasenaPlaceholder: '••••••••',
      mostrarContrasena: 'Mostrar contraseña',
      ocultarContrasena: 'Ocultar contraseña',
      nombre: 'Nombre',
      nombrePlaceholder: 'María',
      apellido: 'Apellido',
      apellidoPlaceholder: 'García',
      celular: 'Número de celular',
      celularPlaceholder: '987654321',
      contrasenaNueva: 'Contraseña nueva',
      minimoPlaceholder: 'Mínimo 8 caracteres',
      confirmar: 'Confirmar contraseña',
      confirmarPlaceholder: 'Repite tu contraseña',
    },

    // Validación en el navegador, antes de llamar al servidor. Los errores que devuelve el
    // backend viven en errores.* porque su clave es el código de error.
    validacion: {
      requerido: 'Campo requerido.',
      correoInvalido: 'Ingresa un correo válido.',
      contrasenaRequerida: 'La contraseña es requerida.',
      celularDigitos: 'Exactamente 9 dígitos.',
      contrasenaCorta: 'Mínimo 8 caracteres.',
      contrasenaNoCoincide: 'Las contraseñas no coinciden.',
      terminosRequeridos: 'Debes aceptar los términos para continuar.',
    },

    login: {
      titulo: 'Iniciar sesión',
      subtitulo: 'Accede a tu cuenta para continuar',
      olvidaste: '¿Olvidaste tu contraseña?',
      entrar: 'Ingresar',
      entrando: 'Ingresando...',
      sinCuenta: '¿No tienes cuenta?',
      registrate: 'Regístrate gratis',
    },

    registro: {
      titulo: 'Crear cuenta',
      subtitulo: 'Regístrate gratis y empieza a consultar',
      aceptoAntes: 'Acepto los',
      aceptoEnlace: 'Términos y Condiciones',
      aceptoDespues: 'y el tratamiento de mis datos personales.',
      notaDatos:
        'Tus datos se tratan conforme a la Ley N.° 29733. No compartimos ni vendemos tu información personal a terceros, y tus consultas se procesan de forma anonimizada.',
      crear: 'Crear cuenta gratis',
      creando: 'Creando cuenta...',
      yaTienes: '¿Ya tienes cuenta?',
      inicia: 'Inicia sesión',
      revisaCorreo: 'Revisa tu correo',
      enviamosEnlace:
        'Enviamos un enlace de confirmación a {{correo}}. Ábrelo para activar tu cuenta y poder iniciar sesión.',
      noLoVes: '¿No lo ves? Revisa la carpeta de spam. El enlace vence en 24 horas.',
      irAIniciar: 'Ir a iniciar sesión',
    },

    recuperar: {
      titulo: '¿Olvidaste tu contraseña?',
      subtitulo: 'Ingresa tu correo y te enviaremos un enlace para crear una nueva.',
      enviar: 'Enviar enlace',
      enviando: 'Enviando...',
      errorEnvio: 'No se pudo enviar el correo.',
      revisaCorreo: 'Revisa tu correo',
      siRegistrado:
        'Si {{correo}} está registrado, te enviamos un enlace para restablecer tu contraseña.',
      revisaSpam: 'Revisa también la carpeta de spam. El enlace vence en 1 hora.',
      volverIniciar: 'Volver a iniciar sesión',
      recordaste: '¿Recordaste tu contraseña?',
      inicia: 'Inicia sesión',
    },

    reenvio: {
      boton: 'Reenviar correo de verificación',
      reenviando: 'Reenviando...',
      espera: 'Reenviar en {{segundos}}s',
      exito: 'Te reenviamos el enlace. Revisa tu bandeja de entrada y la carpeta de spam.',
      error: 'No se pudo reenviar el correo.',
    },

    verificar: {
      verificando: 'Verificando tu correo',
      espera: 'Esto toma solo unos segundos.',
      exito: '¡Correo verificado!',
      exitoTexto: 'Tu cuenta está activa. Ya puedes iniciar sesión y empezar a consultar.',
      error: 'No pudimos verificar tu correo',
      sinToken: 'El enlace no incluye un código de verificación. Solicita uno nuevo.',
      errorGenerico: 'No se pudo verificar tu correo.',
    },

    restablecer: {
      titulo: 'Crea una contraseña nueva',
      subtitulo: 'Elige una contraseña de al menos 8 caracteres.',
      guardar: 'Guardar contraseña',
      guardando: 'Guardando...',
      sinToken: 'El enlace no incluye un código válido. Solicita uno nuevo.',
      errorGenerico: 'No se pudo actualizar tu contraseña.',
      pedirNuevo: 'Solicitar un enlace nuevo',
      listo: 'Contraseña actualizada',
      listoTexto: 'Ya puedes iniciar sesión con tu contraseña nueva.',
      listoHint: 'Por seguridad cerramos todas las sesiones abiertas en otros dispositivos.',
    },
  },

  config: {
    volverAlChat: 'Ir al chat',
    eyebrow: 'Cuenta',
    titulo: 'Configuración',
    subtitulo: 'Actualiza tus datos personales, tu contraseña y tu suscripción.',
    errorPerfil: 'No se pudo cargar tu perfil.',

    datos: {
      titulo: 'Datos personales',
      correoNota:
        'Para cambiar tu correo necesitamos verificar la nueva dirección. Esta opción estará disponible pronto.',
      guardar: 'Guardar cambios',
      guardado: 'Datos actualizados.',
      error: 'No se pudieron guardar tus datos.',
    },

    contrasena: {
      titulo: 'Contraseña',
      actual: 'Contraseña actual',
      nueva: 'Nueva contraseña',
      confirmarPlaceholder: 'Repite la nueva contraseña',
      cambiar: 'Cambiar contraseña',
      guardado: 'Contraseña actualizada.',
      error: 'No se pudo cambiar la contraseña.',
      actualIncorrecta: 'La contraseña actual es incorrecta.',
    },

    idioma: {
      titulo: 'Idioma',
      intro:
        'Elige la lengua en la que quieres usar LegalFam. El cambio se aplica al instante y queda guardado en este navegador.',
      // El usuario tiene que saber que esta misma elección viaja a la orientación legal, y que
      // el español sigue siendo la versión que prevalece: no es un detalle de interfaz.
      nota:
        'La misma elección decide en qué lengua escribes tu consulta y lees la respuesta. La orientación se redacta siempre en español y luego se traduce: la versión en español es la que prevalece.',
    },

    apariencia: {
      titulo: 'Apariencia',
      intro:
        'Elige la paleta con la que quieres ver LegalFam. El cambio se aplica al instante y queda guardado en este navegador.',
    },

    suscripcion: {
      titulo: 'Suscripción',
      planActual: 'Plan actual',
      tokensDisponibles: 'Tokens disponibles',
      cargando: 'Cargando información de tu suscripción...',
      dadaDeBaja: 'Suscripción dada de baja.',
      noRenovara:
        'No se renovará. Conservas tu plan y tus tokens hasta el {{fecha}}; después pasarás automáticamente al plan gratuito.',
      alDarDeBaja:
        'Al dar de baja no se renovará el próximo mes, pero conservas tu plan y tus tokens hasta el {{fecha}}.',
      darDeBaja: 'Dar de baja la suscripción',
      dandoDeBaja: 'Dando de baja...',
      errorBaja: 'No se pudo dar de baja la suscripción.',
      esGratuito: 'Tu plan actual es gratuito, no hay ninguna suscripción que dar de baja.',
      verPlanes: 'Ver planes y tokens',
      finPeriodo: 'final del periodo actual',

      confirmarTitulo: 'Dar de baja la suscripción',
      confirmarTexto1:
        'Tu suscripción dejará de renovarse, pero conservas tu plan y tus {{tokens}} tokens hasta el {{fecha}}.',
      confirmarTexto2:
        'Al terminar ese periodo pasarás al plan gratuito, con {{tokens}} tokens mensuales. Para volver a un plan de pago tendrás que contratarlo de nuevo.',
      confirmarBoton: 'Dar de baja',
    },
  },

  facturacion: {
    eyebrow: 'Suscripción',
    titulo: 'Plan y tokens',
    planActual: 'Plan actual',
    tokensDisponibles: 'Tokens disponibles',
    usados: '{{cantidad}} usados',
    restantes: '{{cantidad}} restantes',
    vencen: 'Tu plan y tus tokens vencen el {{fecha}}; después pasarás al plan gratuito.',
    renuevan: 'Tus tokens se renuevan el {{fecha}}.',
    costeTokens:
      'Cada consulta descuenta tokens cuando la respuesta queda lista: 1 token para consultas simples y hasta 3 tokens cuando la respuesta se apoya en fuentes legales.',
    planActivo: 'Plan activo',
    cambiarPlan: 'Cambiar plan',
    cancelar: 'Cancelar suscripción',
    cancelando: 'Cancelando...',
  },

  pago: {
    irAlInicio: 'Ir al inicio',
    resumen: 'Resumen del plan',
    procesadoPor: 'Pago procesado por Mercado Pago',
    checkoutTitulo: 'Checkout externo',
    checkoutSub:
      'LegalFam no captura datos de tarjeta. Te enviaremos a Mercado Pago para completar la suscripción y volverás aquí al terminar.',
    checkoutTexto:
      'Al continuar, Mercado Pago gestionará el pago recurrente. Al volver, actualizaremos tu plan y tokens.',
    continuar: 'Continuar a Mercado Pago',
    abriendo: 'Abriendo Mercado Pago...',
    errorCheckout: 'No se pudo iniciar el checkout. Intenta nuevamente.',
    volverAlChat: 'Volver al chat',

    retorno: {
      chat: 'Chat',
      cancelado: 'Checkout cancelado',
      canceladoTexto: 'No se realizó ningún cobro.',
      confirmando: 'Confirmando tu pago...',
      listo: '¡Listo! Tu plan está activo.',
      verificando: 'Estamos verificando tu suscripción',
      confirmandoMP: 'Confirmando con Mercado Pago...',
      estado: 'Plan actual: {{plan}}. Tokens disponibles: {{restantes}}/{{limite}}.',
      esperaHint:
        'Esto puede tardar hasta un minuto. No te preocupes, tu pago ya quedó registrado en Mercado Pago — solo estamos esperando la confirmación para activar tu plan.',
      tardaHint:
        'La confirmación está tardando más de lo habitual. Tu pago no se pierde: en cuanto la recibamos, tu plan se activa solo. Si en unos minutos sigues viendo el plan anterior, contáctanos.',
      irAlChat: 'Ir al chat',
    },
  },

  // Mensajes de error de la API. La clave ES el código que devuelve el backend, así que no
  // hay un segundo mapa que mantener sincronizado; ver utils/apiError.js.
  errores: {
    unauthorized: 'Tu sesión expiró. Inicia sesión nuevamente.',
    forbidden: 'No tienes permisos para realizar esta acción.',
    malformed_json: 'La solicitud no tiene un formato válido.',
    invalid_request: 'Revisa los datos ingresados e intenta nuevamente.',
    max_upload_size_exceeded: 'El archivo supera el tamaño permitido.',
    internal_server_error: 'Ocurrió un problema inesperado. Intenta nuevamente.',

    email_required: 'Ingresa tu correo electrónico.',
    email_invalid: 'Ingresa un correo electrónico válido.',
    email_too_long: 'El correo electrónico es demasiado largo.',
    password_required: 'Ingresa tu contraseña.',
    password_length_invalid: 'La contraseña no cumple con la longitud requerida.',
    name_required: 'Ingresa tu nombre.',
    name_too_long: 'El nombre es demasiado largo.',
    phone_required: 'Ingresa tu número de celular.',
    phone_too_long: 'El número de celular es demasiado largo.',
    refresh_token_required: 'No se pudo renovar la sesión. Inicia sesión nuevamente.',
    profile_request_required: 'Revisa los datos ingresados e intenta nuevamente.',
    password_request_required: 'Completa los campos de contraseña e intenta nuevamente.',
    current_password_invalid: 'La contraseña actual es incorrecta.',
    subscription_already_canceled: 'Tu suscripción ya está dada de baja y no se renovará.',
    message_required: 'Escribe una consulta antes de enviarla.',
    message_too_long: 'Tu consulta es demasiado larga. Reduce el texto e intenta nuevamente.',
    session_id_required: 'No se encontró la conversación. Vuelve a abrir el chat.',
    session_title_required: 'Ingresa un título para la conversación.',
    session_title_too_long: 'El título de la conversación es demasiado largo.',
    rating_required: 'Selecciona una calificación.',
    rating_out_of_range: 'La calificación debe estar entre 1 y 5.',
    feedback_comment_too_long: 'El comentario es demasiado largo.',
    plan_code_required: 'Selecciona un plan.',
    plan_code_too_long: 'El código del plan es demasiado largo.',
    plan_code_invalid: 'El plan seleccionado no es válido.',
    success_url_too_long: 'La URL de retorno es demasiado larga.',
    success_url_invalid: 'La URL de retorno no es válida.',
    cancel_url_too_long: 'La URL de cancelación es demasiado larga.',
    cancel_url_invalid: 'La URL de cancelación no es válida.',

    email_already_exists: 'Este correo ya está registrado.',
    invalid_credentials: 'Correo o contraseña incorrectos.',
    invalid_refresh_token: 'Tu sesión expiró. Inicia sesión nuevamente.',
    signup_request_required: 'Completa los datos para crear tu cuenta.',
    login_request_required: 'Ingresa tu correo y contraseña.',

    email_not_verified: 'Confirma tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.',
    email_already_verified: 'Tu correo ya está verificado. Inicia sesión.',
    token_required: 'El enlace no es válido. Solicita uno nuevo.',
    verification_token_invalid: 'El enlace de verificación no es válido o ya expiró. Solicita uno nuevo.',
    reset_token_invalid: 'El enlace para restablecer tu contraseña no es válido o ya expiró.',
    verify_email_request_required: 'El enlace no es válido. Solicita uno nuevo.',
    resend_verification_request_required: 'Ingresa tu correo electrónico.',
    forgot_password_request_required: 'Ingresa tu correo electrónico.',
    reset_password_request_required: 'Completa los campos para restablecer tu contraseña.',

    chat_session_not_found: 'No encontramos esta conversación.',
    chat_message_not_found: 'No encontramos este mensaje.',
    assistant_delivery_event_not_found: 'No encontramos la confirmación de entrega del mensaje.',
    message_processing_pending: 'Ya hay una consulta en proceso. Espera a que termine antes de enviar otra.',
    assistant_receipt_pending: 'La respuesta anterior aún se está confirmando. Espera unos segundos.',
    personal_data_not_allowed: 'Evita enviar DNI, teléfono, correo o dirección. Describe la situación de forma general.',
    metadata_only_assistant: 'La metadata solo puede aplicarse a respuestas del asistente.',
    only_assistant_messages_can_be_rated: 'Solo puedes calificar respuestas del asistente.',
    receipt_only_assistant_messages: 'Solo se puede confirmar la lectura de respuestas del asistente.',
    cursor_invalid: 'No se pudo cargar esa página de resultados. Intenta nuevamente.',
    upstream_error: 'No pude preparar la respuesta por un problema temporal. Puedes intentar nuevamente.',
    upstream_timeout: 'La respuesta está tardando más de lo esperado. Intenta nuevamente en unos segundos.',
    upstream_empty_response: 'El asistente no devolvió una respuesta. Intenta reformular tu consulta.',
    upstream_invalid_response: 'El asistente devolvió una respuesta que no pudimos procesar. Intenta nuevamente.',
    upstream_not_configured: 'El servicio del asistente no está configurado. Intenta más tarde.',
    upstream_unavailable: 'El servicio del asistente no está disponible. Intenta más tarde.',
    upstream_request_invalid: 'No se pudo preparar la consulta para el asistente. Intenta nuevamente.',
    agent_validation_failed: 'No pudimos validar la respuesta del asistente. Intenta nuevamente.',

    checkout_request_required: 'No se pudo iniciar el checkout. Intenta nuevamente.',
    paid_plan_required: 'Selecciona un plan de pago para continuar.',
    plan_not_purchasable: 'Este plan no está disponible para compra en este momento.',
    checkout_plan_already_active: 'Ya estás suscrito a este plan.',
    checkout_active_gateway_subscription: 'Cancela tu suscripción actual antes de cambiar de plan.',
    no_gateway_subscription_to_cancel: 'No tienes una suscripción activa para cancelar.',
    subscription_not_found: 'No encontramos tu suscripción.',
    subscription_inactive: 'Tu suscripción no está activa.',
    insufficient_tokens: 'No tienes tokens suficientes para enviar esta consulta.',
    webhook_payload_required: 'La notificación de pago está incompleta.',
    payment_webhook_unmatched_user: 'No pudimos asociar el pago a una cuenta.',
    webhook_payload_invalid: 'La notificación de pago no es válida.',
    webhook_user_reference_invalid: 'La referencia de usuario del pago no es válida.',
    webhook_request_id_required: 'La notificación de pago no incluye identificador de solicitud.',
    webhook_data_id_required: 'La notificación de pago no incluye identificador de datos.',
    webhook_signature_invalid: 'La firma de la notificación de pago no es válida.',
    webhook_signature_required: 'La notificación de pago no incluye firma.',
    webhook_signature_unverifiable: 'No pudimos verificar la firma de la notificación de pago.',
    payment_gateway_unavailable: 'Mercado Pago no está disponible en este momento. Intenta más tarde.',
    payment_gateway_empty_response: 'Mercado Pago no devolvió una respuesta válida. Intenta nuevamente.',
    payment_gateway_misconfigured: 'El checkout no está configurado correctamente. Intenta más tarde.',
    payment_gateway_payer_email_required: 'Mercado Pago requiere un correo del comprador.',
    payment_gateway_checkout_url_missing: 'Mercado Pago no devolvió el enlace de pago. Intenta nuevamente.',
    payment_gateway_subscription_id_required: 'No se encontró el identificador de la suscripción en Mercado Pago.',

    // Errores que no vienen del backend con un código: los produce el propio cliente.
    network_error: 'Conexión interrumpida. Estamos verificando el estado de la conversación.',
    _defecto: 'No se pudo completar la acción. Intenta nuevamente.',
    _asistente: 'No se pudo generar la respuesta. Intenta nuevamente.',
  },

  chat: {
    abrirHistorial: 'Abrir o cerrar historial',
    irAlInicio: 'Ir al inicio',
    cerrarSesion: 'Cerrar sesión',
    consulta: 'Consulta',
    consultaActual: 'Consulta Actual',
    tokensBadge: '{{plan}} · {{restantes}}/{{limite}} tokens',
    verPlanYTokens: 'Ver plan y tokens',
    reconectando: 'Reconectando con el chat...',
    cargandoAnteriores: 'Cargando mensajes anteriores...',
    presetsLabel: 'Empieza con una consulta frecuente',
    esperandoRespuesta:
      'Estamos preparando la respuesta de esta consulta. Cuando termine, se actualizarán tus tokens y podrás enviar otra.',
    otraEnProceso:
      'Hay otra consulta en proceso. Puedes revisar tus sesiones, pero espera a que termine para enviar una nueva.',
    // Markdown: lo renderiza ReactMarkdown igual que una respuesta del asistente.
    bienvenida:
      'Hola, **{{nombre}}**. Bienvenido/a a **LegalFam**.\n\nEstoy aquí para orientarte en temas de **Derecho de Familia** peruano: alimentos, tenencia, filiación y medidas de protección.\n\n¿Sobre qué situación legal deseas consultar hoy?',
    usuario: 'Usuario',
    sinTokens: 'Te has quedado sin tokens para enviar consultas. Recarga tu plan para continuar.',
    errorEnviar: 'No se pudo enviar tu consulta. Intenta nuevamente.',
    errorSesiones: 'No se pudieron cargar las sesiones.',
    errorMasSesiones: 'No se pudieron cargar más sesiones.',
    errorMensajes: 'No se pudieron cargar los mensajes.',
    errorMasMensajes: 'No se pudieron cargar más mensajes.',
    errorCalificacion: 'No se pudo guardar la calificación.',
    errorEliminar: 'No se pudo eliminar la consulta.',
    errorRenombrar: 'No se pudo renombrar la consulta.',

    presets: {
      alimentosLabel: 'Alimentos',
      alimentosPregunta: '¿Cómo solicito una pensión de alimentos para mi hijo?',
      tenenciaLabel: 'Tenencia',
      tenenciaPregunta: '¿Qué necesito para pedir la tenencia de mi hijo?',
      filiacionLabel: 'Filiación',
      filiacionPregunta: '¿Cómo puedo reconocer legalmente a mi hijo o iniciar un proceso de filiación?',
      proteccionLabel: 'Medidas de protección',
      proteccionPregunta: '¿Cómo solicito medidas de protección por violencia familiar?',
    },

    input: {
      placeholder: 'Escribe tu consulta legal...',
      placeholderEsperando: 'Espera la respuesta anterior para enviar otra consulta...',
      enviar: 'Enviar',
      preparando: 'Respuesta en preparación',
      idiomaGrupo: 'Idioma de la orientación',
      datosPersonales:
        'Evita enviar DNI, teléfono, correo o dirección. Describe la situación de forma general.',
      nota:
        'Los tokens se descuentan cuando la respuesta queda lista. No incluyas datos personales innecesarios.',
    },

    mensaje: {
      tu: 'Tu',
      sistema: 'Sistema',
      enviando: 'Enviando...',
      procesando: 'Procesando...',
      verificando: 'Verificando entrega...',
      noEnviado: 'No enviado',
      reintentar: 'Reintentar consulta',
      verPlanes: 'Ver planes y tokens',
      fuenteLegal: 'Fuente legal',
      fuentesUtilizadas: 'Fuentes utilizadas',
      resumenAsistente: 'Resumen del asistente',
      verFuente: 'Ver fuente',
      siguientesPasos: 'Siguientes pasos',
      comentario: 'Comentario',
      guardando: 'Guardando...',
      comentarioPlaceholder: 'Comentario opcional sobre la respuesta',
      guardarFeedback: 'Guardar feedback',
      calificar_one: 'Calificar {{n}} estrella',
      calificar_other: 'Calificar {{n}} estrellas',

      especialistaTitulo: 'Apoyo especializado recomendado',
      especialistaTexto:
        'Por el tipo de situación, considera acudir a una entidad especializada como CEM, PNP o DEMUNA, según corresponda, para recibir orientación y protección directa.',
      especialistaEnlace: 'Ver contactos de emergencia',

      fuentesDebilesTitulo: 'Fuentes de apoyo limitadas',
      fuentesDebilesTexto:
        'Estas fuentes pueden orientar, pero no respaldan de forma directa todos los puntos de la respuesta.',
      sinFuentesTitulo: 'Sin fuentes recuperadas',
      sinFuentesTexto:
        'Esta orientación es general y debe verificarse con una fuente oficial o asesoría especializada antes de tomar decisiones.',
      alcanceLimitadoTitulo: 'Información de alcance limitado',
      alcanceLimitadoTexto:
        'Esta orientación es general y puede no cubrir todos los detalles de tu caso. Para decisiones importantes, consulta con un abogado o una entidad competente.',
    },

    sidebar: {
      nueva: 'Nueva consulta',
      historial: 'Historial',
      buscar: 'Buscar consulta...',
      buscarAria: 'Buscar en el historial',
      limpiarBusqueda: 'Limpiar búsqueda',
      cargandoHistorial: 'Cargando historial...',
      sinConsultas: 'No hay consultas aún.',
      primeraPregunta: 'Haz tu primera pregunta.',
      sinResultados: 'No se encontraron consultas.',
      cargarMas: 'Cargar más',
      renombrar: 'Renombrar',
      eliminar: 'Eliminar',
      irAConfiguracion: 'Ir a configuración',
      usuario: 'Usuario',
      eliminarTitulo: 'Eliminar consulta',
      eliminarTexto: 'Se eliminará "{{titulo}}" del historial.',
      mostrarGlosario: 'Mostrar glosario',
      ocultarGlosario: 'Ocultar glosario',
    },

    glosario: {
      titulo: 'Glosario legal',
      volver: 'Volver al chat',
      // Los nombres de las figuras jurídicas se quedan en español a propósito: son el nombre
      // con el que existen en el ordenamiento peruano y con el que hay que pedirlas en una
      // comisaría o un juzgado. Lo que se traduce es la explicación.
      nombresEnEspanol:
        'Los nombres de estas figuras se mantienen en español porque así aparecen en las normas y así hay que pedirlas ante un juzgado, una comisaría o la DEMUNA. La explicación sí está traducida.',
    },
  },

  glosario: {
    casacion: {
      termino: 'Casación',
      definicion: 'Recurso extraordinario que se presenta ante la Corte Suprema para que revise si una sentencia de segunda instancia aplicó correctamente la ley o respetó las formas esenciales del proceso. No sirve para volver a discutir los hechos ni las pruebas, solo el derecho.',
    },
    pensionAlimentos: {
      termino: 'Pensión de alimentos',
      definicion: 'Cantidad de dinero que un padre o madre debe aportar periódicamente para cubrir la alimentación, vivienda, educación, salud y recreación de su hijo. Se fija según las necesidades del menor y las posibilidades de quien la paga.',
    },
    alimentista: {
      termino: 'Alimentista',
      definicion: 'Persona que tiene derecho a recibir una pensión de alimentos. Suele ser un hijo menor de edad, pero también puede serlo un hijo mayor que estudia, el cónyuge o incluso los padres del obligado.',
    },
    obligadoAlimentario: {
      termino: 'Obligado alimentario',
      definicion: 'Persona que debe pagar la pensión de alimentos. La obligación nace del vínculo familiar y se mantiene aunque no haya trato ni convivencia con el alimentista.',
    },
    asignacionAnticipada: {
      termino: 'Asignación anticipada de alimentos',
      definicion: 'Pensión provisional que el juez puede ordenar apenas iniciado el proceso, sin esperar a la sentencia, cuando la necesidad del alimentista es urgente y el vínculo familiar está acreditado.',
    },
    pensionesDevengadas: {
      termino: 'Pensiones devengadas',
      definicion: 'Pensiones ya vencidas que el obligado no pagó. Se calculan en una liquidación aprobada por el juez y se pueden cobrar por vía judicial, incluso mediante embargo o descuento por planilla.',
    },
    prorrateo: {
      termino: 'Prorrateo de alimentos',
      definicion: 'Reparto de los ingresos del obligado entre varios alimentistas cuando lo que gana no alcanza para cubrir todas las pensiones a la vez. Lo decide el juez a pedido de parte.',
    },
    redam: {
      termino: 'REDAM',
      definicion: 'Registro de Deudores Alimentarios Morosos. Lista pública en la que se inscribe a quien adeuda tres cuotas consecutivas o alternas de su pensión. Estar inscrito dificulta trámites como obtener créditos o ciertos puestos públicos.',
    },
    patriaPotestad: {
      termino: 'Patria potestad',
      definicion: 'Conjunto de deberes y derechos que tienen ambos padres sobre sus hijos menores de edad, como representarlos legalmente y administrar sus bienes. Se mantiene aunque los padres estén separados.',
    },
    tenencia: {
      termino: 'Tenencia',
      definicion: 'Determina con cuál de los padres vive habitualmente el hijo cuando estos no conviven. No elimina la patria potestad del otro padre ni su obligación de dar alimentos.',
    },
    tenenciaCompartida: {
      termino: 'Tenencia compartida',
      definicion: 'Modalidad en la que ambos padres se reparten el cuidado y la convivencia del hijo de forma equilibrada. Requiere que exista comunicación mínima entre ellos y que convenga al menor.',
    },
    variacionTenencia: {
      termino: 'Variación de tenencia',
      definicion: 'Pedido judicial para cambiar quién tiene la tenencia del hijo. Procede cuando cambian las circunstancias y el cambio beneficia al menor; normalmente se exige que haya transcurrido un tiempo desde la decisión anterior.',
    },
    regimenVisitas: {
      termino: 'Régimen de visitas',
      definicion: 'Horario y condiciones en que el padre o madre que no tiene la tenencia puede estar con su hijo. Puede acordarse entre las partes o fijarlo un juez.',
    },
    interesSuperior: {
      termino: 'Interés superior del niño',
      definicion: 'Principio que obliga a jueces y autoridades a decidir siempre por la opción que más beneficie al niño o adolescente, incluso por encima de lo que prefieran los padres.',
    },
    filiacion: {
      termino: 'Filiación',
      definicion: 'Vínculo legal entre padres e hijos. Puede establecerse por reconocimiento voluntario en el acta de nacimiento o por un proceso judicial de declaración de paternidad, que suele apoyarse en la prueba de ADN.',
    },
    reconocimientoVoluntario: {
      termino: 'Reconocimiento voluntario',
      definicion: 'Acto por el que una persona declara ante RENIEC o notario que es padre o madre de alguien, sin necesidad de juicio. Una vez hecho, es en principio irrevocable.',
    },
    impugnacionPaternidad: {
      termino: 'Impugnación de paternidad',
      definicion: 'Proceso para dejar sin efecto una paternidad ya inscrita cuando se demuestra que no corresponde a la realidad biológica. Tiene plazos y requisitos estrictos.',
    },
    medidasProteccion: {
      termino: 'Medidas de protección',
      definicion: 'Disposiciones que dicta un juez de familia para resguardar a una víctima de violencia familiar, como el retiro del agresor del domicilio, el impedimento de acercamiento o la prohibición de comunicación.',
    },
    fichaValoracion: {
      termino: 'Ficha de valoración de riesgo',
      definicion: 'Cuestionario que aplican la policía o el juzgado en casos de violencia para medir qué tan expuesta está la víctima. Su resultado influye en la urgencia y el tipo de medidas de protección que se dictan.',
    },
    violenciaFamiliar: {
      termino: 'Violencia familiar',
      definicion: 'Cualquier acción u omisión que cause daño físico, psicológico, sexual o económico entre integrantes del grupo familiar. Incluye el maltrato psicológico y el control del dinero, no solo la agresión física.',
    },
    conciliacionExtrajudicial: {
      termino: 'Conciliación extrajudicial',
      definicion: 'Acuerdo al que llegan las partes ante un centro de conciliación autorizado, sin ir a juicio. En materias como alimentos, tenencia y visitas el acta tiene el mismo valor que una sentencia.',
    },
    separacionConvencional: {
      termino: 'Separación convencional',
      definicion: 'Vía para separarse de mutuo acuerdo, sin culpar a nadie, tramitable en municipalidad, notaría o juzgado. Exige un acuerdo previo sobre alimentos, tenencia y bienes, y transcurrido un plazo puede convertirse en divorcio.',
    },
    sociedadGananciales: {
      termino: 'Sociedad de gananciales',
      definicion: 'Régimen patrimonial que rige el matrimonio por defecto: lo que cada cónyuge adquiere durante la unión se considera común y, al terminar, se reparte por mitades. Puede sustituirse por separación de patrimonios.',
    },
    tutelaCuratela: {
      termino: 'Tutela y curatela',
      definicion: 'Figuras para proteger a quien no puede valerse por sí mismo. La tutela se aplica a menores sin padres que ejerzan la patria potestad; la curatela, a personas mayores de edad con capacidad restringida.',
    },
    demuna: {
      termino: 'DEMUNA',
      definicion: 'Defensoría Municipal del Niño y del Adolescente. Servicio municipal gratuito que orienta y puede conciliar en casos de alimentos, tenencia y régimen de visitas, además de atender vulneraciones de derechos de menores.',
    },
    juzgadoPazLetrado: {
      termino: 'Juzgado de Paz Letrado',
      definicion: 'Instancia judicial que suele ver los procesos de alimentos. Los casos de tenencia, régimen de visitas, filiación y violencia familiar corresponden en cambio al Juzgado de Familia.',
    },
    urp: {
      termino: 'Unidades de Referencia Procesal (URP)',
      definicion: 'Valor que sirve para calcular montos dentro de un proceso judicial, como los aranceles, las multas o la cuantía de la demanda. Equivale al 10% de la Unidad Impositiva Tributaria (UIT) vigente, por lo que su monto en soles se actualiza cada año.',
    },
  },

  terminos: {
    eyebrow: 'Legal',
    titulo: 'Términos y Condiciones',
    intro:
      'Estas condiciones regulan el uso de LegalFam. Al crear una cuenta declaras haberlas leído y aceptado.',
    // Va como clave y no como fecha formateada porque cada lengua nombra los meses a su
    // manera y esto es texto, no un dato calculado.
    actualizacion: 'Última actualización: julio de 2026',

    s1Titulo: '1. Objeto del servicio',
    s1p1: 'LegalFam es un asistente digital que brinda orientación informativa sobre Derecho de Familia peruano, en particular alimentos, tenencia, filiación y medidas de protección.',
    s1p2: 'El servicio no constituye asesoría legal ni patrocinio jurídico, y no reemplaza la consulta con un abogado titulado. Las respuestas son orientativas y no generan una relación abogado-cliente.',
    s1p3: 'Si existe riesgo actual para ti, un menor de edad u otra persona, acude directamente a los canales oficiales de emergencia.',

    s2Titulo: '2. Cuenta de usuario',
    s2p1: 'Para usar el chat debes crear una cuenta con un correo electrónico válido y un número de contacto. Eres responsable de la veracidad de esos datos y de mantener la confidencialidad de tu contraseña.',
    s2p2: 'La cuenta es personal e intransferible. No está permitido usar el servicio para fines comerciales, para revender las respuestas, ni para automatizar consultas masivas.',
    s2p3: 'Puedes solicitar la eliminación de tu cuenta y de tu historial de consultas en cualquier momento.',

    s3Titulo: '3. Tokens y compras dentro de la aplicación',
    s3p1: 'El uso de LegalFam es gratuito: toda cuenta recibe un balance mensual de tokens sin costo alguno. Cada consulta descuenta tokens cuando la respuesta queda lista: 1 token para consultas simples y hasta 3 tokens cuando la respuesta se apoya en fuentes legales.',
    s3p2: 'La aplicación incluye compras opcionales: planes de suscripción mensual que amplían el balance de tokens. Ningún plan de pago es necesario para usar el servicio con el balance gratuito.',
    s3p3: 'Los pagos se procesan a través de Mercado Pago. LegalFam no almacena los datos de tu tarjeta. Puedes cancelar tu suscripción en cualquier momento desde la vista de configuración; el plan permanece activo hasta el final del periodo ya pagado y no se renueva.',

    s4Titulo: '4. Tratamiento de datos personales',
    s4p1: 'Tratamos tus datos conforme a la Ley N.° 29733, Ley de Protección de Datos Personales, y su reglamento.',
    s4p2: 'No compartimos ni vendemos tu información personal a terceros con fines comerciales o publicitarios. Las consultas legales se procesan de forma anonimizada y ningún abogado externo tiene acceso a tu historial de conversaciones.',
    s4p3: 'Conservamos tu historial solo el tiempo necesario para prestarte el servicio. Te recomendamos no incluir datos personales innecesarios en tus consultas, como DNI, teléfono, correo o dirección.',
    s4p4: 'Puedes ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) escribiendo a privacidad@legalfam.pe.',

    s5Titulo: '5. Limitación de responsabilidad',
    s5p1: 'LegalFam no se responsabiliza por decisiones tomadas exclusivamente sobre la base de la orientación brindada por el asistente. La normativa peruana puede cambiar y cada caso concreto tiene particularidades que requieren evaluación profesional.',
    s5p2: 'El servicio se ofrece tal como está. No garantizamos disponibilidad ininterrumpida ni ausencia de errores en las respuestas generadas automáticamente.',

    s6Titulo: '6. Cambios en los términos',
    s6p1: 'Podemos actualizar estos términos para reflejar cambios en el servicio o en la normativa aplicable. Publicaremos la versión vigente en esta misma página, indicando la fecha de la última actualización.',
    s6p2: 'El uso continuado del servicio después de una actualización implica la aceptación de los términos vigentes.',

    ayudaTitulo: '¿Necesitas ayuda urgente?',
    ayudaTexto:
      'Si hay riesgo actual para ti o para un menor de edad, no esperes una respuesta del asistente.',
    ayudaEnlace: 'Ver contactos de emergencia',
  },

  contactos: {
    eyebrow: 'Contactos de emergencia',
    titulo: 'Canales oficiales para situaciones de emergencia',
    intro:
      'Si hay riesgo actual para ti, un menor de edad u otra persona, usa los canales de emergencia directamente. LegalFam no contacta instituciones por ti.',
    peligroLabel: 'Peligro inmediato',
    peligroTitulo: 'Llama a la PNP al 105',
    peligroTexto:
      'Si la agresión está ocurriendo o existe una amenaza grave, prioriza llamar a emergencias o acudir a la comisaría más cercana.',
    llamar105: 'Llamar 105',
    listaAria: 'Instituciones de apoyo especializado',

    // Las siglas y los nombres de las instituciones no se traducen en ninguna lengua: es el
    // nombre con el que hay que pedirlas y el que aparece en la puerta. Los teléfonos y
    // enlaces tampoco cambian.
    pnpNombre: 'Policía Nacional del Perú',
    pnpUso: 'Peligro inmediato, agresión en curso, amenazas graves o necesidad de acudir a una comisaría.',
    pnpDisponibilidad: 'Emergencias policiales a nivel nacional.',
    pnpLlamar: 'Llamar al 105',
    pnpContactos: 'Contactos de emergencia PNP',
    pnpComisaria: 'Ubicar comisaría cercana',

    cemNombre: 'Centros Emergencia Mujer',
    cemUso: 'Violencia contra mujeres, integrantes del grupo familiar o violencia sexual. Brindan orientación legal, psicológica y social.',
    cemDisponibilidad: 'Línea 100 disponible para orientación nacional; Chat 100 atiende por canal digital según horario informado por Warmi Ñan.',
    cemLlamar: 'Llamar a Línea 100',
    cemChat: 'Abrir Chat 100',
    cemDirectorio: 'Directorio de servicios CEM',

    demunaNombre: 'Defensoría Municipal del Niño y del Adolescente',
    demunaUso: 'Riesgo o vulneración de derechos de niños, niñas y adolescentes, incluyendo maltrato, abandono, alimentos, tenencia o régimen de visitas.',
    demunaDisponibilidad: 'Servicio municipal gratuito. La atención depende de la municipalidad de tu distrito o provincia.',
    demunaInfo: 'Información oficial DEMUNA',
    demunaMunicipalidad: 'Buscar tu municipalidad',

    antesTitulo: 'Antes de contactar',
    antesTexto:
      'Si puedes hacerlo sin ponerte en riesgo, ten a la mano una descripción breve de lo ocurrido, ubicación general, edades aproximadas de las personas afectadas y cualquier evidencia relevante. Evita exponerte para reunir pruebas.',
  },

  // @@FIN@@
}

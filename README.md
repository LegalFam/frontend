# LegalFam Frontend

Sistema Web de Asesoría Legal Automatizada en Derecho de Familia — UPC 2026

## Stack

- React 18 + Vite
- React Router v6
- Zustand (estado global)
- Axios (llamadas API con refresh token automático)
- CSS Modules

## Estructura

```
src/
├── components/
│   ├── auth/          # LoginModal, RegisterModal, ProtectedRoute
│   ├── chat/          # ChatSidebar, ChatMessage, ChatInput, TypingIndicator
│   ├── landing/       # HeroSection, SobreSection, ComoSection, PreciosSection, SeguridadSection, BannerSection
│   └── layout/        # Navbar
├── hooks/             # useAuth, useChat
├── pages/             # LandingPage, ChatPage
├── services/          # api.js (todos los endpoints)
├── store/             # authStore, chatStore (Zustand)
├── assets/            # logo.png
└── index.css          # Variables globales CSS
```

## Instalación

```bash
npm install
```

## Desarrollo

Asegúrate de tener el backend corriendo en `http://localhost:8080` o la URL que hayas configurado.

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Build producción

```bash
npm run build
```

## Despliegue en GCP

Para desplegar el frontend en Firebase Hosting con CI/CD desde GitHub Actions,
usa la guía:

```text
GCP_FIREBASE_HOSTING_CICD.md
```

## Subir a GitHub

```bash
# 1. Inicializar git (solo la primera vez)
git init

# 2. Agregar todos los archivos
git add .

# 3. Primer commit
git commit -m "feat: initial LegalFam frontend"

# 4. Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU_USUARIO/legalfam-frontend.git

# 5. Subir
git branch -M main
git push -u origin main
```

## Variables de entorno

Modifica el archivo `.env` en la raíz del proyecto para configurar la URL base de tu API:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Incluye el prefijo completo que expone el backend. Si el prefijo cambia, solo actualiza esta variable de entorno.

## Endpoints integrados

Las rutas son relativas a `/api/v1`.

| Método | Ruta | Uso |
|--------|------|-----|
| POST | `/auth/signup` | Registro |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token automático |
| GET | `/payments/plans` | Listar planes |
| GET | `/payments/subscription` | Suscripción y tokens |
| POST | `/payments/checkout-sessions` | Crear checkout |
| POST | `/payments/subscription/cancel` | Cancelar suscripción |
| POST | `/chat/sessions` | Crear sesión |
| GET | `/chat/sessions` | Listar sesiones |
| PATCH | `/chat/sessions/:id` | Renombrar sesión |
| DELETE | `/chat/sessions/:id` | Eliminar sesión |
| GET | `/chat/sessions/:id/messages` | Mensajes de una sesión |
| GET | `/chat/subscribe/:id` | Eventos SSE del chat |
| POST | `/chat/send` | Enviar mensaje |
| PATCH | `/chat/messages/:id/rating` | Calificar respuesta |
| PATCH | `/chat/messages/:id/receipt` | Confirmar lectura |

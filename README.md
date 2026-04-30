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

Asegúrate de tener el backend corriendo en `http://localhost:8080`.

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Build producción

```bash
npm run build
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

## Variables de entorno (opcional)

Si el backend corre en otra URL, crea un `.env.local`:

```
VITE_API_URL=http://localhost:8080
```

Y actualiza `src/services/api.js`:
```js
const BASE_URL = import.meta.env.VITE_API_URL + '/api/v1'
```

## Endpoints integrados

| Método | Ruta | Uso |
|--------|------|-----|
| POST | `/auth/signup` | Registro |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token automático |
| POST | `/chat` | Enviar mensaje |
| GET | `/chat/sessions` | Listar sesiones |
| GET | `/chat/sessions/:id/messages` | Mensajes de una sesión |
| PATCH | `/chat/messages/:id/rating` | Calificar respuesta |

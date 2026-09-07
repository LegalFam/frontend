import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { initTema } from './theme'
import { initIdioma } from './store/idiomaStore'

initTema()
// Antes del primer render, para que <html lang> ya sea el correcto al pintar.
initIdioma()

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

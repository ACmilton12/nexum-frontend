import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'

// Aplicar tema antes del primer renderizado para evitar el flash blanco
// Por defecto el sistema inicia en modo claro si el usuario no tiene preferencia guardada
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
  localStorage.setItem('theme', 'light') // Opcional, pero asegura consistencia
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import App from './App.jsx'

// Automatically register PWA service worker in production/dev
registerSW({ immediate: true })

// Automatically reload when a new version is deployed and old chunks fail to load
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Vite dynamic import preload error detected. Reloading page to fetch latest version...', event)
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// LMAO WHAT UP LOSER WHY U HERE - BALOOOOOOT
// I have to add this
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import App from './App.jsx'

// Automatically register PWA service worker in production/dev
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// LMAO WHAT UP LOSER WHY U HERE - BALOOOOOOT
// I have to add this
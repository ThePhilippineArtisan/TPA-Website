import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

// This is the "HTML" you see when you click [Inspect Element]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
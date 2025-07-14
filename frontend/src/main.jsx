import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

// This is the "HTML" you see when you click [Inspect Element]

document.body.style.cursor = "url('/cursor.png'), auto";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
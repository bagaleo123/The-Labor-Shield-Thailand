import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'
import { createRouter } from './router'
import './index.css'

const router = createRouter()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>,
)

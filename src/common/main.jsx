import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Routing from './Routing'
import AuthProvider from '../auth/AuthProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Routing />
    </AuthProvider>
  </StrictMode>,
)
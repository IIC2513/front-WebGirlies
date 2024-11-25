import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Routing from './Routing'
import AuthProvider from '../auth/AuthProvider'
import SocketProvider from '../sockets/SocketProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <Routing />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)
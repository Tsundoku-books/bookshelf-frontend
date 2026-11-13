import '../design-system/tokens/tokens.css'
import '../design-system/components/components.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/merriweather/400.css'
import '@fontsource/merriweather/400-italic.css'
import '@fontsource/merriweather/700.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { PlaygroundProvider } from './contexts/PlaygroundContext'
import App from './App.tsx'
import './i18n'
import './index.css'
import { registerServiceWorker } from './lib/registerServiceWorker'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <PlaygroundProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </PlaygroundProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

registerServiceWorker()

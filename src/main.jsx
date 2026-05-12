import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BookingProvider } from './state/BookingContext.jsx'
import { siteConfig } from './siteConfig.js'
import './index.css'

// Reflect the brand in the browser tab (index.html ships a static fallback title).
document.title = `${siteConfig.brandName} — Booking`

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BookingProvider>
      <App />
    </BookingProvider>
  </React.StrictMode>
)

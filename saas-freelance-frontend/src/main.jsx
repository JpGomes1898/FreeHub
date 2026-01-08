import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. IMPORTANTE: Mude de BrowserRouter para HashRouter
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolva o App com HashRouter */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
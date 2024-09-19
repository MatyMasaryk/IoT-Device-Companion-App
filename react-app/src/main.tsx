import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter } from 'react-router-dom'
import "./language/i18n.ts"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.Suspense>
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Reclamacao from './pages/Reclamacao.jsx'
import './index.css'

// Roteamento simples: /reclamacao abre a página pública (sem login).
// Qualquer outro caminho abre o sistema.
const publico = window.location.pathname.replace(/\/+$/, '') === '/reclamacao'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {publico ? <Reclamacao /> : <App />}
  </React.StrictMode>,
)

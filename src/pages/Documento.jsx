import { imprimirDocumento } from '../documento.js'

// Mostra o documento (ata ou ficha) na tela e permite exportar / imprimir.
export default function Documento({ titulo, html, onClose }) {
  return (
    <div className="overlay" onClick={e => { e.stopPropagation(); onClose() }} style={{ zIndex: 60 }}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 720 }}>
        <div className="mhead" style={{ justifyContent: 'space-between' }}>
          <div className="info"><b>{titulo}</b><p>Pré-visualização do documento</p></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="addbtn" style={{ margin: 0 }} onClick={() => imprimirDocumento(titulo, html)}>🖨️ Imprimir / PDF</button>
            <button className="mclose" style={{ position: 'static' }} onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="mbody">
          <div className="docprev" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}

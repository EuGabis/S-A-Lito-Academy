// Caixa de confirmação reutilizável (ex: antes de excluir algo).
export default function Confirmacao({ titulo, mensagem, confirmarLabel = 'Excluir', onConfirmar, onCancelar }) {
  return (
    <div className="overlay" onClick={onCancelar} style={{ zIndex: 70 }}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 400 }}>
        <div className="mbody" style={{ gap: 16 }}>
          <div>
            <b style={{ fontSize: 17, fontWeight: 700, display: 'block' }}>{titulo}</b>
            <p style={{ fontSize: 14, color: 'var(--sub)', marginTop: 6, lineHeight: 1.5 }}>{mensagem}</p>
          </div>
          <div className="formfoot">
            <button className="btn-ghost" onClick={onCancelar}>Cancelar</button>
            <button className="btn-danger" onClick={onConfirmar}>{confirmarLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

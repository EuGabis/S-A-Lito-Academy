import { useState } from 'react'
import { G } from '../data.js'
import { useStore } from '../store.jsx'
import { Avatar, Badge } from '../ui.jsx'
import Confirmacao from './Confirmacao.jsx'

// Formulário inline para adicionar uma tarefa a uma coluna.
function AddForm({ onAdd, onCancel }) {
  const [texto, setTexto] = useState('')
  const salvar = () => { if (texto.trim()) onAdd(texto.trim()) }
  return (
    <div className="kaddform">
      <input className="inp2" autoFocus value={texto} placeholder="Título da tarefa..."
        onChange={e => setTexto(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') salvar(); if (e.key === 'Escape') onCancel() }} />
      <div className="acts">
        <button style={{ background: 'var(--brand)', color: '#fff' }} onClick={salvar}>Adicionar</button>
        <button style={{ background: 'var(--faint)', color: 'var(--sub)' }} onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}

export default function Tarefas() {
  const { colunas, adicionarTarefa, removerTarefa, moverTarefa } = useStore()
  const [addCol, setAddCol] = useState(null) // índice da coluna em modo "adicionar"
  const [excluir, setExcluir] = useState(null) // { ci, ti, titulo } | null
  const [arrastando, setArrastando] = useState(null) // { ci, ti } | null
  const [colAlvo, setColAlvo] = useState(null) // coluna destacada no arrasto

  const soltarNaColuna = (toCi, toTi = null) => {
    if (arrastando) moverTarefa(arrastando, toCi, toTi)
    setArrastando(null)
    setColAlvo(null)
  }

  const adicionar = (ci, titulo) => {
    const nova = { t: titulo, tag: 'Nova', tc: G.brand, tb: 'var(--vio)', due: 'Hoje', a: G.brand, b: G.teal }
    adicionarTarefa(ci, nova)
    setAddCol(null)
  }

  const confirmarExclusao = () => {
    removerTarefa(excluir.ci, excluir.ti)
    setExcluir(null)
  }

  return (
    <>
    <div className="board">
      {colunas.map((c, ci) => (
        <div
          className={`kcol ${colAlvo === ci ? 'over' : ''}`}
          key={ci}
          onDragOver={e => { e.preventDefault(); if (arrastando) setColAlvo(ci) }}
          onDrop={() => soltarNaColuna(ci)}
        >
          <div className="kh"><div className="dot" style={{ background: c.cor }} />{c.titulo}<span className="cnt">{c.tarefas.length}</span></div>
          {c.tarefas.map((t, ti) => (
            <div
              className={`kcard ${arrastando && arrastando.ci === ci && arrastando.ti === ti ? 'dragging' : ''}`}
              key={ti}
              draggable
              onDragStart={() => setArrastando({ ci, ti })}
              onDragEnd={() => { setArrastando(null); setColAlvo(null) }}
              onDragOver={e => { e.preventDefault(); if (arrastando) setColAlvo(ci) }}
              onDrop={e => { e.stopPropagation(); soltarNaColuna(ci, ti) }}
            >
              <div className="ktop">
                <Badge text={t.tag} color={t.tc} bg={t.tb} />
                <button className="kdel" title="Excluir tarefa" onClick={() => setExcluir({ ci, ti, titulo: t.t })}>✕</button>
              </div>
              <div className="kt">{t.t}</div>
              <div className="kf">
                <Avatar name="" a={t.a} b={t.b} size={28} />
                <div className="due">🕑 {t.due}</div>
              </div>
            </div>
          ))}
          {addCol === ci
            ? <AddForm onAdd={titulo => adicionar(ci, titulo)} onCancel={() => setAddCol(null)} />
            : <button className="kadd" onClick={() => setAddCol(ci)}>+ Adicionar tarefa</button>}
        </div>
      ))}
    </div>

    {excluir && (
      <Confirmacao
        titulo="Excluir tarefa?"
        mensagem={`A tarefa "${excluir.titulo}" será removida. Essa ação não pode ser desfeita.`}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluir(null)}
      />
    )}
    </>
  )
}

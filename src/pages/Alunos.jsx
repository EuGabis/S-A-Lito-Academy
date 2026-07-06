import { useState } from 'react'
import { statusColors, proximoContato } from '../data.js'
import { useStore } from '../store.jsx'
import { Avatar, Badge, ProgressBar } from '../ui.jsx'
import FichaAluno from './FichaAluno.jsx'
import AdicionarAluno from './AdicionarAluno.jsx'

// Cor da barra de progresso conforme o percentual.
const barColor = (p) => p >= 0.7 ? ['#14c5a7', '#26c478'] : p >= 0.5 ? ['#6d5ef6', '#a37af7'] : ['#ffa826', '#ff6392']

const FILTROS = ['Todos', 'Ativos', 'Em risco', 'Formados']

export default function Alunos() {
  const { alunos, adicionarAluno } = useStore()
  const [filtro, setFiltro] = useState('Todos')
  const [aberto, setAberto] = useState(null)
  const [cadastrando, setCadastrando] = useState(false)

  const adicionar = (novo) => {
    adicionarAluno(novo)
    setCadastrando(false)
  }

  const lista = alunos.filter(a => {
    if (filtro === 'Ativos') return a.status === 'Ativo'
    if (filtro === 'Em risco') return a.status === 'Em risco'
    if (filtro === 'Formados') return a.status === 'Formado'
    return true
  })

  return (
    <>
      <div className="filters">
        {FILTROS.map(f => (
          <button key={f} className={`filt ${f === filtro ? 'on' : ''}`} onClick={() => setFiltro(f)}>{f}</button>
        ))}
        <button className="addbtn" onClick={() => setCadastrando(true)}>+ Adicionar aluno</button>
      </div>

      <div className="grid">
        {lista.map((a, i) => {
          const [c1, c2] = barColor(a.progresso)
          const sc = statusColors[a.status]
          return (
            <div className="scard" key={i} onClick={() => setAberto(a)}>
              <div className="top2">
                <Avatar name={a.name} a={a.a} b={a.b} size={46} />
                <div className="nm">
                  <b>{a.name}</b>
                  <p>{a.email}</p>
                </div>
              </div>
              <div className="meta">
                <span className="curso">{a.curso}</span>
                <Badge text={a.status} color={sc.color} bg={sc.bg} />
              </div>
              <div className="g">
                <div className="gh"><b>Progresso</b><span>{Math.round(a.progresso * 100)}%</span></div>
                <ProgressBar pct={a.progresso} a={c1} b={c2} />
              </div>
              <div className="foot">
                <span>Última atividade</span>
                <span>{a.ultima}</span>
              </div>
              {(() => {
                const prox = proximoContato(a.jornada)
                if (!prox) return <div className="alerta ok">✓ Jornada concluída</div>
                const quando = prox.agendado
                  ? ` · ${prox.agendado.split('-').reverse().slice(0, 2).join('/')}${prox.horaAgendada ? ' ' + prox.horaAgendada : ''}`
                  : ''
                return <div className="alerta pend">🔔 Próximo: {prox.fase}{quando}</div>
              })()}
            </div>
          )
        })}
      </div>

      {aberto && <FichaAluno aluno={aberto} onClose={() => setAberto(null)} />}
      {cadastrando && <AdicionarAluno total={alunos.length} onClose={() => setCadastrando(false)} onSalvar={adicionar} />}
    </>
  )
}

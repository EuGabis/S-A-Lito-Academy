import { useState } from 'react'
import { calendario } from '../data.js'
import { useStore } from '../store.jsx'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Ordena eventos por horário (os sem horário vão pro fim).
const porHora = (a, b) => (a.hora || '99:99').localeCompare(b.hora || '99:99')

// Caixa (modal) de um dia: lista os eventos, permite adicionar e remover.
function DiaModal({ dia, eventos, tipos, alunos, onAdd, onRemove, onClose }) {
  const [titulo, setTitulo] = useState('')
  const [hora, setHora] = useState('08:00')
  const [tipo, setTipo] = useState(tipos[0])
  const [aluno, setAluno] = useState('')

  const escolherAluno = (nome) => {
    setAluno(nome)
    if (nome) setTitulo(`${tipo.nome} — ${nome}`)
  }

  const adicionar = () => {
    const t = titulo.trim() || tipo.nome
    onAdd(dia, { titulo: t, cor: tipo.cor, hora })
    setTitulo('')
    setAluno('')
  }

  const ordenados = eventos.map((e, i) => ({ ...e, _i: i })).sort(porHora)

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 460 }}>
        <div className="mhead">
          <div className="info"><b>{dia} de Julho, 2026</b><p>{eventos.length} evento{eventos.length === 1 ? '' : 's'}</p></div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          {ordenados.length === 0
            ? <p style={{ color: 'var(--mut)', fontSize: 13 }}>Nenhum evento neste dia.</p>
            : ordenados.map((e) => (
              <div className="it" key={e._i}>
                <div className="evbar" style={{ height: 34, background: e.cor }} />
                {e.hora && <span style={{ width: 46, fontSize: 12, fontWeight: 600, color: 'var(--sub)' }}>{e.hora}</span>}
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{e.titulo}</span>
                <button className="rm" onClick={() => onRemove(dia, e._i)}>Remover</button>
              </div>
            ))}

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4 }} className="form">
            <div className="upltitle">Adicionar evento</div>
            <div className="fitem" style={{ marginBottom: 12 }}>
              <label>Aluno (opcional)</label>
              <select className="inp2" value={aluno} onChange={e => escolherAluno(e.target.value)}>
                <option value="">— Nenhum —</option>
                {alunos.map((a, i) => <option key={i} value={a.name}>{a.name}</option>)}
              </select>
            </div>
            <div className="frow" style={{ gridTemplateColumns: '1fr 100px' }}>
              <div className="fitem">
                <label>Título</label>
                <input className="inp2" value={titulo} placeholder="Ex: Prova de Célula"
                  onChange={e => setTitulo(e.target.value)} onKeyDown={e => e.key === 'Enter' && adicionar()} />
              </div>
              <div className="fitem">
                <label>Horário</label>
                <input className="inp2" type="time" value={hora} onChange={e => setHora(e.target.value)} />
              </div>
            </div>
            <div className="fitem" style={{ marginTop: 12 }}>
              <label>Tipo</label>
              <select className="inp2" value={tipo.nome} onChange={e => setTipo(tipos.find(t => t.nome === e.target.value))}>
                {tipos.map(t => <option key={t.nome} value={t.nome}>{t.nome}</option>)}
              </select>
            </div>
            <button className="addbtn" style={{ margin: '12px 0 0' }} onClick={adicionar}>+ Adicionar ao dia {dia}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Calendario() {
  const { alunos, eventos, adicionarEvento, removerEvento } = useStore()
  const { hoje, tiposEvento } = calendario
  const [diaAberto, setDiaAberto] = useState(null)

  const cells = [null, null, null]
  for (let d = 1; d <= 31; d++) cells.push(d)
  while (cells.length % 7) cells.push(null)

  const semanas = []
  for (let w = 0; w < cells.length / 7; w++) semanas.push(cells.slice(w * 7, w * 7 + 7))

  const agendaHoje = (eventos[hoje] || []).slice().sort(porHora)

  return (
    <div className="row">
      <div className="card" style={{ flex: 3, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="sechead">Julho 2026<div className="cnav"><b>‹</b><b>Hoje</b><b>›</b></div></div>
        <div className="wd">{DIAS.map(d => <span key={d}>{d}</span>)}</div>
        {semanas.map((semana, wi) => (
          <div className="week" key={wi}>
            {semana.map((d, di) => {
              if (d === null) return <div className="cell" key={di} />
              const eh = d === hoje
              const evs = eventos[d] || []
              const primeiro = evs.slice().sort(porHora)[0]
              return (
                <div className={`cell clicavel ${eh ? 'today' : 'fill'}`} key={di} onClick={() => setDiaAberto(d)}>
                  <div className="dn">{d}</div>
                  {primeiro && (
                    <div className="evchip" style={{ background: eh ? 'rgba(255,255,255,.25)' : primeiro.cor + '24', color: eh ? '#fff' : primeiro.cor }}>
                      <div className="dot" style={{ width: 6, height: 6, background: eh ? '#fff' : primeiro.cor }} />{primeiro.titulo}
                    </div>
                  )}
                  {evs.length > 1 && <span style={{ fontSize: 10, fontWeight: 600, color: eh ? '#fff' : 'var(--mut)' }}>+{evs.length - 1} mais</span>}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="card" style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="sechead">Hoje, {hoje} Jul</div>
        {agendaHoje.length === 0
          ? <p style={{ fontSize: 13, color: 'var(--mut)' }}>Nenhum evento hoje. Clique num dia para adicionar.</p>
          : agendaHoje.map((e, i) => (
            <div className="it" key={i}>
              <div className="evbar" style={{ height: 42, background: e.cor }} />
              <div>
                <b style={{ fontSize: 13, fontWeight: 600, display: 'block' }}>{e.titulo}</b>
                <p style={{ fontSize: 12, color: 'var(--sub)' }}>{e.hora || 'Sem horário'}</p>
              </div>
            </div>
          ))}
      </div>

      {diaAberto !== null && (
        <DiaModal
          dia={diaAberto}
          eventos={eventos[diaAberto] || []}
          tipos={tiposEvento}
          alunos={alunos}
          onAdd={adicionarEvento}
          onRemove={removerEvento}
          onClose={() => setDiaAberto(null)}
        />
      )}
    </div>
  )
}

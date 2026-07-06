import { useState } from 'react'
import { sac } from '../data.js'
import { Avatar, Badge, Metric } from '../ui.jsx'

export default function Sac() {
  const [ativo, setAtivo] = useState(0)
  // Cada ticket tem sua própria conversa (guardada por índice).
  const [conversas, setConversas] = useState(sac.tickets.map(t => t.conversa))
  const [texto, setTexto] = useState('')
  const ticket = sac.tickets[ativo]
  const conversa = conversas[ativo]

  const enviar = () => {
    if (!texto.trim()) return
    setConversas(prev => prev.map((c, i) => i === ativo ? [...c, { de: 'me', txt: texto.trim() }] : c))
    setTexto('')
  }

  return (
    <>
      <div className="row">
        {sac.metrics.map((m, i) => <Metric key={i} {...m} />)}
      </div>

      <div className="row" style={{ alignItems: 'stretch' }}>
        <div className="card tbl" style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <div className="trow head" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 600, letterSpacing: 0 }}>Conversas</span>
            <Badge text="18 abertos" color="#ffa826" bg="var(--amberBg)" />
          </div>
          {sac.tickets.map((t, i) => (
            <div className="trow" key={i} style={{ cursor: 'pointer', background: i === ativo ? 'var(--vio)' : '' }} onClick={() => setAtivo(i)}>
              <Avatar name={t.nome} a={t.a} b={t.b} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <b style={{ fontSize: 13, fontWeight: 600 }}>{t.nome}</b>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--mut)', fontWeight: 500 }}>{t.tempo}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>{t.msg}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card chatpane" style={{ flex: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="trow" style={{ borderBottom: '1px solid var(--border)', padding: '14px 20px' }}>
            <Avatar name={ticket.nome} a={ticket.a} b={ticket.b} size={40} />
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 14, fontWeight: 600 }}>{ticket.nome}</b>
              <p style={{ fontSize: 12, color: 'var(--green)' }}>{ticket.curso} · Online agora</p>
            </div>
            <Badge text="Aberto" color="#ffa826" bg="var(--amberBg)" />
          </div>
          <div className="msgs">
            {conversa.map((m, i) => (
              <div className={`bubrow ${m.de}`} key={i}>
                <div className={`bub ${m.de}`}>{m.txt}</div>
              </div>
            ))}
          </div>
          <div className="inp">
            <input className="box" value={texto} placeholder="Escreva uma resposta..."
              onChange={e => setTexto(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviar()} />
            <button className="send" onClick={enviar} />
          </div>
        </div>
      </div>
    </>
  )
}

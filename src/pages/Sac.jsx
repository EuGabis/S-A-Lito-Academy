import { useEffect, useRef, useState } from 'react'
import { supabase, supabasePronto } from '../supabaseClient.js'
import { useStore } from '../store.jsx'
import { Avatar, Badge, Metric } from '../ui.jsx'
import { G } from '../data.js'

const ticketDoBanco = (r) => ({ id: r.id, nome: r.nome, curso: r.curso, msg: r.ultima_msg, tempo: r.tempo, a: r.avatar_a, b: r.avatar_b })

// Modal simples para iniciar uma conversa a partir de um aluno.
function NovaConversa({ alunos, onCriar, onClose }) {
  const [sel, setSel] = useState(alunos[0]?.email || '')
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 420 }}>
        <div className="mhead"><div className="info"><b>Nova conversa</b><p>Escolha o aluno</p></div>
          <button className="mclose" onClick={onClose}>✕</button></div>
        <div className="mbody">
          {alunos.length === 0
            ? <p style={{ fontSize: 13, color: 'var(--mut)' }}>Cadastre alunos primeiro para iniciar uma conversa.</p>
            : <>
              <div className="fitem">
                <label>Aluno</label>
                <select className="inp2" value={sel} onChange={e => setSel(e.target.value)}>
                  {alunos.map(a => <option key={a.email} value={a.email}>{a.name} — {a.curso}</option>)}
                </select>
              </div>
              <div className="formfoot">
                <button className="btn-ghost" onClick={onClose}>Cancelar</button>
                <button className="addbtn" style={{ margin: 0 }} onClick={() => onCriar(alunos.find(a => a.email === sel))}>Iniciar conversa</button>
              </div>
            </>}
        </div>
      </div>
    </div>
  )
}

export default function Sac() {
  const { alunos } = useStore()
  const [tickets, setTickets] = useState([])
  const [conversas, setConversas] = useState({}) // { ticketId: [ {id,de,texto} ] }
  const [ativo, setAtivo] = useState(0)
  const [texto, setTexto] = useState('')
  const [novaConversa, setNovaConversa] = useState(false)
  const fimRef = useRef(null)

  // Carrega tickets e mensagens (sem semeadura).
  useEffect(() => {
    let vivo = true
    ;(async () => {
      if (!supabasePronto) return
      try {
        const { data: tk, error } = await supabase.from('sa_sac_tickets').select('*').order('created_at', { ascending: true })
        if (error) throw error
        const { data: ms } = await supabase.from('sa_sac_mensagens').select('*').order('ordem', { ascending: true })
        const porTicket = {}
        for (const m of (ms || [])) (porTicket[m.ticket_id] ||= []).push({ id: m.id, de: m.de, texto: m.texto })
        if (vivo) { setTickets(tk.map(ticketDoBanco)); setConversas(porTicket) }
      } catch (e) { console.error('Falha ao carregar SAC.', e) }
    })()
    return () => { vivo = false }
  }, [])

  const ticket = tickets[ativo]
  const conversa = ticket ? (conversas[ticket.id] || []) : []

  useEffect(() => { fimRef.current?.scrollIntoView({ block: 'end' }) }, [conversa.length, ativo])

  // Métricas reais.
  const totalMsgs = Object.values(conversas).reduce((s, arr) => s + arr.length, 0)
  const enviadas = Object.values(conversas).reduce((s, arr) => s + arr.filter(m => m.de === 'me').length, 0)
  const metrics = [
    { label: 'Conversas', value: String(tickets.length), a: G.brand, b: G.brand2 },
    { label: 'Mensagens', value: String(totalMsgs), a: G.teal, b: G.green },
    { label: 'Respostas enviadas', value: String(enviadas), a: G.amber, b: G.pink },
    { label: 'Recebidas', value: String(totalMsgs - enviadas), a: G.blue, b: G.teal },
  ]

  const criarConversa = async (aluno) => {
    if (!aluno) return
    const novo = { nome: aluno.name, curso: aluno.curso, ultima_msg: '', tempo: 'agora', avatar_a: aluno.a, avatar_b: aluno.b }
    setNovaConversa(false)
    if (!supabasePronto) return
    const { data } = await supabase.from('sa_sac_tickets').insert(novo).select().single()
    if (data) {
      setTickets(prev => [...prev, ticketDoBanco(data)])
      setConversas(prev => ({ ...prev, [data.id]: [] }))
      setAtivo(tickets.length)
    }
  }

  const enviar = async () => {
    if (!texto.trim() || !ticket) return
    const msg = { de: 'me', texto: texto.trim() }
    setConversas(prev => ({ ...prev, [ticket.id]: [...(prev[ticket.id] || []), msg] }))
    setTexto('')
    if (supabasePronto) {
      await supabase.from('sa_sac_mensagens').insert({ ticket_id: ticket.id, de: 'me', texto: msg.texto, ordem: conversa.length })
    }
  }

  return (
    <>
      <div className="row">
        {metrics.map((m, i) => <Metric key={i} {...m} />)}
      </div>

      <div className="row" style={{ alignItems: 'stretch' }}>
        <div className="card tbl" style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <div className="trow head" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 600, letterSpacing: 0 }}>Conversas</span>
            <button className="addbtn" style={{ margin: 0, padding: '7px 14px', fontSize: 13 }} onClick={() => setNovaConversa(true)}>+ Nova</button>
          </div>
          {tickets.length === 0
            ? <div style={{ padding: 24, fontSize: 13, color: 'var(--mut)' }}>Nenhuma conversa ainda. Clique em “+ Nova” para começar.</div>
            : tickets.map((t, i) => (
              <div className="trow" key={t.id} style={{ cursor: 'pointer', background: i === ativo ? 'var(--vio)' : '' }} onClick={() => setAtivo(i)}>
                <Avatar name={t.nome} a={t.a} b={t.b} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <b style={{ fontSize: 13, fontWeight: 600 }}>{t.nome}</b>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--mut)', fontWeight: 500 }}>{t.tempo}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>{(conversas[t.id]?.slice(-1)[0]?.texto) || 'Sem mensagens'}</p>
                </div>
              </div>
            ))}
        </div>

        <div className="card chatpane" style={{ flex: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {ticket ? (
            <>
              <div className="trow" style={{ borderBottom: '1px solid var(--border)', padding: '14px 20px' }}>
                <Avatar name={ticket.nome} a={ticket.a} b={ticket.b} size={40} />
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: 14, fontWeight: 600 }}>{ticket.nome}</b>
                  <p style={{ fontSize: 12, color: 'var(--green)' }}>{ticket.curso}</p>
                </div>
                <Badge text="Aberto" color={G.amber} bg="var(--amberBg)" />
              </div>
              <div className="msgs">
                {conversa.length === 0
                  ? <p style={{ fontSize: 13, color: 'var(--mut)', margin: 'auto' }}>Envie a primeira mensagem.</p>
                  : conversa.map((m, i) => (
                    <div className={`bubrow ${m.de}`} key={m.id ?? i}><div className={`bub ${m.de}`}>{m.texto}</div></div>
                  ))}
                <div ref={fimRef} />
              </div>
              <div className="inp">
                <input className="box" value={texto} placeholder="Escreva uma resposta..."
                  onChange={e => setTexto(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviar()} />
                <button className="send" onClick={enviar} />
              </div>
            </>
          ) : (
            <div className="soon" style={{ boxShadow: 'none' }}>
              <div className="ic">💬</div>
              <b>Nenhuma conversa selecionada</b>
              <p>Crie uma nova conversa para começar o atendimento.</p>
            </div>
          )}
        </div>
      </div>

      {novaConversa && <NovaConversa alunos={alunos} onCriar={criarConversa} onClose={() => setNovaConversa(false)} />}
    </>
  )
}

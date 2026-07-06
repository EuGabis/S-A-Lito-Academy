import { useEffect, useRef, useState } from 'react'
import { sac } from '../data.js'
import { supabase, supabasePronto } from '../supabaseClient.js'
import { Avatar, Badge, Metric } from '../ui.jsx'

let semeouSac = false // trava a semeadura (StrictMode)

const ticketDoBanco = (r) => ({ id: r.id, nome: r.nome, curso: r.curso, msg: r.ultima_msg, tempo: r.tempo, a: r.avatar_a, b: r.avatar_b })
const ticketParaBanco = (t) => ({ nome: t.nome, curso: t.curso, ultima_msg: t.msg, tempo: t.tempo, avatar_a: t.a, avatar_b: t.b })

export default function Sac() {
  // Sem banco: usa os dados locais direto.
  const [tickets, setTickets] = useState(supabasePronto ? [] : sac.tickets)
  const [conversas, setConversas] = useState(() => {
    if (supabasePronto) return {}
    const m = {}; sac.tickets.forEach((t, i) => { m[i] = t.conversa }); return m
  })
  const [ativo, setAtivo] = useState(0)
  const [texto, setTexto] = useState('')
  const fimRef = useRef(null)

  // Carrega tickets e mensagens (e semeia os exemplos na primeira vez).
  useEffect(() => {
    let vivo = true
    ;(async () => {
      if (!supabasePronto) return
      try {
        const buscarTickets = () => supabase.from('sa_sac_tickets').select('*').order('created_at', { ascending: true })
        let { data: tk, error } = await buscarTickets()
        if (error) throw error
        if (tk.length === 0 && !semeouSac) {
          semeouSac = true
          const { data: inseridos } = await supabase.from('sa_sac_tickets').insert(sac.tickets.map(ticketParaBanco)).select()
          // Mensagens de cada ticket recém-criado.
          const msgs = []
          sac.tickets.forEach((t, i) => {
            const tid = inseridos?.[i]?.id
            if (tid) t.conversa.forEach((m, ordem) => msgs.push({ ticket_id: tid, de: m.de, texto: m.txt, ordem }))
          })
          if (msgs.length) await supabase.from('sa_sac_mensagens').insert(msgs)
          ;({ data: tk } = await buscarTickets())
        } else if (tk.length === 0) {
          await new Promise(res => setTimeout(res, 400))
          ;({ data: tk } = await buscarTickets())
        }
        const { data: ms } = await supabase.from('sa_sac_mensagens').select('*').order('ordem', { ascending: true })
        const porTicket = {}
        for (const m of (ms || [])) (porTicket[m.ticket_id] ||= []).push({ id: m.id, de: m.de, texto: m.texto })
        if (vivo) { setTickets(tk.map(ticketDoBanco)); setConversas(porTicket) }
      } catch (e) {
        console.error('Falha ao carregar SAC, usando dados locais.', e)
        if (vivo) {
          setTickets(sac.tickets)
          const m = {}; sac.tickets.forEach((t, i) => { m[i] = t.conversa }); setConversas(m)
        }
      }
    })()
    return () => { vivo = false }
  }, [])

  const ticket = tickets[ativo]
  const chave = supabasePronto ? ticket?.id : ativo
  const conversa = conversas[chave] || []

  useEffect(() => { fimRef.current?.scrollIntoView({ block: 'end' }) }, [conversa.length, ativo])

  const enviar = async () => {
    if (!texto.trim() || !ticket) return
    const msg = { de: 'me', texto: texto.trim() }
    setConversas(prev => ({ ...prev, [chave]: [...(prev[chave] || []), msg] }))
    setTexto('')
    if (supabasePronto) {
      await supabase.from('sa_sac_mensagens').insert({ ticket_id: ticket.id, de: 'me', texto: msg.texto, ordem: conversa.length })
    }
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
            <Badge text={`${tickets.length} abertos`} color="#c9903f" bg="var(--amberBg)" />
          </div>
          {tickets.map((t, i) => (
            <div className="trow" key={t.id ?? i} style={{ cursor: 'pointer', background: i === ativo ? 'var(--vio)' : '' }} onClick={() => setAtivo(i)}>
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
          {ticket && (
            <div className="trow" style={{ borderBottom: '1px solid var(--border)', padding: '14px 20px' }}>
              <Avatar name={ticket.nome} a={ticket.a} b={ticket.b} size={40} />
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 14, fontWeight: 600 }}>{ticket.nome}</b>
                <p style={{ fontSize: 12, color: 'var(--green)' }}>{ticket.curso} · Online agora</p>
              </div>
              <Badge text="Aberto" color="#c9903f" bg="var(--amberBg)" />
            </div>
          )}
          <div className="msgs">
            {conversa.map((m, i) => (
              <div className={`bubrow ${m.de}`} key={m.id ?? i}>
                <div className={`bub ${m.de}`}>{m.texto}</div>
              </div>
            ))}
            <div ref={fimRef} />
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

import { useState } from 'react'
import { supabase, supabasePronto } from '../supabaseClient.js'

const ASSUNTOS = ['Reclamação', 'Sugestão', 'Dúvida', 'Suporte', 'Elogio', 'Outro']
const AVATAR = ['#5a5cbf', '#3fa394']

// Marca (hélice) reutilizada da barra lateral.
function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="propPub" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8082cf" /><stop offset="1" stopColor="#3fa394" />
        </linearGradient>
      </defs>
      <g fill="url(#propPub)">
        <ellipse cx="16" cy="8.5" rx="2.5" ry="7" />
        <ellipse cx="16" cy="8.5" rx="2.5" ry="7" transform="rotate(120 16 16)" />
        <ellipse cx="16" cy="8.5" rx="2.5" ry="7" transform="rotate(240 16 16)" />
      </g>
      <circle cx="16" cy="16" r="3.2" fill="#12102a" stroke="url(#propPub)" strokeWidth="1.5" />
    </svg>
  )
}

export default function Reclamacao() {
  const [f, setF] = useState({ nome: '', email: '', curso: '', assunto: ASSUNTOS[0], mensagem: '' })
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }))

  const validar = () => {
    const e = {}
    if (!f.nome.trim()) e.nome = 'Informe seu nome'
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'E-mail inválido'
    if (!f.mensagem.trim()) e.mensagem = 'Escreva sua mensagem'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const enviar = async () => {
    if (!validar() || enviando) return
    setEnviando(true)
    try {
      if (supabasePronto) {
        const { data, error } = await supabase.from('sa_sac_tickets').insert({
          nome: f.nome.trim(), email: f.email.trim() || null, assunto: f.assunto,
          curso: f.curso.trim() || null, ultima_msg: f.mensagem.trim().slice(0, 80),
          tempo: 'agora', avatar_a: AVATAR[0], avatar_b: AVATAR[1],
        }).select().single()
        if (error) throw error
        await supabase.from('sa_sac_mensagens').insert({ ticket_id: data.id, de: 'them', texto: f.mensagem.trim(), ordem: 0 })
      }
      setEnviado(true)
    } catch (e) {
      console.error(e)
      setErros({ geral: 'Não foi possível enviar agora. Tente novamente em instantes.' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="pubwrap">
      <div className="pubcard">
        <div className="pubhead">
          <Logo />
          <div><b>Student Advisor</b><span>Central de Atendimento — SAC</span></div>
        </div>

        {enviado ? (
          <div className="pubok">
            <div className="okmark">✓</div>
            <h2>Mensagem enviada!</h2>
            <p>Recebemos sua {f.assunto.toLowerCase()} e nossa equipe vai analisar. Obrigado pelo contato, {f.nome.split(' ')[0]}.</p>
            <button className="addbtn" style={{ margin: 0 }} onClick={() => { setEnviado(false); setF({ nome: '', email: '', curso: '', assunto: ASSUNTOS[0], mensagem: '' }) }}>Enviar outra</button>
          </div>
        ) : (
          <>
            <p className="pubsub">Envie sua reclamação, dúvida ou sugestão. Responderemos o mais rápido possível.</p>
            <div className="form">
              <div className="frow">
                <div className="fitem">
                  <label>Nome <span className="req">*</span></label>
                  <input className={`inp2 ${erros.nome ? 'err' : ''}`} value={f.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome" />
                  {erros.nome && <span className="ferr">{erros.nome}</span>}
                </div>
                <div className="fitem">
                  <label>E-mail (opcional)</label>
                  <input className={`inp2 ${erros.email ? 'err' : ''}`} value={f.email} onChange={e => set('email', e.target.value)} placeholder="para retorno" />
                  {erros.email && <span className="ferr">{erros.email}</span>}
                </div>
              </div>
              <div className="frow">
                <div className="fitem">
                  <label>Curso / Turma (opcional)</label>
                  <input className="inp2" value={f.curso} onChange={e => set('curso', e.target.value)} placeholder="Ex: Célula — Turma A" />
                </div>
                <div className="fitem">
                  <label>Assunto</label>
                  <select className="inp2" value={f.assunto} onChange={e => set('assunto', e.target.value)}>
                    {ASSUNTOS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div className="fitem full">
                <label>Mensagem <span className="req">*</span></label>
                <textarea className={`ta ${erros.mensagem ? 'err' : ''}`} style={{ minHeight: 120 }} value={f.mensagem}
                  onChange={e => set('mensagem', e.target.value)} placeholder="Descreva sua reclamação, dúvida ou sugestão..." />
                {erros.mensagem && <span className="ferr">{erros.mensagem}</span>}
              </div>
              {erros.geral && <span className="ferr">{erros.geral}</span>}
              <button className="addbtn" style={{ margin: '4px 0 0' }} onClick={enviar} disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </div>
          </>
        )}
      </div>
      <p className="pubfoot">Student Advisor · S&A</p>
    </div>
  )
}

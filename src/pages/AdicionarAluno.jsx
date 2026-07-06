import { useState } from 'react'
import { cursos, paletaAvatar, checklistVazio, jornadaPadrao } from '../data.js'

const vazio = {
  name: '', email: '', telefone: '', curso: cursos[0], turma: '', status: 'Ativo', progresso: 0,
}

export default function AdicionarAluno({ total, onClose, onSalvar }) {
  const [f, setF] = useState(vazio)
  const [erros, setErros] = useState({})
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }))

  const validar = () => {
    const e = {}
    if (!f.name.trim()) e.name = 'Informe o nome'
    if (!f.email.trim()) e.email = 'Informe o e-mail'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'E-mail inválido'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const salvar = () => {
    if (!validar()) return
    const [a, b] = paletaAvatar[total % paletaAvatar.length]
    onSalvar({
      name: f.name.trim(),
      email: f.email.trim(),
      telefone: f.telefone.trim(),
      curso: f.curso,
      turma: f.turma.trim() || '—',
      status: f.status,
      progresso: Math.min(1, Math.max(0, Number(f.progresso) / 100 || 0)),
      a, b,
      ultima: 'agora',
      check: checklistVazio(),
      jornada: jornadaPadrao(0),
    })
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 560 }}>
        <div className="mhead">
          <div className="info"><b>Adicionar aluno</b><p>Preencha os dados do novo aluno</p></div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>

        <div className="mbody">
          <div className="form">
            <div className="fitem full">
              <label>Nome completo <span className="req">*</span></label>
              <input className={`inp2 ${erros.name ? 'err' : ''}`} value={f.name}
                onChange={e => set('name', e.target.value)} placeholder="Ex: Ana Beatriz Silva" />
              {erros.name && <span className="ferr">{erros.name}</span>}
            </div>

            <div className="frow">
              <div className="fitem">
                <label>E-mail <span className="req">*</span></label>
                <input className={`inp2 ${erros.email ? 'err' : ''}`} value={f.email}
                  onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com" />
                {erros.email && <span className="ferr">{erros.email}</span>}
              </div>
              <div className="fitem">
                <label>Telefone</label>
                <input className="inp2" value={f.telefone}
                  onChange={e => set('telefone', e.target.value)} placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div className="frow">
              <div className="fitem">
                <label>Curso</label>
                <select className="inp2" value={f.curso} onChange={e => set('curso', e.target.value)}>
                  {cursos.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="fitem">
                <label>Turma</label>
                <input className="inp2" value={f.turma}
                  onChange={e => set('turma', e.target.value)} placeholder="Ex: Turma A" />
              </div>
            </div>

            <div className="frow">
              <div className="fitem">
                <label>Status</label>
                <select className="inp2" value={f.status} onChange={e => set('status', e.target.value)}>
                  <option>Ativo</option>
                  <option>Em risco</option>
                  <option>Formado</option>
                </select>
              </div>
              <div className="fitem">
                <label>Progresso do curso (%)</label>
                <input className="inp2" type="number" min="0" max="100" value={f.progresso}
                  onChange={e => set('progresso', e.target.value)} />
              </div>
            </div>

            <div className="formfoot">
              <button className="btn-ghost" onClick={onClose}>Cancelar</button>
              <button className="addbtn" style={{ margin: 0 }} onClick={salvar}>Salvar aluno</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

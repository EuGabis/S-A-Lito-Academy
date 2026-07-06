import { useState } from 'react'
import { statusColors, reunioes } from '../data.js'
import { useStore } from '../store.jsx'
import { Avatar, Badge, ProgressBar } from '../ui.jsx'
import FormularioReuniao from './FormularioReuniao.jsx'
import Jornada from './Jornada.jsx'
import Documento from './Documento.jsx'
import Confirmacao from './Confirmacao.jsx'
import { montarAta, montarFichaCompleta } from '../documento.js'

const barColor = (p) => p >= 0.7 ? ['#14c5a7', '#26c478'] : p >= 0.5 ? ['#6d5ef6', '#a37af7'] : ['#ffa826', '#ff6392']

const TABS = ['Dados', 'Jornada', 'Reunião 01', 'Reunião 02', 'Imersão']

function Checklist({ titulo, itens, onToggle }) {
  const feitos = itens.filter(i => i.done).length
  return (
    <div>
      <div className="checkhead">{titulo}<span className="cnt">{feitos}/{itens.length}</span></div>
      <div className="check">
        {itens.map((it, i) => (
          <div key={i} className={`citem ${it.done ? 'on' : ''}`} onClick={() => onToggle(i)}>
            <div className="cbox">{it.done ? '✓' : ''}</div>
            {it.label}
          </div>
        ))}
      </div>
    </div>
  )
}

function AbaDados({ aluno, check, setCheck }) {
  const [c1, c2] = barColor(aluno.progresso)
  const toggle = (grupo, idx) => {
    setCheck(prev => ({
      ...prev,
      [grupo]: prev[grupo].map((it, i) => i === idx ? { ...it, done: !it.done } : it),
    }))
  }
  return (
    <>
      <div className="fields">
        <div className="field"><div className="k">E-mail</div><div className="v">{aluno.email}</div></div>
        <div className="field"><div className="k">Telefone</div><div className="v">{aluno.telefone}</div></div>
        <div className="field"><div className="k">Curso</div><div className="v">{aluno.curso}</div></div>
        <div className="field"><div className="k">Turma</div><div className="v">{aluno.turma}</div></div>
      </div>
      <div className="g">
        <div className="gh"><b>Progresso do curso</b><span>{Math.round(aluno.progresso * 100)}%</span></div>
        <ProgressBar pct={aluno.progresso} a={c1} b={c2} />
      </div>
      <Checklist titulo="📄 Documentos / Matrícula" itens={check.docs} onToggle={i => toggle('docs', i)} />
      <Checklist titulo="✅ Etapas de acompanhamento" itens={check.etapas} onToggle={i => toggle('etapas', i)} />
    </>
  )
}

export default function FichaAluno({ aluno, onClose }) {
  const { atualizarAluno, removerAluno } = useStore()
  const [tab, setTab] = useState('Dados')
  const [confirmarExcluir, setConfirmarExcluir] = useState(false)
  const [check, setCheckLocal] = useState(aluno.check)
  const [jornada, setJornadaLocal] = useState(aluno.jornada)
  // Respostas de todas as reuniões, agrupadas por aba.
  const [respostas, setRespostasLocal] = useState(
    aluno.reunioes || { 'Reunião 01': {}, 'Reunião 02': {}, 'Imersão': {} }
  )

  // Cada alteração atualiza a tela e persiste no banco (via store).
  const setCheck = (upd) => {
    const nova = typeof upd === 'function' ? upd(check) : upd
    setCheckLocal(nova)
    atualizarAluno(aluno.email, { check: nova })
  }
  const setJornada = (nova) => {
    setJornadaLocal(nova)
    atualizarAluno(aluno.email, { jornada: nova })
  }
  const setRespostas = (upd) => {
    const nova = typeof upd === 'function' ? upd(respostas) : upd
    setRespostasLocal(nova)
    atualizarAluno(aluno.email, { reunioes: nova })
  }
  const [doc, setDoc] = useState(null) // { titulo, html } | null
  const sc = statusColors[aluno.status]

  // A ficha completa usa o checklist atual, então junto ele ao aluno.
  const alunoComCheck = { ...aluno, check, jornada }

  const gerarAta = () => setDoc({ titulo: `Ata — ${tab}`, html: montarAta(alunoComCheck, tab, respostas[tab]) })
  const gerarFicha = () => setDoc({ titulo: 'Ficha Completa', html: montarFichaCompleta(alunoComCheck, respostas) })

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mhead">
          <Avatar name={aluno.name} a={aluno.a} b={aluno.b} size={56} />
          <div className="info">
            <b>{aluno.name}</b>
            <p>{aluno.curso} · {aluno.turma}</p>
          </div>
          <Badge text={aluno.status} color={sc.color} bg={sc.bg} />
          <button title="Excluir aluno" onClick={() => setConfirmarExcluir(true)}
            style={{ background: 'var(--faint)', border: 'none', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', fontSize: 15 }}>🗑️</button>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button key={t} className={`tab ${t === tab ? 'on' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
          <button className="tab" style={{ marginLeft: 'auto', color: 'var(--brand)' }} onClick={gerarFicha}>📋 Ficha completa</button>
        </div>

        <div className="mbody">
          {tab === 'Dados'
            ? <AbaDados aluno={aluno} check={check} setCheck={setCheck} />
            : tab === 'Jornada'
            ? <Jornada jornada={jornada} setJornada={setJornada} />
            : <FormularioReuniao
                perguntas={reunioes[tab]}
                respostas={respostas[tab]}
                onChange={r => setRespostas(prev => ({ ...prev, [tab]: r }))}
                onGerarAta={gerarAta} />}
        </div>
      </div>

      {doc && <Documento titulo={doc.titulo} html={doc.html} onClose={() => setDoc(null)} />}

      {confirmarExcluir && (
        <Confirmacao
          titulo="Excluir aluno?"
          mensagem={`O aluno "${aluno.name}" e toda a sua ficha (checklist, jornada, reuniões) serão removidos. Essa ação não pode ser desfeita.`}
          onConfirmar={() => { removerAluno(aluno.email); setConfirmarExcluir(false); onClose() }}
          onCancelar={() => setConfirmarExcluir(false)}
        />
      )}
    </div>
  )
}

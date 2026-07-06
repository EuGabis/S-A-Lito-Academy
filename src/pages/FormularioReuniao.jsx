import { useRef } from 'react'

// Extensões de transcrição que dá pra pré-visualizar como texto.
const TEXTO_OK = ['.txt', '.vtt', '.srt', '.md']

// Área para subir a transcrição do Meet.
function Transcricao({ valor, onChange }) {
  const ref = useRef(null)

  const escolher = (file) => {
    if (!file) return
    const ehTexto = TEXTO_OK.some(ext => file.name.toLowerCase().endsWith(ext))
    const base = { nome: file.name, tamanho: file.size }
    if (ehTexto) {
      const reader = new FileReader()
      reader.onload = e => onChange({ ...base, texto: e.target.result })
      reader.readAsText(file)
    } else {
      onChange(base)
    }
  }

  const kb = (b) => b < 1024 ? `${b} B` : `${(b / 1024).toFixed(0)} KB`

  return (
    <div>
      <div className="upltitle">🎙️ Transcrição da reunião (Meet)</div>
      <input ref={ref} type="file" accept=".txt,.vtt,.srt,.md,.pdf,.doc,.docx" style={{ display: 'none' }}
        onChange={e => escolher(e.target.files[0])} />
      {valor
        ? (
          <div className="uplfile">
            <div className="ic">📄</div>
            <div className="tx"><b>{valor.nome}</b><p>{kb(valor.tamanho)}{valor.texto ? ' · texto disponível' : ''}</p></div>
            {valor.texto && <button className="uplview" onClick={() => alert(valor.texto.slice(0, 4000))}>Ver</button>}
            <button className="rm" onClick={() => { onChange(null); if (ref.current) ref.current.value = '' }}>Remover</button>
          </div>
        )
        : (
          <div className="upl" onClick={() => ref.current?.click()}>
            <div className="ic">⬆️</div>
            <div className="tx"><b>Subir transcrição</b><p>Arquivo do Meet (.txt, .vtt, .srt, .pdf, .docx)</p></div>
          </div>
        )}
    </div>
  )
}

// Renderiza uma pergunta Sim/Não com campo condicional, ou um campo de texto livre.
function Pergunta({ pergunta, valor, onChange }) {
  const { tipo, q, notaSim, notaNao } = pergunta

  if (tipo === 'texto') {
    return (
      <div className="q">
        <div className="qt">{q}</div>
        <textarea className="ta" value={valor.texto || ''} placeholder="Escreva aqui..."
          onChange={e => onChange({ ...valor, texto: e.target.value })} />
      </div>
    )
  }

  const resp = valor.resp // 'sim' | 'nao' | undefined
  const notaLabel = resp === 'sim' ? notaSim : resp === 'nao' ? notaNao : null

  return (
    <div className="q">
      <div className="qt">{q}</div>
      <div className="sn">
        <button className={`snb sim ${resp === 'sim' ? 'on' : ''}`} onClick={() => onChange({ ...valor, resp: 'sim' })}>Sim</button>
        <button className={`snb nao ${resp === 'nao' ? 'on' : ''}`} onClick={() => onChange({ ...valor, resp: 'nao' })}>Não</button>
      </div>
      {notaLabel && (
        <div className="qnote">
          <label>{notaLabel}</label>
          <textarea className="ta" value={valor.nota || ''} placeholder="Descreva o motivo..."
            onChange={e => onChange({ ...valor, nota: e.target.value })} />
        </div>
      )}
    </div>
  )
}

// Formulário controlado: as respostas vivem na ficha (para gerar ata/ficha compilada).
export default function FormularioReuniao({ perguntas, respostas, onChange, onGerarAta }) {
  const set = (id, valor) => onChange({ ...respostas, [id]: valor })

  return (
    <>
      <Transcricao valor={respostas.__transcricao || null} onChange={t => onChange({ ...respostas, __transcricao: t })} />
      <div className="qlist" style={{ marginTop: 4 }}>
        {perguntas.map(p => (
          <Pergunta key={p.id} pergunta={p} valor={respostas[p.id] || {}} onChange={v => set(p.id, v)} />
        ))}
      </div>
      <button className="addbtn" style={{ margin: '6px 0 0' }} onClick={onGerarAta}>📄 Gerar ata desta reunião</button>
    </>
  )
}

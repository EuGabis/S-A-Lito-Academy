import { meiosContato, proximoContato } from '../data.js'

// Data de hoje formatada (dd/mm/aaaa).
const hojeStr = () => new Date().toLocaleDateString('pt-BR')

export default function Jornada({ jornada, setJornada }) {
  const prox = proximoContato(jornada)

  const alterarMeio = (i, meio) =>
    setJornada(jornada.map((c, idx) => idx === i ? { ...c, meio } : c))

  const marcar = (i, feito) =>
    setJornada(jornada.map((c, idx) => idx === i ? { ...c, feito, data: feito ? hojeStr() : '' } : c))

  const agendar = (i, campo, valor) =>
    setJornada(jornada.map((c, idx) => idx === i ? { ...c, [campo]: valor } : c))

  return (
    <div className="jornada">
      {jornada.map((c, i) => {
        const ehProx = prox === c
        return (
          <div key={i} className={`jstep ${c.feito ? 'feito' : ''} ${ehProx ? 'prox' : ''}`}>
            <div className="rail">
              <div className="node">{c.feito ? '✓' : i + 1}</div>
              {i < jornada.length - 1 && <div className="line" />}
            </div>
            <div className="jbody">
              <div className="jt">{c.fase}{ehProx && <span className="tag">Próximo</span>}</div>
              <div className="jmeta">
                <select className="sel" value={c.meio} onChange={e => alterarMeio(i, e.target.value)}>
                  {meiosContato.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {c.feito
                  ? <span className="jfeito">✓ Concluído em {c.data}</span>
                  : <span className="quando">Previsto: {c.quando}</span>}
              </div>
              {!c.feito && (
                <div className="jmeta">
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--sub)' }}>📅 Agendar para</label>
                  <input className="sel" type="date" value={c.agendado} onChange={e => agendar(i, 'agendado', e.target.value)} />
                  <input className="sel" type="time" value={c.horaAgendada} onChange={e => agendar(i, 'horaAgendada', e.target.value)} />
                </div>
              )}
              <button className={`jbtn ${c.feito ? '' : 'done'}`} onClick={() => marcar(i, !c.feito)}>
                {c.feito ? 'Desfazer' : 'Marcar como feito'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

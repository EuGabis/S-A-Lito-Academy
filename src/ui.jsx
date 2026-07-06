// Pequenos "tijolinhos" visuais reutilizados pelas telas.
import { G } from './data.js'

export const grad = (a, b) => `linear-gradient(135deg,${a},${b})`
export const initials = (n) => n.split(' ').map(w => w[0]).slice(0, 2).join('')

export function Avatar({ name, a, b, size = 38 }) {
  return (
    <div className="av" style={{ width: size, height: size, background: grad(a, b), fontSize: Math.round(size * 0.36) }}>
      {initials(name)}
    </div>
  )
}

export function Badge({ text, color, bg }) {
  return <span className="badge" style={{ color, background: bg }}>{text}</span>
}

export function Metric({ label, value, delta, up, a, b, onClick }) {
  return (
    <div className="card metric" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="h">
        <span className="badge" style={{ color: up ? G.green : G.red, background: up ? 'var(--greenBg)' : 'var(--redBg)' }}>
          {up ? '↑' : '↓'} {delta}
        </span>
      </div>
      <div>
        <div className="val">{value}</div>
        <div className="lbl">{label}</div>
      </div>
    </div>
  )
}

export function ProgressBar({ pct, a, b }) {
  return <div className="pbar"><i style={{ width: `${Math.round(pct * 100)}%`, background: grad(a, b) }} /></div>
}

export function BarChart({ title, sub, data, hiIdx, onVerTudo }) {
  const mx = Math.max(...data.map(d => d[1]))
  return (
    <div className="card" style={{ flex: 2, padding: 22 }}>
      <div className="sechead">{title}{onVerTudo && <a onClick={onVerTudo}>Ver tudo</a>}</div>
      <div style={{ fontSize: 13, color: 'var(--sub)', marginTop: 4 }}>{sub}</div>
      <div className="bars">
        {data.map((d, i) => (
          <div className="col" key={i}>
            <div className={`bar ${i === hiIdx ? 'hi' : ''}`} style={{ height: `${Math.max(8, Math.round(100 * d[1] / mx))}%` }} />
          </div>
        ))}
      </div>
      <div className="blabels">{data.map((d, i) => <span key={i}>{d[0]}</span>)}</div>
    </div>
  )
}

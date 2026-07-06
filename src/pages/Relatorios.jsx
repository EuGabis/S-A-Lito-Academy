import { relatorios } from '../data.js'
import { Metric, BarChart, ProgressBar } from '../ui.jsx'
import { imprimirDocumento } from '../documento.js'

export default function Relatorios() {
  const { metrics, crescimento, crescimentoHi, porCurso, turmas } = relatorios

  // Gradiente cônico do donut a partir das fatias.
  let acc = 0
  const fatias = porCurso.map(c => {
    const ini = acc
    acc += parseFloat(c.pct)
    return `${c.cor} ${ini}% ${acc}%`
  }).join(',')

  const exportar = () => {
    const linhas = turmas.map(t => `<div class="qd"><div class="qq">${t.label}</div><div class="qa"><b>${Math.round(t.pct * 100)}%</b></div></div>`).join('')
    imprimirDocumento('Relatório de Desempenho', `<h1>Relatório de Desempenho por Turma</h1>${linhas}`)
  }

  return (
    <>
      <div className="row">
        {metrics.map((m, i) => <Metric key={i} {...m} />)}
      </div>

      <div className="row">
        <BarChart title="Crescimento de alunos" sub="Novas matrículas por mês" data={crescimento} hiIdx={crescimentoHi} />
        <div className="card" style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="sechead">Alunos por curso</div>
          <div className="donut" style={{ background: `conic-gradient(${fatias})` }} />
          {porCurso.map((l, i) => (
            <div className="it" key={i}>
              <div className="dot" style={{ width: 10, height: 10, background: l.cor }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{l.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: 'var(--sub)' }}>{l.pct}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="sechead">Desempenho por turma<a onClick={exportar}>Exportar</a></div>
        {turmas.map((t, i) => (
          <div className="it" key={i}>
            <span style={{ width: 210, fontSize: 13, fontWeight: 500 }}>{t.label}</span>
            <div style={{ flex: 1 }}><ProgressBar pct={t.pct} a={t.a} b={t.b} /></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--sub)' }}>{Math.round(t.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </>
  )
}

import { G } from '../data.js'
import { useStore } from '../store.jsx'
import { Metric, BarChart, ProgressBar } from '../ui.jsx'
import { imprimirDocumento } from '../documento.js'

// Cores por status.
const CORES_STATUS = { 'Ativo': G.green, 'Em risco': G.red, 'Formado': G.blue }

export default function Relatorios() {
  const { alunos, colunas } = useStore()

  const total = alunos.length
  const ativos = alunos.filter(a => a.status === 'Ativo').length
  const risco = alunos.filter(a => a.status === 'Em risco').length
  const formados = alunos.filter(a => a.status === 'Formado').length
  const progressoMedio = total ? Math.round(alunos.reduce((s, a) => s + (a.progresso || 0), 0) / total * 100) : 0

  const tarefasConcluidas = colunas.find(c => c.titulo === 'Concluído')?.tarefas.length || 0

  const metrics = [
    { label: 'Total de alunos', value: String(total), a: G.brand, b: G.brand2 },
    { label: 'Alunos ativos', value: String(ativos), a: G.teal, b: G.green },
    { label: 'Alunos em risco', value: String(risco), a: G.red, b: G.pink },
    { label: 'Progresso médio', value: `${progressoMedio}%`, a: G.amber, b: G.pink },
  ]

  // Alunos por curso (barras).
  const porCursoMap = {}
  alunos.forEach(a => { porCursoMap[a.curso || '—'] = (porCursoMap[a.curso || '—'] || 0) + 1 })
  const porCurso = Object.entries(porCursoMap)
  const cursoHi = porCurso.reduce((mi, c, i, arr) => c[1] > arr[mi][1] ? i : mi, 0)

  // Distribuição por status (donut).
  const statusDist = [
    { label: 'Ativos', n: ativos, cor: G.green },
    { label: 'Em risco', n: risco, cor: G.red },
    { label: 'Formados', n: formados, cor: G.blue },
  ].filter(s => s.n > 0)
  let acc = 0
  const fatias = statusDist.map(s => {
    const ini = acc; acc += total ? (s.n / total) * 100 : 0
    return `${s.cor} ${ini}% ${acc}%`
  }).join(',')

  // Desempenho por turma (média de progresso).
  const turmaMap = {}
  alunos.forEach(a => {
    const t = a.turma || '—'
    ;(turmaMap[t] ||= []).push(a.progresso || 0)
  })
  const turmas = Object.entries(turmaMap)
    .map(([label, arr]) => ({ label, pct: arr.reduce((s, p) => s + p, 0) / arr.length }))
    .sort((a, b) => b.pct - a.pct)
  const corBarra = (p) => p >= 0.7 ? [G.teal, G.green] : p >= 0.5 ? [G.brand, G.brand2] : [G.amber, G.pink]

  const exportar = () => {
    const linhas = turmas.map(t => `<div class="qd"><div class="qq">${t.label}</div><div class="qa"><b>${Math.round(t.pct * 100)}%</b></div></div>`).join('')
    imprimirDocumento('Relatório de Desempenho', `<h1>Relatório de Desempenho por Turma</h1>
      <div class="qd"><div class="qq">Total de alunos</div><div class="qa"><b>${total}</b></div></div>
      <div class="qd"><div class="qq">Progresso médio</div><div class="qa"><b>${progressoMedio}%</b></div></div>
      ${linhas}`)
  }

  if (total === 0) {
    return <div className="card soon"><div className="ic">📊</div><b>Sem dados ainda</b>
      <p>Cadastre alunos na aba Alunos e os relatórios aparecem aqui automaticamente.</p></div>
  }

  return (
    <>
      <div className="row">
        {metrics.map((m, i) => <Metric key={i} {...m} />)}
      </div>

      <div className="row">
        <BarChart title="Alunos por curso" sub="Quantidade de alunos em cada especialização" data={porCurso} hiIdx={cursoHi} />
        <div className="card" style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="sechead">Alunos por status</div>
          <div className="donut" style={{ background: `conic-gradient(${fatias || 'var(--faint) 0 100%'})` }} />
          {statusDist.map((s, i) => (
            <div className="it" key={i}>
              <div className="dot" style={{ width: 10, height: 10, background: s.cor }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: 'var(--sub)' }}>
                {s.n} · {Math.round(s.n / total * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="sechead">Desempenho por turma<a onClick={exportar}>Exportar</a></div>
        {turmas.map((t, i) => {
          const [c1, c2] = corBarra(t.pct)
          return (
            <div className="it" key={i}>
              <span style={{ width: 160, fontSize: 13, fontWeight: 500 }}>{t.label}</span>
              <div style={{ flex: 1 }}><ProgressBar pct={t.pct} a={c1} b={c2} /></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--sub)' }}>{Math.round(t.pct * 100)}%</span>
            </div>
          )
        })}
      </div>
    </>
  )
}

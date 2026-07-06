import { dashboard, calendario, proximoContato } from '../data.js'
import { useStore } from '../store.jsx'
import { Avatar, Metric, ProgressBar, BarChart } from '../ui.jsx'

export default function Dashboard() {
  const { alunos, colunas, navegar } = useStore()
  const { weekly, weeklyHi, goals, metrics: estilo } = dashboard

  // Números calculados a partir dos dados reais das outras telas.
  const ativos = alunos.filter(a => a.status === 'Ativo').length
  const emRisco = alunos.filter(a => a.status === 'Em risco').length
  const pendentes = colunas.filter(c => c.titulo !== 'Concluído').reduce((s, c) => s + c.tarefas.length, 0)
  const total = colunas.reduce((s, c) => s + c.tarefas.length, 0)
  const concluidas = colunas.find(c => c.titulo === 'Concluído')?.tarefas.length || 0
  const taxa = total ? Math.round((concluidas / total) * 100) : 0

  // Alunos com jornada pendente = "precisando de atenção".
  const atencao = alunos.filter(a => proximoContato(a.jornada)).length

  const metrics = [
    { ...estilo[0], value: String(ativos), onClick: () => navegar('Alunos') },
    { ...estilo[1], value: String(pendentes), onClick: () => navegar('Tarefas') },
    { ...estilo[2], value: `${taxa}%`, onClick: () => navegar('Tarefas') },
    { ...estilo[3], value: String(emRisco), onClick: () => navegar('Alunos') },
  ]

  // Atividade recente derivada dos próprios alunos.
  const atividade = alunos.slice(0, 4)

  return (
    <>
      <div className="hero" style={{ flexShrink: 0 }}>
        <h2>Bem-vindo de volta, Gabriel 👋</h2>
        <p>Você tem {pendentes} tarefa{pendentes === 1 ? '' : 's'} pendente{pendentes === 1 ? '' : 's'} e {atencao} aluno{atencao === 1 ? '' : 's'} precisando de atenção hoje.</p>
        <button className="cta" onClick={() => navegar('Tarefas')}>Ver tarefas de hoje →</button>
      </div>

      <div className="row">
        {metrics.map((m, i) => <Metric key={i} {...m} />)}
      </div>

      <div className="row">
        <BarChart title="Produtividade semanal" sub="Tarefas concluídas por dia" data={weekly} hiIdx={weeklyHi} onVerTudo={() => navegar('Relatórios')} />
        <div className="card" style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="sechead">Metas do mês</div>
          {goals.map((g, i) => (
            <div className="g" key={i}>
              <div className="gh"><b>{g.label}</b><span>{Math.round(g.pct * 100)}%</span></div>
              <ProgressBar pct={g.pct} a={g.a} b={g.b} />
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <div className="card" style={{ flex: 2, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="sechead">Atividade recente<a onClick={() => navegar('Alunos')}>Ver tudo</a></div>
          {atividade.map((a, i) => (
            <div className="it" key={i}>
              <Avatar name={a.name} a={a.a} b={a.b} />
              <div className="tx" style={{ flex: 1 }}><b>{a.name}</b><p>{a.curso} · {a.status}</p></div>
              <span style={{ fontSize: 12, color: 'var(--mut)', fontWeight: 500 }}>{a.ultima}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="sechead">Hoje<a onClick={() => navegar('Calendário')}>Ver tudo</a></div>
          {calendario.agenda.map((e, i) => (
            <div className="it" key={i}>
              <span style={{ width: 42, fontSize: 12, fontWeight: 600, color: 'var(--sub)' }}>{e.hora}</span>
              <div className="dot" style={{ width: 9, height: 9, borderRadius: '50%', background: e.cor }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{e.titulo}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

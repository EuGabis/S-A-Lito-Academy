import { dashboard, calendario, proximoContato, G } from '../data.js'
import { useStore } from '../store.jsx'
import { Avatar, Metric, ProgressBar, BarChart } from '../ui.jsx'

export default function Dashboard() {
  const { alunos, colunas, eventos, navegar } = useStore()
  const porHora = (a, b) => (a.hora || '99:99').localeCompare(b.hora || '99:99')
  const agendaHoje = (eventos[calendario.hoje] || []).slice().sort(porHora)
  const { metrics: estilo } = dashboard

  // Números reais das outras telas.
  const totalAlunos = alunos.length
  const ativos = alunos.filter(a => a.status === 'Ativo').length
  const emRisco = alunos.filter(a => a.status === 'Em risco').length
  const pendentes = colunas.filter(c => c.titulo !== 'Concluído').reduce((s, c) => s + c.tarefas.length, 0)
  const totalTarefas = colunas.reduce((s, c) => s + c.tarefas.length, 0)
  const concluidas = colunas.find(c => c.titulo === 'Concluído')?.tarefas.length || 0
  const taxa = totalTarefas ? Math.round((concluidas / totalTarefas) * 100) : 0
  const atencao = alunos.filter(a => proximoContato(a.jornada)).length

  const metrics = [
    { ...estilo[0], label: 'Alunos ativos', value: String(ativos), onClick: () => navegar('Alunos') },
    { ...estilo[1], label: 'Tarefas pendentes', value: String(pendentes), onClick: () => navegar('Tarefas') },
    { ...estilo[2], label: 'Taxa de conclusão', value: `${taxa}%`, onClick: () => navegar('Tarefas') },
    { ...estilo[3], label: 'Alunos em risco', value: String(emRisco), onClick: () => navegar('Alunos') },
  ]

  // Gráfico: tarefas por status (real).
  const tarefasPorStatus = colunas.map(c => [c.titulo, c.tarefas.length])
  const statusHi = colunas.findIndex(c => c.titulo === 'Concluído')

  // Indicadores reais (barras de progresso).
  const progressoMedio = totalAlunos ? alunos.reduce((s, a) => s + (a.progresso || 0), 0) / totalAlunos : 0
  const jornadaOk = totalAlunos ? alunos.filter(a => !proximoContato(a.jornada)).length / totalAlunos : 0
  const ativosPct = totalAlunos ? ativos / totalAlunos : 0
  const indicadores = [
    { label: 'Alunos ativos', pct: ativosPct, a: G.brand, b: G.brand2 },
    { label: 'Progresso médio', pct: progressoMedio, a: G.teal, b: G.green },
    { label: 'Jornadas em dia', pct: jornadaOk, a: G.amber, b: G.pink },
  ]

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
        <BarChart title="Tarefas por status" sub="Distribuição do quadro Kanban" data={tarefasPorStatus} hiIdx={statusHi} onVerTudo={() => navegar('Tarefas')} />
        <div className="card" style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="sechead">Indicadores</div>
          {indicadores.map((g, i) => (
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
          {atividade.length === 0
            ? <p style={{ fontSize: 13, color: 'var(--mut)' }}>Nenhum aluno cadastrado ainda.</p>
            : atividade.map((a, i) => (
              <div className="it" key={i}>
                <Avatar name={a.name} a={a.a} b={a.b} />
                <div className="tx" style={{ flex: 1 }}><b>{a.name}</b><p>{a.curso} · {a.status}</p></div>
                <span style={{ fontSize: 12, color: 'var(--mut)', fontWeight: 500 }}>{a.ultima}</span>
              </div>
            ))}
        </div>
        <div className="card" style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="sechead">Hoje<a onClick={() => navegar('Calendário')}>Ver tudo</a></div>
          {agendaHoje.length === 0
            ? <p style={{ fontSize: 13, color: 'var(--mut)' }}>Nenhum evento hoje.</p>
            : agendaHoje.map((e, i) => (
              <div className="it" key={i}>
                <span style={{ width: 42, fontSize: 12, fontWeight: 600, color: 'var(--sub)' }}>{e.hora || '—'}</span>
                <div className="dot" style={{ width: 9, height: 9, borderRadius: '50%', background: e.cor }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{e.titulo}</span>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

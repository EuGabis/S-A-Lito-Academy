import { PAGES } from './data.js'
import { StoreProvider, useStore } from './store.jsx'
import Sidebar from './Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Alunos from './pages/Alunos.jsx'
import Tarefas from './pages/Tarefas.jsx'
import Relatorios from './pages/Relatorios.jsx'
import Calendario from './pages/Calendario.jsx'
import Sac from './pages/Sac.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

const READY = { Dashboard, Alunos, Tarefas, 'Relatórios': Relatorios, 'Calendário': Calendario, Sac }

function Shell() {
  const { active, navegar } = useStore()
  const page = PAGES.find(p => p.id === active)

  return (
    <div className="app">
      <Sidebar active={active} onSelect={navegar} />
      <main className="main">
        <header className="top">
          <div>
            <h1>{page.title}</h1>
            <div className="sub">{page.sub}</div>
          </div>
          <div className="search">Buscar...</div>
        </header>
        <div className="content">
          {page.ready ? (() => { const P = READY[page.id]; return <P /> })() : <ComingSoon title={page.title} />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}

// Ícones da barra lateral (SVG). Cada um é o "miolo" de um <svg>.
const paths = {
  Dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  Alunos: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20c.5-3.5 3-5 5.5-5s5 1.5 5.5 5" /><circle cx="17" cy="8.5" r="2.4" /><path d="M16 15c2.2.1 4 1.6 4.5 4.5" /></>,
  Tarefas: <><rect x="4" y="4" width="16" height="17" rx="2.5" /><path d="M8 11l2.2 2.2L15 8.5" /></>,
  Calendário: <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 9h16M8 3v3M16 3v3" /></>,
  Relatórios: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-7" /></>,
  Sac: <><path d="M20 12a8 8 0 1 1-3.4-6.5L20 5v4" /><path d="M8 11h8M8 14h5" /></>,
}

export default function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

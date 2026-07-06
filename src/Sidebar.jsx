import { PAGES } from './data.js'
import Icon from './icons.jsx'

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="side">
      <div className="brand">
        <svg className="logo" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="prop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8082cf" />
              <stop offset="1" stopColor="#3fa394" />
            </linearGradient>
          </defs>
          <g fill="url(#prop)">
            <ellipse cx="16" cy="8.5" rx="2.5" ry="7" />
            <ellipse cx="16" cy="8.5" rx="2.5" ry="7" transform="rotate(120 16 16)" />
            <ellipse cx="16" cy="8.5" rx="2.5" ry="7" transform="rotate(240 16 16)" />
          </g>
          <circle cx="16" cy="16" r="3.2" fill="#12102a" stroke="url(#prop)" strokeWidth="1.5" />
        </svg>
        <span>Student Advisor</span>
      </div>
      <nav>
        {PAGES.map(p => (
          <button
            key={p.id}
            className={`nav ${p.id === active ? 'active' : ''}`}
            onClick={() => onSelect(p.id)}
          >
            <Icon name={p.id} />{p.title}
          </button>
        ))}
      </nav>
      <div className="spacer" />
      <div className="pro"><b>✦ Premium</b><p>Relatórios avançados e IA</p></div>
      <div className="user">
        <div className="av">GP</div>
        <div><b>Gabriel P.</b><p>Coordenador</p></div>
      </div>
    </aside>
  )
}

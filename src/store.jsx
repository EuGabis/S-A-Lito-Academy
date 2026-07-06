import { createContext, useContext, useEffect, useState } from 'react'
import { alunos as alunosIniciais, tarefasColunas } from './data.js'
import { supabase, supabasePronto } from './supabaseClient.js'

// Fonte única de dados que as telas compartilham.
// Alunos são carregados/salvos no Supabase. (Tarefas ainda em memória.)
const StoreCtx = createContext(null)
export const useStore = () => useContext(StoreCtx)

// --- Conversão entre a linha do banco e o objeto usado no app ---
const doBanco = (row) => ({
  name: row.name, email: row.email, telefone: row.telefone, curso: row.curso,
  turma: row.turma, progresso: Number(row.progresso), status: row.status,
  ultima: row.ultima, a: row.avatar_a, b: row.avatar_b,
  check: row.check_data, jornada: row.jornada,
})
const paraBanco = (a) => ({
  name: a.name, email: a.email, telefone: a.telefone, curso: a.curso,
  turma: a.turma, progresso: a.progresso, status: a.status, ultima: a.ultima,
  avatar_a: a.a, avatar_b: a.b, check_data: a.check, jornada: a.jornada,
})

export function StoreProvider({ children }) {
  const [alunos, setAlunos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [colunas, setColunas] = useState(tarefasColunas)
  const [active, setActive] = useState('Dashboard')

  // Carrega os alunos do banco (e semeia os exemplos na primeira vez).
  useEffect(() => {
    let vivo = true
    ;(async () => {
      if (!supabasePronto) { setAlunos(alunosIniciais); setCarregando(false); return }
      try {
        let { data, error } = await supabase.from('sa_alunos').select('*').order('created_at', { ascending: true })
        if (error) throw error
        if (data.length === 0) {
          await supabase.from('sa_alunos').insert(alunosIniciais.map(paraBanco))
          ;({ data } = await supabase.from('sa_alunos').select('*').order('created_at', { ascending: true }))
        }
        if (vivo) setAlunos(data.map(doBanco))
      } catch (e) {
        console.error('Falha ao carregar alunos do Supabase, usando dados locais.', e)
        if (vivo) setAlunos(alunosIniciais)
      } finally {
        if (vivo) setCarregando(false)
      }
    })()
    return () => { vivo = false }
  }, [])

  const adicionarAluno = async (novo) => {
    setAlunos(prev => [...prev, novo]) // otimista
    if (!supabasePronto) return
    const { data, error } = await supabase.from('sa_alunos').insert(paraBanco(novo)).select().single()
    if (!error && data) setAlunos(prev => prev.map(a => a.email === novo.email ? doBanco(data) : a))
  }

  const atualizarAluno = async (email, patch) => {
    setAlunos(prev => prev.map(a => a.email === email ? { ...a, ...patch } : a)) // otimista
    if (!supabasePronto) return
    const row = {}
    for (const k of ['name', 'telefone', 'curso', 'turma', 'progresso', 'status', 'ultima']) if (k in patch) row[k] = patch[k]
    if ('a' in patch) row.avatar_a = patch.a
    if ('b' in patch) row.avatar_b = patch.b
    if ('check' in patch) row.check_data = patch.check
    if ('jornada' in patch) row.jornada = patch.jornada
    if (Object.keys(row).length) await supabase.from('sa_alunos').update(row).eq('email', email)
  }

  const adicionarTarefa = (ci, tarefa) =>
    setColunas(cols => cols.map((c, i) => i === ci ? { ...c, tarefas: [...c.tarefas, tarefa] } : c))

  const removerTarefa = (ci, ti) =>
    setColunas(cols => cols.map((c, i) => i === ci ? { ...c, tarefas: c.tarefas.filter((_, t) => t !== ti) } : c))

  const moverTarefa = (from, toCi, toTi) =>
    setColunas(cols => {
      const copy = cols.map(c => ({ ...c, tarefas: [...c.tarefas] }))
      const [tarefa] = copy[from.ci].tarefas.splice(from.ti, 1)
      let idx = toTi == null ? copy[toCi].tarefas.length : toTi
      if (from.ci === toCi && from.ti < idx) idx -= 1
      copy[toCi].tarefas.splice(idx, 0, tarefa)
      return copy
    })

  const navegar = (pagina) => setActive(pagina)

  return (
    <StoreCtx.Provider value={{
      alunos, carregando, adicionarAluno, atualizarAluno,
      colunas, adicionarTarefa, removerTarefa, moverTarefa,
      active, navegar,
    }}>
      {children}
    </StoreCtx.Provider>
  )
}

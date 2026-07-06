import { createContext, useContext, useEffect, useState } from 'react'
import { alunos as alunosIniciais, tarefasColunas } from './data.js'
import { supabase, supabasePronto } from './supabaseClient.js'

// Fonte única de dados que as telas compartilham.
// Alunos e Tarefas são carregados/salvos no Supabase.
const StoreCtx = createContext(null)
export const useStore = () => useContext(StoreCtx)

// ---------- ALUNOS: conversão banco <-> app ----------
const doBanco = (row) => ({
  name: row.name, email: row.email, telefone: row.telefone, curso: row.curso,
  turma: row.turma, progresso: Number(row.progresso), status: row.status,
  ultima: row.ultima, a: row.avatar_a, b: row.avatar_b,
  check: row.check_data, jornada: row.jornada, reunioes: row.reunioes,
})
const paraBanco = (a) => ({
  name: a.name, email: a.email, telefone: a.telefone, curso: a.curso,
  turma: a.turma, progresso: a.progresso, status: a.status, ultima: a.ultima,
  avatar_a: a.a, avatar_b: a.b, check_data: a.check, jornada: a.jornada, reunioes: a.reunioes,
})

// ---------- TAREFAS: conversão banco <-> app ----------
const COLDEF = tarefasColunas.map(c => ({ titulo: c.titulo, cor: c.cor }))
const tarefaDoBanco = (r) => ({ id: r.id, t: r.titulo, tag: r.tag, tc: r.tag_cor, tb: r.tag_bg, due: r.due, a: r.avatar_a, b: r.avatar_b })
const tarefaParaBanco = (t, coluna, ordem) => ({ titulo: t.t, tag: t.tag, tag_cor: t.tc, tag_bg: t.tb, due: t.due, avatar_a: t.a, avatar_b: t.b, coluna, ordem })
const agrupar = (rows) => COLDEF.map(cd => ({
  ...cd,
  tarefas: rows.filter(r => r.coluna === cd.titulo).sort((a, b) => a.ordem - b.ordem).map(tarefaDoBanco),
}))

// Trava só a SEMEADURA (que não pode rodar 2x no StrictMode).
// O carregamento em si pode rodar normalmente (é idempotente).
let semeouAlunos = false
let semeouTarefas = false

export function StoreProvider({ children }) {
  const [alunos, setAlunos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [colunas, setColunas] = useState(tarefasColunas)
  const [active, setActive] = useState('Dashboard')

  // Carrega os alunos (e semeia exemplos na primeira vez).
  useEffect(() => {
    let vivo = true
    ;(async () => {
      if (!supabasePronto) { setAlunos(alunosIniciais); setCarregando(false); return }
      const ordenado = () => supabase.from('sa_alunos').select('*').order('created_at', { ascending: true }).order('name', { ascending: true })
      try {
        let { data, error } = await ordenado()
        if (error) throw error
        if (data.length === 0 && !semeouAlunos) {
          semeouAlunos = true
          await supabase.from('sa_alunos').insert(alunosIniciais.map(paraBanco))
          ;({ data } = await ordenado())
        } else if (data.length === 0) {
          await new Promise(res => setTimeout(res, 400))
          ;({ data } = await ordenado())
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

  // Carrega as tarefas (e semeia exemplos na primeira vez).
  useEffect(() => {
    let vivo = true
    ;(async () => {
      if (!supabasePronto) return
      try {
        let { data, error } = await supabase.from('sa_tarefas').select('*')
        if (error) throw error
        if (data.length === 0 && !semeouTarefas) {
          semeouTarefas = true
          const seed = tarefasColunas.flatMap(c => c.tarefas.map((t, i) => tarefaParaBanco(t, c.titulo, i)))
          await supabase.from('sa_tarefas').insert(seed)
          ;({ data } = await supabase.from('sa_tarefas').select('*'))
        } else if (data.length === 0) {
          await new Promise(res => setTimeout(res, 400))
          ;({ data } = await supabase.from('sa_tarefas').select('*'))
        }
        if (vivo) setColunas(agrupar(data))
      } catch (e) {
        console.error('Falha ao carregar tarefas do Supabase, usando dados locais.', e)
      }
    })()
    return () => { vivo = false }
  }, [])

  const adicionarAluno = async (novo) => {
    setAlunos(prev => [...prev, novo])
    if (!supabasePronto) return
    const { data, error } = await supabase.from('sa_alunos').insert(paraBanco(novo)).select().single()
    if (!error && data) setAlunos(prev => prev.map(a => a.email === novo.email ? doBanco(data) : a))
  }

  const removerAluno = async (email) => {
    setAlunos(prev => prev.filter(a => a.email !== email))
    if (supabasePronto) await supabase.from('sa_alunos').delete().eq('email', email)
  }

  const atualizarAluno = async (email, patch) => {
    setAlunos(prev => prev.map(a => a.email === email ? { ...a, ...patch } : a))
    if (!supabasePronto) return
    const row = {}
    for (const k of ['name', 'telefone', 'curso', 'turma', 'progresso', 'status', 'ultima']) if (k in patch) row[k] = patch[k]
    if ('a' in patch) row.avatar_a = patch.a
    if ('b' in patch) row.avatar_b = patch.b
    if ('check' in patch) row.check_data = patch.check
    if ('jornada' in patch) row.jornada = patch.jornada
    if ('reunioes' in patch) row.reunioes = patch.reunioes
    if (Object.keys(row).length) await supabase.from('sa_alunos').update(row).eq('email', email)
  }

  const adicionarTarefa = async (ci, tarefa) => {
    const ordem = colunas[ci].tarefas.length
    setColunas(prev => prev.map((c, i) => i === ci ? { ...c, tarefas: [...c.tarefas, tarefa] } : c))
    if (!supabasePronto) return
    const { data } = await supabase.from('sa_tarefas').insert(tarefaParaBanco(tarefa, COLDEF[ci].titulo, ordem)).select().single()
    if (data) setColunas(prev => prev.map((c, i) => i === ci ? { ...c, tarefas: c.tarefas.map(t => t === tarefa ? tarefaDoBanco(data) : t) } : c))
  }

  const removerTarefa = async (ci, ti) => {
    const alvo = colunas[ci].tarefas[ti]
    setColunas(prev => prev.map((c, i) => i === ci ? { ...c, tarefas: c.tarefas.filter((_, t) => t !== ti) } : c))
    if (supabasePronto && alvo?.id) await supabase.from('sa_tarefas').delete().eq('id', alvo.id)
  }

  const moverTarefa = async (from, toCi, toTi) => {
    const copy = colunas.map(c => ({ ...c, tarefas: [...c.tarefas] }))
    const [tarefa] = copy[from.ci].tarefas.splice(from.ti, 1)
    let idx = toTi == null ? copy[toCi].tarefas.length : toTi
    if (from.ci === toCi && from.ti < idx) idx -= 1
    copy[toCi].tarefas.splice(idx, 0, tarefa)
    setColunas(copy)
    if (!supabasePronto) return
    // Persiste coluna + ordem das colunas afetadas.
    const updates = []
    new Set([from.ci, toCi]).forEach(ci => {
      copy[ci].tarefas.forEach((t, i) => {
        if (t.id) updates.push(supabase.from('sa_tarefas').update({ coluna: COLDEF[ci].titulo, ordem: i }).eq('id', t.id))
      })
    })
    await Promise.all(updates)
  }

  const navegar = (pagina) => setActive(pagina)

  return (
    <StoreCtx.Provider value={{
      alunos, carregando, adicionarAluno, atualizarAluno, removerAluno,
      colunas, adicionarTarefa, removerTarefa, moverTarefa,
      active, navegar,
    }}>
      {children}
    </StoreCtx.Provider>
  )
}

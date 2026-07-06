import { createContext, useContext, useState } from 'react'
import { alunos as alunosIniciais, tarefasColunas } from './data.js'

// Fonte única de dados que as telas compartilham (alunos e tarefas).
// Enquanto não há banco, tudo vive aqui em memória durante a sessão.
const StoreCtx = createContext(null)
export const useStore = () => useContext(StoreCtx)

export function StoreProvider({ children }) {
  const [alunos, setAlunos] = useState(alunosIniciais)
  const [colunas, setColunas] = useState(tarefasColunas)
  const [active, setActive] = useState('Dashboard')

  const adicionarAluno = (novo) => setAlunos(prev => [novo, ...prev])

  // Atualiza campos de um aluno (identificado pelo e-mail).
  const atualizarAluno = (email, patch) =>
    setAlunos(prev => prev.map(a => a.email === email ? { ...a, ...patch } : a))

  const adicionarTarefa = (ci, tarefa) =>
    setColunas(cols => cols.map((c, i) => i === ci ? { ...c, tarefas: [...c.tarefas, tarefa] } : c))

  const removerTarefa = (ci, ti) =>
    setColunas(cols => cols.map((c, i) => i === ci ? { ...c, tarefas: c.tarefas.filter((_, t) => t !== ti) } : c))

  // Move uma tarefa de (from.ci, from.ti) para a coluna toCi.
  // toTi = índice de destino (null = fim da coluna).
  const moverTarefa = (from, toCi, toTi) =>
    setColunas(cols => {
      const copy = cols.map(c => ({ ...c, tarefas: [...c.tarefas] }))
      const [tarefa] = copy[from.ci].tarefas.splice(from.ti, 1)
      let idx = toTi == null ? copy[toCi].tarefas.length : toTi
      if (from.ci === toCi && from.ti < idx) idx -= 1
      copy[toCi].tarefas.splice(idx, 0, tarefa)
      return copy
    })

  // Navega para outra aba (usado pelos botões/links das telas).
  const navegar = (pagina) => setActive(pagina)

  return (
    <StoreCtx.Provider value={{ alunos, adicionarAluno, atualizarAluno, colunas, adicionarTarefa, removerTarefa, moverTarefa, active, navegar }}>
      {children}
    </StoreCtx.Provider>
  )
}

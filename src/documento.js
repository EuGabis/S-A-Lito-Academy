// Monta os documentos (ata da reunião e ficha completa) como HTML,
// e cuida da impressão / exportação em PDF (via janela de impressão do navegador).
import { reunioes } from './data.js'

const esc = (s) => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))

function hoje() {
  const d = new Date()
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

// Renderiza as respostas de uma reunião em linhas de documento.
function linhasRespostas(perguntas, respostas = {}) {
  return perguntas.map(p => {
    const v = respostas[p.id] || {}
    if (p.tipo === 'texto') {
      return `<div class="qd"><div class="qq">${esc(p.q)}</div><div class="qa">${esc(v.texto) || '<i>— não preenchido</i>'}</div></div>`
    }
    const resp = v.resp === 'sim' ? 'Sim' : v.resp === 'nao' ? 'Não' : '<i>— não respondido</i>'
    const notaLabel = v.resp === 'sim' ? p.notaSim : v.resp === 'nao' ? p.notaNao : null
    const nota = notaLabel && v.nota ? `<div class="qn"><b>${esc(notaLabel)}:</b> ${esc(v.nota)}</div>` : ''
    return `<div class="qd"><div class="qq">${esc(p.q)}</div><div class="qa"><b>${resp}</b></div>${nota}</div>`
  }).join('')
}

// Linha com a transcrição anexada (se houver).
function linhaTranscricao(respostas = {}) {
  const t = respostas.__transcricao
  if (!t) return ''
  return `<div class="qd"><div class="qq">🎙️ Transcrição (Meet)</div><div class="qa">${esc(t.nome)}</div></div>`
}

const cabecalho = (aluno) => `
  <div class="doc-h">
    <div class="doc-logo">Student Advisor</div>
    <div class="doc-date">${hoje()}</div>
  </div>
  <div class="doc-aluno">
    <b>${esc(aluno.name)}</b>
    <span>${esc(aluno.curso)} · ${esc(aluno.turma)} · ${esc(aluno.email)} · ${esc(aluno.telefone)}</span>
  </div>`

export function montarAta(aluno, tab, respostas) {
  return `${cabecalho(aluno)}
    <h1>Ata — ${esc(tab)}</h1>
    ${linhaTranscricao(respostas)}
    ${linhasRespostas(reunioes[tab], respostas)}`
}

export function montarFichaCompleta(aluno, respostasTodas = {}) {
  const secoes = ['Reunião 01', 'Reunião 02', 'Imersão'].map(tab => `
    <h2>${esc(tab)}</h2>
    ${linhaTranscricao(respostasTodas[tab] || {})}
    ${linhasRespostas(reunioes[tab], respostasTodas[tab] || {})}`).join('')

  const checklistResumo = (titulo, itens) => {
    const feitos = itens.filter(i => i.done).length
    const linhas = itens.map(i => `<div class="qd"><div class="qa">${i.done ? '☑' : '☐'} ${esc(i.label)}</div></div>`).join('')
    return `<h2>${esc(titulo)} (${feitos}/${itens.length})</h2>${linhas}`
  }

  const jornada = (aluno.jornada || []).map(c => {
    const estado = c.feito ? `☑ Concluído${c.data ? ` em ${esc(c.data)}` : ''}` : '☐ Pendente'
    return `<div class="qd"><div class="qq">${esc(c.fase)}</div><div class="qa">${estado} · ${esc(c.meio)}</div></div>`
  }).join('')

  return `${cabecalho(aluno)}
    <h1>Ficha Completa do Aluno</h1>
    <div class="qd"><div class="qq">Status</div><div class="qa"><b>${esc(aluno.status)}</b></div></div>
    <div class="qd"><div class="qq">Progresso do curso</div><div class="qa"><b>${Math.round(aluno.progresso * 100)}%</b></div></div>
    <h2>🔔 Jornada de contatos</h2>
    ${jornada}
    ${checklistResumo('📄 Documentos / Matrícula', aluno.check.docs)}
    ${checklistResumo('✅ Etapas de acompanhamento', aluno.check.etapas)}
    ${secoes}`
}

const ESTILO_IMPRESSAO = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#14162b;padding:40px;line-height:1.5}
  .doc-h{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #6d5ef6;padding-bottom:12px;margin-bottom:16px}
  .doc-logo{font-weight:700;font-size:18px;color:#6d5ef6}
  .doc-date{font-size:13px;color:#6e7389}
  .doc-aluno{margin-bottom:22px}
  .doc-aluno b{font-size:17px;display:block}
  .doc-aluno span{font-size:12px;color:#6e7389}
  h1{font-size:20px;margin:8px 0 18px}
  h2{font-size:15px;margin:22px 0 10px;color:#6d5ef6;border-bottom:1px solid #e9eaf4;padding-bottom:5px}
  .qd{margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #f0f1f8}
  .qq{font-size:13px;font-weight:600}
  .qa{font-size:13px;color:#25214a;margin-top:2px}
  .qn{font-size:12px;color:#6e7389;margin-top:4px;padding-left:10px;border-left:2px solid #e9eaf4}
`

// Abre a janela de impressão do navegador (permite "Salvar como PDF").
export function imprimirDocumento(titulo, html) {
  const w = window.open('', '_blank')
  if (!w) { alert('O navegador bloqueou a janela de impressão. Permita pop-ups para exportar.'); return }
  w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(titulo)}</title><style>${ESTILO_IMPRESSAO}</style></head><body>${html}</body></html>`)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 300)
}

// Central de dados do sistema.
// Por enquanto os valores são fixos (iguais ao protótipo).
// Quando a gente ligar as abas de verdade, é aqui que os dados reais vão morar.

// Paleta sóbria e dessaturada (menos "artificial").
export const G = {
  brand: '#5a5cbf', brand2: '#8082cf', teal: '#3fa394', amber: '#c9903f',
  pink: '#bd6f88', red: '#cc5f66', blue: '#5279bd', green: '#4c9e77', mut: '#9498ae',
}

// Abas da barra lateral. `ready:false` mostra a tela "em breve".
export const PAGES = [
  { id: 'Dashboard', title: 'Dashboard', sub: 'Visão geral do seu dia', ready: true },
  { id: 'Alunos', title: 'Alunos', sub: 'Gerencie e acompanhe seus alunos', ready: true },
  { id: 'Tarefas', title: 'Tarefas', sub: 'Organize suas atividades', ready: true },
  { id: 'Calendário', title: 'Calendário', sub: 'Julho de 2026', ready: true },
  { id: 'Relatórios', title: 'Relatórios', sub: 'Desempenho e métricas', ready: true },
  { id: 'Sac', title: 'SAC', sub: 'Central de atendimento', ready: true },
]

// Gera um checklist padrão; `done` marca os itens já concluídos.
const mkCheck = (docsDone = [], etapasDone = []) => ({
  docs: ['RG / CPF', 'Contrato de matrícula assinado', 'Comprovante de residência', 'Foto 3x4', 'Comprovante de pagamento']
    .map((label, i) => ({ label, done: docsDone.includes(i) })),
  etapas: ['Aula inaugural', 'Primeira avaliação', 'Reunião com responsável', 'Avaliação de meio de curso', 'Entrega do TCC']
    .map((label, i) => ({ label, done: etapasDone.includes(i) })),
})

// Checklist novo (tudo desmarcado) para alunos recém-cadastrados.
export const checklistVazio = () => mkCheck([], [])

// Meios de contato disponíveis na jornada.
export const meiosContato = ['Telefone', 'Videochamada (Meet)', 'Presencial']

// Jornada padrão de 3 contatos. `feitos` = quantos já foram concluídos.
export const jornadaPadrao = (feitos = 0) => [
  { fase: 'Contato inicial', meio: 'Telefone', quando: 'em até 15 dias' },
  { fase: '2º contato — Início da Especialização', meio: 'Videochamada (Meet)', quando: 'no início do curso' },
  { fase: '3º contato — Imersão', meio: 'Presencial', quando: 'na imersão' },
].map((e, i) => ({ ...e, feito: i < feitos, data: '', agendado: '', horaAgendada: '' }))

// Retorna o próximo contato pendente da jornada (ou null se concluída).
export const proximoContato = (jornada = []) => jornada.find(c => !c.feito) || null

// Especializações oferecidas (usadas no cadastro). Fácil de editar aqui.
export const cursos = [
  'Mecânico Básico Célula',
  'Mecânico Básico Aviônica',
  'Mecânico Básico GMP',
  'Célula',
  'Aviônica',
  'GMP',
]

// Paleta de cores para o avatar dos novos alunos.
export const paletaAvatar = [
  [G.brand, G.teal], [G.amber, G.pink], [G.teal, G.green],
  [G.pink, G.brand2], [G.blue, G.teal], [G.amber, G.brand],
]

const baseAlunos = [
  { name: 'Ana Beatriz Silva', email: 'ana.silva@email.com', telefone: '(11) 98765-4321', curso: 'Medicina', turma: 'Turma A', progresso: 0.86, status: 'Ativo', a: G.brand, b: G.teal, ultima: 'há 12 min', check: mkCheck([0, 1, 2, 3, 4], [0, 1, 2, 3]) },
  { name: 'Carlos Mendes', email: 'carlos.m@email.com', telefone: '(11) 91234-5678', curso: 'Engenharia', turma: 'Turma C', progresso: 0.54, status: 'Ativo', a: G.amber, b: G.pink, ultima: 'há 40 min', check: mkCheck([0, 1, 3], [0, 1]) },
  { name: 'Júlia Rocha', email: 'julia.r@email.com', telefone: '(21) 99876-1234', curso: 'Direito', turma: 'Turma B', progresso: 0.31, status: 'Em risco', a: G.teal, b: G.green, ultima: 'há 3 dias', check: mkCheck([0, 3], [0]) },
  { name: 'Pedro Alves', email: 'pedro.a@email.com', telefone: '(31) 98888-7777', curso: 'Física', turma: 'Turma D', progresso: 0.68, status: 'Ativo', a: G.pink, b: G.brand2, ultima: 'há 1 h', check: mkCheck([0, 1, 2, 4], [0, 1, 2]) },
  { name: 'Marina Costa', email: 'marina.c@email.com', telefone: '(11) 97777-3333', curso: 'Psicologia', turma: 'Turma A', progresso: 1, status: 'Formado', a: G.blue, b: G.teal, ultima: 'há 1 sem', check: mkCheck([0, 1, 2, 3, 4], [0, 1, 2, 3, 4]) },
  { name: 'Rafael Lima', email: 'rafael.l@email.com', telefone: '(41) 96666-2222', curso: 'Arquitetura', turma: 'Turma C', progresso: 0.42, status: 'Em risco', a: G.amber, b: G.brand, ultima: 'há 5 dias', check: mkCheck([0], []) },
]

// Quantos contatos cada aluno-exemplo já concluiu (para variar os alertas).
const _feitos = [3, 1, 0, 2, 3, 0]
export const alunos = baseAlunos.map((a, i) => ({ ...a, jornada: jornadaPadrao(_feitos[i] ?? 0) }))

// Cor do badge de status.
export const statusColors = {
  'Ativo': { color: G.green, bg: 'var(--greenBg)' },
  'Em risco': { color: G.red, bg: 'var(--redBg)' },
  'Formado': { color: G.blue, bg: 'var(--blueBg)' },
}

// Perguntas das reuniões. Fácil de adicionar/editar aqui sem mexer no visual.
// tipo 'sn'   = Sim/Não. notaSim/notaNao = rótulo do campo que aparece ao
//               escolher aquela resposta (null = não abre campo).
// tipo 'texto'= resposta aberta (campo de texto livre).
export const reunioes = {
  'Reunião 01': [
    { id: 'r1_plataforma', tipo: 'sn', q: 'Confirmar se o aluno acessou e navegou na plataforma', notaNao: 'Por quê?' },
    { id: 'r1_jornada', tipo: 'sn', q: 'Apresentou a jornada completa (módulos + imersão prática)?', notaNao: 'Por quê?' },
    { id: 'r1_operacao', tipo: 'sn', q: 'Tem dúvidas sobre a operação?', notaSim: 'Observação sobre o polo do aluno' },
    { id: 'r1_sac', tipo: 'sn', q: 'Estabeleceu canal direto (SAC)?', notaNao: 'Por quê?' },
    { id: 'r1_percepcao', tipo: 'texto', q: 'Qual a primeira percepção do aluno sobre o curso/escola?' },
  ],
  'Reunião 02': [
    { id: 'r2_andamento', tipo: 'texto', q: 'Registro de andamento acadêmico' },
    { id: 'r2_imersao_info', tipo: 'sn', q: 'Informou o aluno sobre a imersão prática?', notaNao: 'Por quê?' },
    { id: 'r2_imersao_levar', tipo: 'sn', q: 'Informou o que o aluno precisa levar?', notaNao: 'Por quê?' },
    { id: 'r2_imersao_dias', tipo: 'sn', q: 'Informou o que vai acontecer nos 2 dias de imersão?', notaNao: 'Por quê?' },
    { id: 'r2_espec', tipo: 'sn', q: 'Identificou próximas especializações de interesse?', notaSim: 'Qual especialização?', notaNao: 'Por quê?' },
    { id: 'r2_linkedin', tipo: 'sn', q: 'O LinkedIn do aluno está atualizado?', notaNao: 'Por quê?' },
    { id: 'r2_vagas', tipo: 'sn', q: 'Indicou vagas (caso exista no banco)?', notaNao: 'Por quê?' },
    { id: 'r2_curriculo', tipo: 'sn', q: 'Tem dúvidas sobre o currículo?', notaNao: 'Por quê?' },
  ],
  'Imersão': [
    { id: 'im_anotacoes', tipo: 'texto', q: 'Anotações durante a imersão' },
    { id: 'im_individual', tipo: 'sn', q: 'Conversou individualmente com cada aluno?', notaNao: 'Por quê?' },
  ],
}

// Colunas do quadro de tarefas (Kanban).
export const tarefasColunas = [
  { titulo: 'A fazer', cor: G.mut, tarefas: [
    { t: 'Preparar material de Cálculo', tag: 'Aula', tc: G.brand, tb: 'var(--vio)', due: 'Amanhã', a: G.brand, b: G.teal },
    { t: 'Ligar para responsáveis', tag: 'SAC', tc: G.amber, tb: 'var(--amberBg)', due: 'Hoje', a: G.amber, b: G.pink },
    { t: 'Revisar plano de aula', tag: 'Plano', tc: G.teal, tb: 'var(--tealBg)', due: 'Qui', a: G.teal, b: G.green },
  ] },
  { titulo: 'Em andamento', cor: G.brand, tarefas: [
    { t: 'Corrigir provas de Física', tag: 'Notas', tc: G.pink, tb: 'var(--pinkBg)', due: 'Hoje', a: G.pink, b: G.brand2 },
    { t: 'Montar relatório mensal', tag: 'Relatório', tc: G.blue, tb: 'var(--blueBg)', due: 'Sex', a: G.blue, b: G.teal },
  ] },
  { titulo: 'Concluído', cor: G.green, tarefas: [
    { t: 'Reunião pedagógica', tag: 'Reunião', tc: G.teal, tb: 'var(--tealBg)', due: 'Ontem', a: G.teal, b: G.green },
    { t: 'Atualizar matrículas', tag: 'Alunos', tc: G.brand, tb: 'var(--vio)', due: 'Seg', a: G.brand, b: G.brand2 },
    { t: 'Enviar comunicado', tag: 'Aviso', tc: G.amber, tb: 'var(--amberBg)', due: 'Seg', a: G.amber, b: G.pink },
  ] },
]

export const calendario = {
  // Tipos de evento disponíveis ao adicionar (nome + cor).
  tiposEvento: [
    { nome: 'Reunião', cor: G.brand }, { nome: 'Prova', cor: G.amber }, { nome: 'Aula', cor: G.pink },
    { nome: 'SAC', cor: G.teal }, { nome: 'Entrega', cor: G.blue }, { nome: 'Outro', cor: G.mut },
  ],
  hoje: 3,
}

export const dashboard = {
  // Só as cores/estilo das 4 métricas do topo (os valores são calculados).
  metrics: [
    { a: G.brand, b: G.brand2 },
    { a: G.amber, b: G.pink },
    { a: G.teal, b: G.green },
    { a: G.red, b: G.pink },
  ],
}

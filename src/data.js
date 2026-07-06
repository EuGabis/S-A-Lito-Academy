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

export const relatorios = {
  metrics: [
    { label: 'Receita mensal', value: 'R$ 84k', delta: '12%', up: true, a: G.brand, b: G.brand2 },
    { label: 'Novos alunos', value: '64', delta: '9%', up: true, a: G.teal, b: G.green },
    { label: 'Evasão', value: '2,4%', delta: '0,6%', up: false, a: G.red, b: G.pink },
    { label: 'NPS', value: '72', delta: '4', up: true, a: G.amber, b: G.pink },
  ],
  crescimento: [['Jan', 52], ['Fev', 61], ['Mar', 58], ['Abr', 70], ['Mai', 66], ['Jun', 78]],
  crescimentoHi: 5,
  porCurso: [
    { label: 'Célula', pct: '32%', cor: G.brand },
    { label: 'Aviônica', pct: '24%', cor: G.teal },
    { label: 'GMP', pct: '20%', cor: G.amber },
    { label: 'Outros', pct: '24%', cor: G.pink },
  ],
  turmas: [
    { label: 'Turma A — Célula', pct: 0.92, a: G.teal, b: G.green },
    { label: 'Turma B — Aviônica', pct: 0.78, a: G.brand, b: G.brand2 },
    { label: 'Turma C — GMP', pct: 0.64, a: G.amber, b: G.pink },
    { label: 'Turma D — Básico', pct: 0.48, a: G.pink, b: G.brand2 },
  ],
}

export const calendario = {
  // Eventos por dia do mês (Julho/2026). Cada dia tem uma lista. hoje = dia 3.
  eventos: {
    3: [{ titulo: 'Reunião', cor: G.brand }],
    8: [{ titulo: 'Prova', cor: G.amber }],
    10: [{ titulo: 'SAC', cor: G.teal }],
    15: [{ titulo: 'Aula', cor: G.pink }],
    17: [{ titulo: 'Entrega', cor: G.blue }],
    22: [{ titulo: 'Reunião', cor: G.brand }],
    24: [{ titulo: 'Prova', cor: G.red }],
    29: [{ titulo: 'Revisão', cor: G.teal }],
  },
  // Tipos de evento disponíveis ao adicionar.
  tiposEvento: [
    { nome: 'Reunião', cor: G.brand }, { nome: 'Prova', cor: G.amber }, { nome: 'Aula', cor: G.pink },
    { nome: 'SAC', cor: G.teal }, { nome: 'Entrega', cor: G.blue }, { nome: 'Outro', cor: G.mut },
  ],
  hoje: 3,
  agenda: [
    { hora: '09:00', titulo: 'Reunião pedagógica', local: 'Sala 204', cor: G.brand },
    { hora: '11:00', titulo: 'Prova de Cálculo', local: 'Turma A', cor: G.amber },
    { hora: '14:30', titulo: 'Atendimento SAC', local: 'Online', cor: G.teal },
    { hora: '16:00', titulo: 'Revisão de notas', local: 'Sala 101', cor: G.pink },
  ],
}

export const sac = {
  metrics: [
    { label: 'Tickets abertos', value: '18', delta: '5', up: false, a: G.amber, b: G.pink },
    { label: 'Resolvidos hoje', value: '42', delta: '15%', up: true, a: G.teal, b: G.green },
    { label: 'Tempo médio', value: '2h 14m', delta: '8%', up: true, a: G.brand, b: G.brand2 },
    { label: 'Satisfação', value: '96%', delta: '2%', up: true, a: G.pink, b: G.brand2 },
  ],
  tickets: [
    { nome: 'Carlos Mendes', msg: 'Não consigo acessar o material...', tempo: 'há 5 min', a: G.amber, b: G.pink, curso: 'Engenharia', conversa: [
      { de: 'them', txt: 'Olá! Não consigo acessar o material de Cálculo na plataforma.' },
      { de: 'me', txt: 'Oi Carlos! Vou verificar isso pra você agora mesmo. 👍' },
      { de: 'me', txt: 'Consegue tentar sair e entrar novamente na sua conta?' },
      { de: 'them', txt: 'Funcionou! Muito obrigado pela ajuda rápida. 🙏' },
    ] },
    { nome: 'Júlia Rocha', msg: 'Dúvida sobre a matrícula de...', tempo: 'há 22 min', a: G.teal, b: G.green, curso: 'Direito', conversa: [
      { de: 'them', txt: 'Oi! Tenho uma dúvida sobre a matrícula da próxima especialização.' },
      { de: 'me', txt: 'Claro, Júlia! Qual especialização você tem interesse?' },
      { de: 'them', txt: 'A de Aviônica. Ainda tem vaga?' },
    ] },
    { nome: 'Pedro Alves', msg: 'Quando sai a nota da prova?', tempo: 'há 1 h', a: G.pink, b: G.brand2, curso: 'Física', conversa: [
      { de: 'them', txt: 'Quando sai a nota da prova de Física?' },
      { de: 'me', txt: 'Oi Pedro! As notas saem até sexta-feira. 📅' },
    ] },
    { nome: 'Marina Costa', msg: 'Obrigada pela ajuda! :)', tempo: 'há 2 h', a: G.blue, b: G.teal, curso: 'Psicologia', conversa: [
      { de: 'me', txt: 'Marina, seu certificado já está disponível na plataforma!' },
      { de: 'them', txt: 'Obrigada pela ajuda! :)' },
    ] },
    { nome: 'Rafael Lima', msg: 'Preciso remarcar a reunião', tempo: 'há 3 h', a: G.amber, b: G.brand, curso: 'Arquitetura', conversa: [
      { de: 'them', txt: 'Preciso remarcar a reunião de acompanhamento, pode ser?' },
      { de: 'me', txt: 'Sem problema, Rafael. Qual melhor dia pra você?' },
      { de: 'them', txt: 'Quinta à tarde seria ótimo.' },
    ] },
  ],
}

export const dashboard = {
  metrics: [
    { label: 'Alunos ativos', value: '248', delta: '8%', up: true, a: G.brand, b: G.brand2 },
    { label: 'Tarefas pendentes', value: '12', delta: '4', up: true, a: G.amber, b: G.pink },
    { label: 'Taxa de conclusão', value: '87%', delta: '5%', up: true, a: G.teal, b: G.green },
    { label: 'Alunos em risco', value: '3', delta: '2%', up: false, a: G.red, b: G.pink },
  ],
  weekly: [['Seg', 12], ['Ter', 18], ['Qua', 9], ['Qui', 22], ['Sex', 26], ['Sáb', 7], ['Dom', 5]],
  weeklyHi: 4,
  goals: [
    { label: 'Matrículas', pct: 0.72, a: G.brand, b: G.brand2 },
    { label: 'Retenção', pct: 0.9, a: G.teal, b: G.green },
    { label: 'Satisfação', pct: 0.84, a: G.amber, b: G.pink },
  ],
  activity: [
    { name: 'Ana Beatriz', text: 'concluiu a tarefa Redação I', time: 'há 12 min', a: G.brand, b: G.teal },
    { name: 'Carlos Mendes', text: 'enviou uma dúvida no SAC', time: 'há 40 min', a: G.amber, b: G.pink },
    { name: 'Júlia Rocha', text: 'matriculou-se em Cálculo', time: 'há 1 h', a: G.teal, b: G.green },
    { name: 'Pedro Alves', text: 'faltou à aula de Física', time: 'há 2 h', a: G.red, b: G.pink },
  ],
  today: [
    { time: '09:00', text: 'Reunião pedagógica', c: G.brand },
    { time: '11:30', text: 'Atendimento — Carlos', c: G.amber },
    { time: '14:00', text: 'Revisão de notas', c: G.teal },
    { time: '16:00', text: 'Call com responsáveis', c: G.pink },
  ],
}

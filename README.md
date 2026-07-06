# Student Advisor — S-A-Lito Academy

Sistema de acompanhamento de alunos para uma escola de manutenção aeronáutica
(cursos: Célula, Aviônica, GMP e versões básicas). Feito em React + Vite.

## Funcionalidades

- **Dashboard** com números sincronizados das outras telas
- **Alunos**: cards, ficha completa (modal) com abas — Dados, Jornada, Reunião 01, Reunião 02, Imersão
  - Checklists de documentos e acompanhamento
  - Formulários de reunião (Sim/Não com campo de "porquê" automático)
  - Upload da transcrição do Meet por reunião
  - Geração de **ata** e **ficha completa** exportáveis em PDF
  - **Jornada de contatos** com agendamento do próximo contato
  - Cadastro de novo aluno
- **Tarefas**: quadro Kanban com adicionar, excluir (com confirmação) e arrastar-e-soltar
- **Calendário**: eventos por dia, agendar com horário e aluno vinculado
- **Relatórios**: métricas, gráficos e exportação
- **SAC**: central de atendimento com conversa por ticket
- Layout **responsivo** (desktop e mobile)

> Observação: os dados vivem em memória durante a sessão (ainda sem banco de dados).
> A conexão com o banco é o próximo passo.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:5173

## Build de produção

```bash
npm run build
npm run preview
```

-- ============================================================
--  S&A / Student Advisor — esquema do projeto
--  Todas as tabelas usam o prefixo "sa_" para ficarem separadas
--  e identificáveis dentro do Supabase.
-- ============================================================

-- ---------- ALUNOS ----------
create table if not exists sa_alunos (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text unique not null,
  telefone     text,
  curso        text,
  turma        text,
  progresso    numeric default 0,
  status       text default 'Ativo',
  ultima       text,
  avatar_a     text,
  avatar_b     text,
  created_at   timestamptz default now()
);

-- ---------- CURSOS (especializações) ----------
create table if not exists sa_cursos (
  id     uuid primary key default gen_random_uuid(),
  nome   text unique not null,
  ordem  int default 0
);

-- ---------- CHECKLIST (documentos / etapas) ----------
create table if not exists sa_checklist_itens (
  id        uuid primary key default gen_random_uuid(),
  aluno_id  uuid references sa_alunos(id) on delete cascade,
  grupo     text,          -- 'docs' | 'etapas'
  label     text,
  done      boolean default false,
  ordem     int default 0
);

-- ---------- JORNADA DE CONTATOS ----------
create table if not exists sa_jornada_contatos (
  id             uuid primary key default gen_random_uuid(),
  aluno_id       uuid references sa_alunos(id) on delete cascade,
  fase           text,
  meio           text,
  quando         text,
  feito          boolean default false,
  data           text,          -- data de conclusão (texto exibido)
  agendado       date,          -- data agendada do próximo contato
  hora_agendada  text,
  ordem          int default 0
);

-- ---------- RESPOSTAS DAS REUNIÕES ----------
create table if not exists sa_reuniao_respostas (
  id           uuid primary key default gen_random_uuid(),
  aluno_id     uuid references sa_alunos(id) on delete cascade,
  reuniao      text,          -- 'Reunião 01' | 'Reunião 02' | 'Imersão'
  pergunta_id  text,
  resp         text,          -- 'sim' | 'nao' | null
  nota         text,
  texto        text,
  unique (aluno_id, reuniao, pergunta_id)
);

-- ---------- TRANSCRIÇÕES (Meet) ----------
create table if not exists sa_transcricoes (
  id          uuid primary key default gen_random_uuid(),
  aluno_id    uuid references sa_alunos(id) on delete cascade,
  reuniao     text,
  nome        text,
  tamanho     bigint,
  storage_path text,          -- caminho no Storage (quando subir o arquivo de verdade)
  created_at  timestamptz default now()
);

-- ---------- TAREFAS (Kanban) ----------
create table if not exists sa_tarefas (
  id         uuid primary key default gen_random_uuid(),
  coluna     text,            -- 'A fazer' | 'Em andamento' | 'Concluído'
  titulo     text,
  tag        text,
  tag_cor    text,
  tag_bg     text,
  due        text,
  avatar_a   text,
  avatar_b   text,
  ordem      int default 0,
  created_at timestamptz default now()
);

-- ---------- EVENTOS (Calendário) ----------
create table if not exists sa_eventos (
  id         uuid primary key default gen_random_uuid(),
  dia        int,
  mes        int default 7,
  ano        int default 2026,
  titulo     text,
  cor        text,
  hora       text,
  aluno_id   uuid references sa_alunos(id) on delete set null,
  created_at timestamptz default now()
);

-- ---------- SAC: TICKETS ----------
create table if not exists sa_sac_tickets (
  id          uuid primary key default gen_random_uuid(),
  nome        text,
  curso       text,
  ultima_msg  text,
  tempo       text,
  avatar_a    text,
  avatar_b    text,
  created_at  timestamptz default now()
);

-- ---------- SAC: MENSAGENS ----------
create table if not exists sa_sac_mensagens (
  id         uuid primary key default gen_random_uuid(),
  ticket_id  uuid references sa_sac_tickets(id) on delete cascade,
  de         text,            -- 'me' | 'them'
  texto      text,
  ordem      int default 0,
  created_at timestamptz default now()
);

-- ============================================================
--  Permissões e RLS
--  Sem login ainda: liberamos acesso para as chaves anon/service.
--  Quando adicionarmos login (para a Dani etc.), trancamos com
--  políticas por usuário.
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'sa_alunos','sa_cursos','sa_checklist_itens','sa_jornada_contatos',
    'sa_reuniao_respostas','sa_transcricoes','sa_tarefas','sa_eventos',
    'sa_sac_tickets','sa_sac_mensagens'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('grant all on table %I to anon, authenticated, service_role;', t);
    execute format('drop policy if exists %I on %I;', t || '_all', t);
    execute format('create policy %I on %I for all to anon, authenticated using (true) with check (true);', t || '_all', t);
  end loop;
end $$;

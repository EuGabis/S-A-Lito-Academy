-- Guarda checklist e jornada como JSON na linha do aluno (a ficha os trata juntos).
alter table sa_alunos add column if not exists check_data jsonb;
alter table sa_alunos add column if not exists jornada    jsonb;

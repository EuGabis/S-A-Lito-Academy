-- Respostas das reuniões (Reunião 01/02/Imersão) + transcrições anexadas,
-- guardadas como JSON na linha do aluno (a ficha as trata junto do resto).
alter table sa_alunos add column if not exists reunioes jsonb;

-- Campos de contato para reclamações enviadas pela página pública.
alter table sa_sac_tickets add column if not exists email   text;
alter table sa_sac_tickets add column if not exists assunto text;

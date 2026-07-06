import { createClient } from '@supabase/supabase-js'

// Conexão com o Supabase. As variáveis vêm do .env.local (fora do Git).
// Só a chave pública (anon) é usada no app — a privada nunca entra aqui.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, anonKey)

// true quando as variáveis estão configuradas (evita quebrar se faltar .env.local).
export const supabasePronto = Boolean(url && anonKey)

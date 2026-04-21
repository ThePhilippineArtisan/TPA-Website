import { createClient } from '@supabase/supabase-js';

// SUPABASE_URL - Supabase URL using our project slug
// SUPABASE_ANON_KEY - Supabase anon key from the API settings of our project

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
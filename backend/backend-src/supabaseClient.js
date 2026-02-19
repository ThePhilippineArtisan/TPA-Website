import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// SUPABASE_URL - Supabase URL using our project slug
// SUPABASE_ANON_KEY - Supabase anon key from the API settings of our project

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY
)

export default supabase;
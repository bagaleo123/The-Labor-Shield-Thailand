import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY) as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type GeneratedDocument = {
  id: string;
  type: 'inquiry' | 'complaint';
  language: 'en' | 'th';
  content: string;
  employee_name: string;
  employer_name: string;
  created_at: string;
};

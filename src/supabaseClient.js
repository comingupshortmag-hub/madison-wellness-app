import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jqhhkyqipzcnlvftdipu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxaGhreXFpcHpjbmx2ZnRkaXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDUwMTEsImV4cCI6MjA4ODcyMTAxMX0.TqltKkcy--ZyXfQsHwtI0IT51dWphcu-hxp31HyWqVs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

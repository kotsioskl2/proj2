import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ddtqzdymlsrujlcdacim.supabase.co'; // Replace with your Supabase project URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdHF6ZHltbHNydWpsY2RhY2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjcyMDksImV4cCI6MjA1MDIwMzIwOX0.8_by6KM5kRrIvzSW6R2Ac-NMcG3b2bNR_83j3DiH1XY'; // Replace with your Supabase anon/public key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

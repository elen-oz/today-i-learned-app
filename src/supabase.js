import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kwwrlftwvgitbqfsoetw.supabase.co';

const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3d3JsZnR3dmdpdGJxZnNvZXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3NjUxMDYsImV4cCI6MjAwMjM0MTEwNn0.paYsqobCay7quMunGtDPaRimPSGfxS1V3ZR8_-CdeU0';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

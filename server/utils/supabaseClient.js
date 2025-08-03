import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-service-role-key'; // Use env variable in production

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

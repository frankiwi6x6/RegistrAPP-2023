import { createClient } from '@supabase/supabase-js';
import { DB_URL, DB_PASSWORD } from 'db_info';

export const supabase = createClient(DB_URL, DB_PASSWORD);
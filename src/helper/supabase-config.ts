import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_BASE_URL_SUPABASE || ''; // Provide a default empty string
const supabaseKey = process.env.NEXT_PUBLIC_BASE_KEY_SUPABASE || ''; // Provide a default empty string

// Check if the values are correctly set
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are not defined in the environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
    

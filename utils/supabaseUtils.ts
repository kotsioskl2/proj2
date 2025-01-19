import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export const fetchData = async (table: string) => {
    const { data, error } = await supabase
        .from(table)
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const insertData = async (table: string, payload: object) => {
    const { data, error } = await supabase
        .from(table)
        .insert([payload]);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const updateData = async (table: string, id: string, payload: object) => {
    const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const deleteData = async (table: string, id: string) => {
    const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};
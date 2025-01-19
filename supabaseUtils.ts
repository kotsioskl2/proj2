import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key';

// Initialize Supabase client
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  throw error;
}

interface Listing {
  id: string;
  brand: string;
  model: string;
  price: number;
  engine: string;
  engineSize: number;
  mileage: number;
  transmission: string;
  color: string;
  year: number;
  description: string;
  images: string[];
  location: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export const fetchListings = async (): Promise<Listing[]> => {
  try {
    console.log('Attempting to fetch listings...');
    const { data, error } = await supabase
      .from('listings')
      .select('*');

    if (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }

    console.log('Listings fetched:', data);
    return data as Listing[];
  } catch (error) {
    console.error('Error in fetchListings:', error);
    throw error;
  }
};

export const fetchListingById = async (id: string): Promise<Listing> => {
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Listing;
};

export const createListing = async (listing: Listing): Promise<Listing> => {
  const { data, error } = await supabase.from('listings').insert(listing).single();
  if (error) throw error;
  return data as Listing;
};

export const updateListing = async (listing: Listing): Promise<Listing | null> => {
  const { data, error } = await supabase.from('listings').update(listing).eq('id', listing.id).single();
  if (error) throw error;
  return data as Listing | null;
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data as User[];
};

export const deleteListing = async (id: string): Promise<void> => {
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) throw error;
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
};

import { supabase } from "./supabaseClient";

// Define the Listing type using JSDoc
/**
 * @typedef {Object} Listing
 * @property {string} id
 * @property {string} brand
 * @property {string} model
 * @property {number} price
 * @property {string} engine
 * @property {number} engineSize
 * @property {number} mileage
 * @property {string} transmission
 * @property {string} color
 * @property {number} year
 * @property {string} description
 * @property {string} location
 * @property {string[]} images // Ensure this line is included
 * @property {string} photoUrl
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const createListing = async (listingData) => {
  try {
    const { data, error } = await supabase
      .from("listings")
      .insert([listingData])
      .select();

    if (error) throw error;
    console.log("Listing created:", data);
    return data;
  } catch (err) {
    console.error("Error creating listing:", err.message);
    throw new Error(`Failed to create listing: ${err.message}`);
  }
};

export const uploadImage = async (file) => {
  try {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG, PNG or WebP images.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const filePath = `${Date.now()}_${file.name.replace(/\s+/g, '-')}`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    console.log("Image uploaded, public URL:", publicUrl);
    return publicUrl;
  } catch (err) {
    console.error("Error uploading image:", err.message);
    throw new Error(`Failed to upload image: ${err.message}`);
  }
};

// Add these new auth functions
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return user;
};

// Fetch all listings
export const fetchListings = async () => {
  try {
    console.log("Fetching listings...");
    const { data, error, count } = await supabase
      .from("listings")
      .select("*", { count: 'exact' });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    console.log(`Fetched ${count} listings:`, data);
    if (!data || data.length === 0) {
      console.log("No listings found");
    } else {
      console.log("First listing:", data[0]);
    }
    return data;
  } catch (err) {
    console.error("Error fetching listings:", err.message);
    throw new Error(`Failed to fetch listings: ${err.message}`);
  }
};

// Fetch a listing by its ID
/**
 * Fetch a listing by its ID
 * @param {string} id - The ID of the listing
 * @returns {Promise<Listing>} - The listing data
 */
export const fetchListingById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching listing by ID:", err.message);
    throw new Error(`Failed to fetch listing: ${err.message}`);
  }
};

// Fetch all users
export const fetchUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

// Update a listing
export const updateListing = async (updates) => {
  try {
    const { id, ...rest } = updates;
    const { data, error } = await supabase.from("listings").update(rest).eq("id", id);

    if (error) throw error;

    console.log("Listing updated:", data);
    return data[0]; // Return the updated listing
  } catch (err) {
    console.error("Error updating listing:", err.message);
    throw err;
  }
};

// Update a user
export const updateUser = async (id, updates) => {
  const { data, error } = await supabase.from("users").update(updates).eq("id", id);
  if (error) throw error;
  return data;
};
// Delete a listing
export const deleteListing = async (id) => {
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) throw error;
};

// Delete a user
export const deleteUser = async (id) => {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
};

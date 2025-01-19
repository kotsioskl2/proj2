import { supabase } from "./supabaseClient";

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

    const filePath = `vehicles/${Date.now()}_${file.name.replace(/\s+/g, '-')}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    console.log("Image uploaded, public URL:", publicUrl);
    return publicUrl;
  } catch (err) {
    console.error("Error uploading image:", err.message);
    throw new Error(`Failed to upload image: ${err.message}`);
  }
};

// Fetch all listings
export const fetchListings = async () => {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*");

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching listings:", err.message);
    throw new Error(`Failed to fetch listings: ${err.message}`);
  }
};

// Fetch all users
export const fetchUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

// Update a listing
export const updateListing = async (id, updates) => {
  try {
    const { data, error } = await supabase.from("listings").update(updates).eq("id", id);

    if (error) throw error;

    console.log("Listing updated:", data);
    return data;
  } catch (err) {
    console.error("Error updating listing:", err.message);
    throw err;
  }
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

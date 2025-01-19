import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { updateListing } from '../supabaseUtils';

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
  location: string;
  images: string[];
}

const UpdateListing: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setListing((prevListing) => prevListing ? { ...prevListing, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    setLoading(true);
    try {
      const updatedListing = await updateListing(listing); // Pass only the listing object
      if (updatedListing) {
        router.push(`/listing/${id}`);
      } else {
        setError('Failed to update listing');
      }
    } catch (err) {
      setError(`Failed to update listing: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl mb-5">Update Listing</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Brand</label>
          <input
            type="text"
            name="brand"
            value={listing?.brand || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Model</label>
          <input
            type="text"
            name="model"
            value={listing?.model || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={listing?.price || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Engine</label>
          <input
            type="text"
            name="engine"
            value={listing?.engine || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Engine Size</label>
          <input
            type="number"
            name="engineSize"
            value={listing?.engineSize || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mileage</label>
          <input
            type="number"
            name="mileage"
            value={listing?.mileage || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Transmission</label>
          <input
            type="text"
            name="transmission"
            value={listing?.transmission || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Color</label>
          <input
            type="text"
            name="color"
            value={listing?.color || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Year</label>
          <input
            type="number"
            name="year"
            value={listing?.year || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={listing?.description || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={listing?.location || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Listing'}
        </button>
      </form>
    </div>
  );
};

export default UpdateListing;

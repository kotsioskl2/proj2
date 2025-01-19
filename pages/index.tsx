import React, { useState, useEffect, useCallback } from "react";
import dynamic from 'next/dynamic';
import { fetchListings, type Listing, deleteListing } from "../utils/supabaseUtils";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { CirclePicker } from 'react-color';
import CustomNavbar from '../components/Navbar'; // Import the new Navbar component
import { useSession, signIn, signOut } from 'next-auth/react'; // Correct import path for NextAuth
import type { ColorResult } from 'react-color';
import AdminDashboard from '../components/admin/AdminDashboard'; // Corrected import path for AdminDashboard
import { useRouter } from 'next/router'; // Import useRouter from next/router

const ListingCard = dynamic(() => import('../components/ListingCard'), { ssr: false });

const Home: React.FC = () => {
  const { data: session, status } = useSession(); // Get session and status
  const loadingSession = status === 'loading';
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEngine, setFilterEngine] = useState("All");
  const [filterPrice, setFilterPrice] = useState<[number, number]>([0, 100000]);
  const [filterMileage, setFilterMileage] = useState<[number, number]>([0, 1000000]);
  const [filterTransmission, setFilterTransmission] = useState("All");
  const [filterColor, setFilterColor] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter(); // Initialize router

  // Fetch listings from Supabase
  const getListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedListings = await fetchListings();
      setListings(fetchedListings);
      setFilteredListings(fetchedListings);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    getListings();
  }, [getListings]);

  // Apply filters
  useEffect(() => {
    if (!isInitialLoad || listings.length > 0) {
      const filtered = listings.filter((listing) => {
        const matchesSearchTerm = searchTerm === "" || listing.brand.toLowerCase().includes(searchTerm.toLowerCase()) || listing.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEngine = filterEngine === "All" || listing.engine === filterEngine;
        const matchesPrice = listing.price >= filterPrice[0] && listing.price <= filterPrice[1];
        const matchesMileage = listing.mileage >= filterMileage[0] && listing.mileage <= filterMileage[1];
        const matchesTransmission = filterTransmission === "All" || listing.transmission === filterTransmission;
        const matchesColor = !filterColor || listing.color.toLowerCase() === filterColor.toLowerCase();

        return matchesSearchTerm && matchesEngine && matchesPrice && matchesMileage && matchesTransmission && matchesColor;
      });

      setFilteredListings(filtered);
    }
  }, [searchTerm, filterEngine, filterPrice, filterMileage, filterTransmission, filterColor, listings, isInitialLoad]);

  const handleError = (error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
  };

  const handleColorChange = (color: ColorResult) => {
    setFilterColor(color.hex);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteListing(id);
      await getListings(); // Refresh listings after delete
    } catch (error) {
      handleError(error);
    }
  };

  const handleEdit = (listing: Listing) => {
    // Implement edit functionality or navigation to edit page
    router.push(`/edit-listing/${listing.id}`);
  };

  if (loadingSession) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (isInitialLoad) {
    return <div className="text-center py-4">Loading listings...</div>;
  }

  return (
    <div className={`container mx-auto p-5 ${darkMode ? 'bg-dark text-white' : 'bg-white text-dark'}`}>
      <CustomNavbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      <header className="text-center my-8">
        <h1 className="display-4">Welcome to Headers Emulation 🚗</h1>
        <p className="lead">Find or post your perfect vehicle!</p>
        {!session ? (
          <button type="button" className="btn btn-primary" style={{ fontFamily: 'Arial, sans-serif' }} onClick={() => router.push('/login')}>Admin Login</button>
        ) : (
          <div>
            <p>Welcome, {session.user?.email}</p>
            <button type="button" className="btn btn-secondary" onClick={() => signOut()}>Logout</button>
          </div>
        )}
      </header>

      {/* Admin Section - Enhanced with dashboard */}
      {session?.user?.email === 'kotsios002@gmail.com' && (
        <div className="admin-section mb-4">
          <AdminDashboard 
            listings={listings}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      )}

      {/* Filters Section */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3 d-flex">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control me-2"
          />
          <button className="btn btn-primary" onClick={() => console.log("Search button clicked")}>
            Search
          </button>
        </div>
        <div className="col-md-3 mb-3">
          <select
            value={filterEngine}
            onChange={(e) => setFilterEngine(e.target.value)}
            className="form-select"
          >
            <option value="All">All Engines</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Price Range (€)</label>
          <Slider
            range
            min={0}
            max={100000}
            defaultValue={filterPrice}
            onChange={(value) => setFilterPrice(value as [number, number])}
            trackStyle={[{ backgroundColor: '#007bff' }]}
            handleStyle={[{ borderColor: '#007bff' }, { borderColor: '#007bff' }]}
            className="form-control"
          />
          <p className="mt-2">
            €{filterPrice[0]} - €{filterPrice[1]}
          </p>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Mileage Range (km)</label>
          <Slider
            range
            min={0}
            max={1000000}
            defaultValue={filterMileage}
            onChange={(value) => setFilterMileage(value as [number, number])}
            trackStyle={[{ backgroundColor: '#007bff' }]}
            handleStyle={[{ borderColor: '#007bff' }, { borderColor: '#007bff' }]}
            className="form-control"
          />
          <p className="mt-2">
            {filterMileage[0]} km - {filterMileage[1]} km
          </p>
        </div>
        <div className="col-md-3 mb-3">
          <select
            value={filterTransmission}
            onChange={(e) => setFilterTransmission(e.target.value)}
            className="form-select"
          >
            <option value="All">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Semi-Automatic">Semi-Automatic</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Color</label>
          <CirclePicker
            color={filterColor || '#fff'}
            onChangeComplete={handleColorChange}
          />
        </div>
      </div>

      {/* Link to Post Listing Page */}
      <Link href="/PostListing" legacyBehavior>
        <a className="btn btn-primary mb-4">
          + Post a Listing
        </a>
      </Link>

      {loading && <div className="text-center py-4">Updating listings...</div>}
      {error && <div className="text-center py-4 text-danger">{error}</div>}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Available Vehicles</h2>
        {filteredListings.length > 0 ? (
          <div className="row">
            {filteredListings.map((listing) => (
              <div className="col-md-6 col-lg-4 mb-4" key={listing.id}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No vehicles found matching your criteria</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or check back later for new listings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;


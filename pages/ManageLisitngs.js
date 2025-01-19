import React, { useEffect, useState } from "react";
import { fetchListings, deleteListing } from "../supabaseUtils"; // Updated import statement

const ManageListings = () => {
    const [listings, setListings] = useState([]);
    const [selectedListing, setSelectedListing] = useState(null);

    useEffect(() => {
        const getListings = async () => {
            try {
                const fetchedListings = await fetchListings();
                setListings(fetchedListings);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            }
        };
        getListings();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this listing?")) {
            await deleteListing(id);
            setListings(listings.filter((listing) => listing.id !== id));
        }
    };

    const handleSelectListing = (listing) => {
        setSelectedListing(listing);
    };

    return (
        <div>
            <h1>Manage Listings</h1>
            <ul>
                {listings.map((listing) => (
                    <li key={listing.id}>
                        <h2 onClick={() => handleSelectListing(listing)}>{listing.brand} {listing.model}</h2>
                        <button onClick={() => handleDelete(listing.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {selectedListing && (
                <div>
                    <h2>Listing Details</h2>
                    <p>Brand: {selectedListing.brand}</p>
                    <p>Model: {selectedListing.model}</p>
                    <p>Price: {selectedListing.price}</p>
                    <p>Engine: {selectedListing.engine}</p>
                    <p>Engine Size: {selectedListing.engineSize}</p>
                    <p>Mileage: {selectedListing.mileage}</p>
                    <p>Transmission: {selectedListing.transmission}</p>
                    <p>Color: {selectedListing.color}</p>
                    <p>Year: {selectedListing.year}</p>
                    <p>Description: {selectedListing.description}</p>
                    <p>Location: {selectedListing.location}</p>
                    <div>
                        {selectedListing.images.map((image, index) => (
                            <img key={index} src={image} alt={`Listing image ${index + 1}`} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageListings;

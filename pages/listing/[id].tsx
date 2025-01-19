import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { fetchListingById } from '../../utils/supabaseUtils'; // Correct the import path
import { Spinner, Alert, Button, Navbar, Nav, Carousel } from 'react-bootstrap'; // Ensure Carousel is imported from 'react-bootstrap'

const Image = dynamic(() => import('next/image'), { ssr: false });

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

const ListingPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchListingById(id as string)
        .then((data) => {
          setListing(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(`Failed to load listing: ${error.message || "Unknown error"}`);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-4">
        <Alert variant="warning">Listing not found</Alert>
      </div>
    );
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/">Car Listings</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/listings">Listings</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="container mx-auto p-5" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
        <div className="row">
          {/* Photo Gallery */}
          <div className="col-md-6">
            {listing.images && listing.images.length > 0 ? (
              <Carousel>
                {listing.images.map((image, index) => (
                  <Carousel.Item key={index}> {/* Ensure Carousel.Item is used correctly */}
                    <div className="position-relative" style={{ paddingTop: "56.25%", borderRadius: "10px", overflow: "hidden" }}>
                      <Image
                        src={image}
                        alt={`${listing.brand} ${listing.model} image ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        loading="lazy"
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div
                className="position-relative bg-secondary d-flex align-items-center justify-content-center"
                style={{ paddingTop: "56.25%", borderRadius: "10px" }}
              >
                <span className="text-white">No image available</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="col-md-6">
            <h1 className="mb-3">
              {listing.brand} {listing.model} <span className="text-muted">({listing.year})</span>
            </h1>
            <h2 className="text-success mb-4">€{listing.price.toLocaleString()}</h2>
            <p className="mb-4">{listing.description}</p>

            <ul className="list-unstyled">
              <li className="mb-3">
                <span role="img" aria-label="engine">⚙️</span> <strong>Engine:</strong> {listing.engine}
              </li>
              <li className="mb-3">
                <span role="img" aria-label="transmission">🚗</span> <strong>Transmission:</strong> {listing.transmission}
              </li>
              <li className="mb-3">
                <span role="img" aria-label="engine-size">🔧</span> <strong>Engine Size:</strong> {listing.engineSize}L
              </li>
              <li className="mb-3">
                <span role="img" aria-label="color">🎨</span> <strong>Color:</strong> {listing.color}
              </li>
              <li className="mb-3">
                <span role="img" aria-label="mileage">📏</span> <strong>Mileage:</strong> {listing.mileage.toLocaleString()} km
              </li>
              <li className="mb-3">
                <span role="img" aria-label="location">📍</span> <strong>Location:</strong> {listing.location}
              </li>
            </ul>

            <Button variant="primary" onClick={() => router.back()}>
              Back to Listings
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingPage;
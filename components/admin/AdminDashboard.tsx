import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { Button, Table, Modal, Carousel } from 'react-bootstrap';
import Link from 'next/link';
import { Listing } from '../../utils/supabaseUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

interface CustomUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface AdminDashboardProps {
  listings: Listing[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (listing: Listing) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ listings, onDelete, onEdit }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    } else if ((session.user as CustomUser)?.role !== 'admin') {
      router.push('/');
    }
  }, [session]);

  const handleDeleteClick = (listing: Listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedListing) {
      await onDelete(selectedListing.id.toString());
      setShowModal(false);
      setSelectedListing(null);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Admin Dashboard</h1>
      <button onClick={() => signOut()}>Sign Out</button>
      <p className="mb-4">Welcome to the admin dashboard! Here you can manage all the listings.</p>
      <Table striped bordered hover responsive className="rounded">
        <thead className="thead-dark">
          <tr>
            <th>Photos</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Price (€)</th>
            <th>Mileage (km)</th>
            <th>Year</th>
            <th>Engine</th>
            <th>Transmission</th>
            <th>Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id}>
              <td style={{ width: '300px' }}>
                <Carousel>
                  {listing.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={image}
                        alt={`${listing.brand} ${listing.model}`}
                        className="d-block w-100 rounded"
                        onError={(e) => e.currentTarget.src = '/default-image.png'}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </td>
              <td>{listing.brand}</td>
              <td>{listing.model}</td>
              <td>{listing.price}</td>
              <td>{listing.mileage}</td>
              <td>{listing.year}</td>
              <td>{listing.engine}</td>
              <td>{listing.transmission}</td>
              <td>{listing.color}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => onEdit(listing)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteClick(listing)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the listing for {selectedListing?.brand} {selectedListing?.model}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
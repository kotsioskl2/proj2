import React from "react";
// import styles from './ListingCard.module.css'; // Remove this line
import Link from "next/link";
import Image from "next/image";
import { Card, Button } from "react-bootstrap";
import { useSession } from 'next-auth/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Listing {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  images: string[];
}

interface ListingCardProps {
  listing: Listing;
  onDelete: (id: string) => void;
  onEdit: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onDelete, onEdit }) => {
  const { data: session } = useSession();

  return (
    <Card>
      <div style={{ position: 'relative', height: '200px' }}>
        <Image
          src={listing.images[0] || '/placeholder.jpg'}
          alt={`${listing.brand} ${listing.model}`}
          width={500}
          height={300}
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <Card.Body>
        <Card.Title>{listing.brand} {listing.model}</Card.Title>
        <Card.Text>
          Year: {listing.year}<br />
          Mileage: {listing.mileage.toLocaleString()} km<br />
          Price: €{listing.price.toLocaleString()}
        </Card.Text>
        <Link href={`/listing/${listing.id}`} passHref>
          <Button variant="primary">View Details</Button>
        </Link>
        {session?.user?.role === 'admin' && (
          <>
            <Button variant="warning" onClick={() => onEdit(listing)} className="ms-2">
              <FaEdit /> Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(listing.id)} className="ms-2">
              <FaTrash /> Delete
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ListingCard;

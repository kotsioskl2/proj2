import React from 'react';

interface ListingProps {
    id: number;
    title: string;
    description: string;
    price: number;
}

const Listing: React.FC<ListingProps> = ({ id, title, description, price }) => {
    return (
        <div className="listing">
            <h2>{title}</h2>
            <p>{description}</p>
            <p>Price: ${price}</p>
        </div>
    );
};

export default Listing;
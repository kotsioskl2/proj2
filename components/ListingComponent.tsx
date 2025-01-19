import React from 'react';

interface ListingComponentProps {
    items: string[];
}

const ListingComponent: React.FC<ListingComponentProps> = ({ items }) => {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
};

export default ListingComponent;
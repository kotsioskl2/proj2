export default function Card({ listing }: { listing: any }) {
  return (
    <div className="card">
      <img src={listing.image} alt={listing.title} />
      <div className="content">
        <h3 className="title">{listing.title}</h3>
        <p>Price: €{listing.price}</p>
        <p>Fuel: {listing.fuel}</p>
        <p>Engine Size: {listing.engineSize}</p>
        <p>Mileage: {listing.mileage}</p>
        <p>Transmission: {listing.transmission}</p>
        <p>Color: {listing.color}</p>
        <p>Year: {listing.year}</p>
      </div>
    </div>
  );
}

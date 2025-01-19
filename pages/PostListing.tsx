import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { uploadImage } from '../utils/supabaseUtils';

const carBrands = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Chevrolet", "Nissan", "Volkswagen", "Hyundai", "Mazda", "Subaru", "Kia", "Lexus", "Jaguar", "Land Rover", "Porsche", "Ferrari", "Lamborghini", "Mitsubishi", "Volvo", "Tesla", "Jeep", "Dodge", "Chrysler", "Buick", "Cadillac", "GMC", "Infiniti", "Acura", "Lincoln", "Mini", "Fiat", "Alfa Romeo", "Maserati", "Bentley", "Rolls-Royce", "Aston Martin", "McLaren", "Bugatti"];
const carModels: { [key: string]: string[] } = {
  Toyota: ["Corolla", "Camry", "Prius", "RAV4", "Highlander", "Tacoma", "Tundra", "4Runner", "Avalon", "Sienna"],
  Honda: ["Civic", "Accord", "Fit", "CR-V", "Pilot", "Odyssey", "Ridgeline", "HR-V", "Insight", "Passport"],
  Ford: ["Focus", "Mustang", "F-150", "Escape", "Explorer", "Fusion", "Edge", "Expedition", "Ranger", "Bronco"],
  BMW: ["3 Series", "5 Series", "X5", "X3", "7 Series", "X1", "X6", "Z4", "M3", "M5"],
  Mercedes: ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLA", "GLS", "A-Class", "B-Class", "CLA"],
  Audi: ["A3", "A4", "A6", "Q5", "Q7", "A5", "A7", "Q3", "Q8", "TT"],
  Chevrolet: ["Spark", "Malibu", "Impala", "Equinox", "Tahoe", "Suburban", "Silverado", "Traverse", "Blazer", "Camaro"],
  Nissan: ["Sentra", "Altima", "Maxima", "Rogue", "Murano", "Pathfinder", "Frontier", "Titan", "Versa", "Leaf","X-TRAIL"],
  Volkswagen: ["Golf", "Jetta", "Passat", "Tiguan", "Atlas", "Beetle", "Arteon", "CC", "Touareg", "ID.4"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade", "Kona", "Venue", "Ioniq", "Nexo", "Veloster"],
  Mazda: ["Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9", "MX-5 Miata", "CX-30", "CX-50", "Mazda2", "Mazda5"],
  Subaru: ["Impreza", "Legacy", "Outback", "Forester", "Crosstrek", "Ascent", "BRZ", "WRX", "Baja", "Tribeca"],
  Kia: ["Rio", "Forte", "Optima", "Stinger", "Soul", "Seltos", "Sportage", "Sorento", "Telluride", "Carnival"],
  Lexus: ["IS", "ES", "GS", "LS", "NX", "RX", "GX", "LX", "RC", "LC"],
  Jaguar: ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace", "F-Type", "XK", "S-Type", "X-Type"],
  LandRover: ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Discovery", "Discovery Sport", "Defender", "Freelander", "LR2", "LR4"],
  Porsche: ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Boxster", "Cayman", "918 Spyder", "Carrera GT", "356"],
  Ferrari: ["488", "812 Superfast", "Portofino", "Roma", "SF90 Stradale", "F8 Tributo", "GTC4Lusso", "LaFerrari", "California", "458"],
  Lamborghini: ["Aventador", "Huracan", "Urus", "Gallardo", "Murcielago", "Diablo", "Countach", "Miura", "Reventon", "Veneno"],
  Mitsubishi: ["Mirage", "Lancer", "Outlander", "Eclipse Cross", "Pajero", "ASX", "Triton", "Galant", "Montero", "Starion"],
  Volvo: ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90", "C30", "C70", "S40"],
  Tesla: ["Model S", "Model 3", "Model X", "Model Y", "Roadster", "Cybertruck", "Semi"],
  Jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator", "Patriot", "Liberty", "Commander", "Wagoneer"],
  Dodge: ["Charger", "Challenger", "Durango", "Journey", "Grand Caravan", "Viper", "Dart", "Avenger", "Nitro", "Magnum"],
  Chrysler: ["300", "Pacifica", "Voyager", "Aspen", "Crossfire", "PT Cruiser", "Sebring", "Concorde", "LHS", "Neon"],
  Buick: ["Encore", "Enclave", "Envision", "Regal", "LaCrosse", "Verano", "Lucerne", "Rendezvous", "Rainier", "Park Avenue"],
  Cadillac: ["CT4", "CT5", "CT6", "XT4", "XT5", "XT6", "Escalade", "ATS", "CTS", "SRX"],
  GMC: ["Canyon", "Sierra", "Terrain", "Acadia", "Yukon", "Envoy", "Savana", "Jimmy", "Sonoma", "Typhoon"],
  Infiniti: ["Q50", "Q60", "Q70", "QX50", "QX60", "QX80", "G35", "G37", "FX35", "EX35"],
  Acura: ["ILX", "TLX", "RLX", "RDX", "MDX", "NSX", "TSX", "TL", "RSX", "ZDX"],
  Lincoln: ["MKZ", "MKX", "MKC", "MKT", "Navigator", "Aviator", "Continental", "Corsair", "Town Car", "Zephyr"],
  Mini: ["Cooper", "Countryman", "Clubman", "Paceman", "Convertible", "Roadster", "Coupe", "John Cooper Works", "Electric", "GP"],
  Fiat: ["500", "500X", "500L", "124 Spider", "Panda", "Tipo", "Punto", "Bravo", "Ducato", "Fiorino"],
  AlfaRomeo: ["Giulia", "Stelvio", "4C", "Giulietta", "MiTo", "Spider", "GTV", "Brera", "159", "166"],
  Maserati: ["Ghibli", "Quattroporte", "Levante", "GranTurismo", "GranCabrio", "MC20", "Biturbo", "3200 GT", "Shamal", "Bora"],
  Bentley: ["Continental", "Flying Spur", "Bentayga", "Mulsanne", "Arnage", "Azure", "Brooklands", "Turbo R", "Eight", "T Series"],
  RollsRoyce: ["Phantom", "Ghost", "Wraith", "Dawn", "Cullinan", "Silver Shadow", "Silver Spirit", "Silver Spur", "Corniche", "Camargue"],
  AstonMartin: ["DB11", "Vantage", "DBS", "Rapide", "Vanquish", "DB9", "DB7", "Virage", "Lagonda", "One-77"],
  McLaren: ["570S", "720S", "650S", "P1", "Senna", "GT", "600LT", "675LT", "MP4-12C", "F1"],
  Bugatti: ["Veyron", "Chiron", "Divo", "Centodieci", "La Voiture Noire", "EB110", "Type 35", "Type 41", "Type 57", "Type 101"]
};

const PostListing: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    engine: '',
    engineSize: '',
    mileage: '',
    transmission: '',
    color: '',
    year: '',
    description: '',
    location: '',
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customBrand, setCustomBrand] = useState('');
  const [customModel, setCustomModel] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const imageUrls = await uploadImages(images);

      const { data, error: insertError } = await supabase
        .from('listings')
        .insert([
          {
            ...formData,
            brand: customBrand || formData.brand,
            model: customModel || formData.model,
            price: parseFloat(formData.price),
            engineSize: parseFloat(formData.engineSize),
            mileage: parseInt(formData.mileage),
            year: parseInt(formData.year),
            images: imageUrls,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      console.log("Listing created successfully:", data);
      alert("Listing created successfully!");
      router.push('/');

      // Clear form after successful submission
      setFormData({
        brand: '',
        model: '',
        price: '',
        engine: '',
        engineSize: '',
        mileage: '',
        transmission: '',
        color: '',
        year: '',
        description: '',
        location: '',
      });
      setImages(null);
    } catch (error) {
      console.error("Error creating listing:", error);
      setError(error instanceof Error ? error.message : "Failed to create listing");
      alert("There was an error creating the listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files: FileList | null): Promise<string[]> => {
    if (!files) return [];
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await uploadImage(file);
      urls.push(url);
    }
    return urls;
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, brand: e.target.value, model: '' }));
    setCustomBrand('');
  };

  const handleCustomBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBrand(e.target.value);
    setFormData(prev => ({ ...prev, brand: e.target.value, model: '' }));
  };

  const handleCustomModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomModel(e.target.value);
    setFormData(prev => ({ ...prev, model: e.target.value }));
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">Post a New Car or Bike</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="form-label">Brand</label>
            <select
              name="brand"
              className="form-select"
              value={formData.brand}
              onChange={handleBrandChange}
              required={!customBrand}
              disabled={!!customBrand}
            >
              <option value="">Select Brand</option>
              {carBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter custom brand"
              className="form-control mt-2"
              value={customBrand}
              onChange={handleCustomBrandChange}
              disabled={!!formData.brand}
            />
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Model</label>
            <select
              name="model"
              className="form-select"
              value={formData.model}
              onChange={handleChange}
              required={!customModel}
              disabled={!formData.brand || !!customModel}
            >
              <option value="">Select Model</option>
              {formData.brand && carModels[formData.brand].map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter custom model"
              className="form-control mt-2"
              value={customModel}
              onChange={handleCustomModelChange}
              disabled={!formData.brand}
            />
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Price (€)</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Engine</label>
            <select
              name="engine"
              className="form-select"
              value={formData.engine}
              onChange={handleChange}
              required
            >
              <option value="">Select Engine</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Engine Size (Liters)</label>
            <input
              type="number"
              step="0.1"
              name="engineSize"
              className="form-control"
              value={formData.engineSize}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Mileage (km)</label>
            <input
              type="number"
              name="mileage"
              className="form-control"
              value={formData.mileage}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Transmission</label>
            <select
              name="transmission"
              className="form-select"
              value={formData.transmission}
              onChange={handleChange}
              required
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Color</label>
            <input
              type="text"
              name="color"
              className="form-control"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Year</label>
            <input
              type="number"
              name="year"
              className="form-control"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12 mb-4">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12 mb-4">
            <label className="form-label">Upload Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="form-control" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span>
              <div className="spinner"></div> Uploading...
            </span>
          ) : (
            "Post Listing"
          )}
        </button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </form>
    </div>
  );
};

export default PostListing;
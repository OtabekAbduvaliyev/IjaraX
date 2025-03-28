import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Trash2, 
  Bed, 
  Expand, 
  Bath, 
  MapPin, 
  Sofa, 
  Wifi, 
  Snowflake,
  Shield,
  Refrigerator,
  Waves,
  Tv,
  DoorOpen,
  BedDouble,
  Tv2,
  CheckCircle, // Add this import
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveProperty, unsaveProperty, isPropertySaved } from '../lib/properties';

const amenityIcons = {
  furniture: Sofa,
  wifi: Wifi,
  airConditioning: Snowflake,
  elevator: DoorOpen,
  parking: MapPin,
  refrigerator: Refrigerator,
  washer: Waves,
  dishwasher: Tv,
  security: Shield,
  balkon: BedDouble
};

export default function MinimalistPropertyCard({ property, onUnsave, showUnsaveButton }) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user) return;
      const { isSaved } = await isPropertySaved(user.uid, property.id);
      setIsSaved(isSaved);
    };
    checkSavedStatus();
  }, [user, property.id]);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/auth';
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        const { success } = await unsaveProperty(user.uid, property.id);
        if (success) setIsSaved(false);
      } else {
        const { success } = await saveProperty(user.uid, property.id);
        if (success) setIsSaved(true);
      }
    } catch (error) {
      console.error('Saqlashda xatolik:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAmenityLabel = (key) => {
    const labels = {
      furniture: 'Mebel',
      wifi: 'Wi-Fi',
      airConditioning: 'Konditsioner',
      elevator: 'Lift',
      parking: 'Parking',
      refrigerator: 'Muzlatgich',
      washer: 'Kir yuvish mashinasi',
      dishwasher: 'Idish-tovoq yuvish mashinasi',
      security: 'Xavfsizlik',
      balkon: 'Balkon'
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <Link 
      href={`/properties/${property.id}`} 
      className="group relative flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Save/Unsave Buttons - Moved outside image container */}
      <button
        onClick={handleSaveToggle}
        disabled={isLoading}
        className={`absolute top-0 right-0 p-2 rounded-tr-lg rounded-bl-lg z-10 transition-all bg-white/90 border-l border-b border-gray-200 
          ${isSaved 
            ? 'text-black border-black' 
            : 'text-gray-500 hover:text-black hover:border-black'
          } 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Heart 
          className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} 
          strokeWidth={isSaved ? 0 : 1.5} 
        />
      </button>

      {showUnsaveButton && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onUnsave();
          }}
          className="absolute top-0 right-0 p-2 rounded-tr-lg rounded-bl-lg z-10 bg-white/90 border-l border-b border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-500"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

      {/* Property Image */}
      <div className="relative md:w-1/3 h-38 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover grayscale-[30%] group-hover:scale-105 transition-all duration-300"
        />
      </div>

      {/* Property Details */}
      <div className="md:w-2/3 p-4 space-y-3 border-l border-gray-100 relative">
        {/* Property Name and Price */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <h3 className="property-name text-sm md:text-lg font-semibold text-gray-900 truncate">
              {property.name}
            </h3>
            {property.licenses && (
              <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-[10px] text-green-700 font-medium">
                  Ishonchli
                </span>
              </div>
            )}
          </div>
          <p className="text-base font-bold text-black whitespace-nowrap text-sm md:text-lg">
            {Number(property.price).toLocaleString()} UZS/
            {property.durationType === 'monthly' ? 'oyiga' : 
             property.durationType === 'daily' ? 'kungiga' : 'yilga'}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-700 space-x-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <p className="text-xs truncate">
            {property.location.exactLocation || property.location.city || property.address}
          </p>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-3 text-gray-700">
          <div className="flex items-center space-x-1">
            <Bed className="w-4 h-4 text-gray-500" />
            <span className="text-xs">{property.rooms} xona</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="w-4 h-4 text-gray-500" />
            <span className="text-xs">{property.bathrooms} hammom</span>
          </div>
          <div className="flex items-center space-x-1">
            <Expand className="w-4 h-4 text-gray-500" />
            <span className="text-xs">{property.area} m²</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(amenityIcons)
            .filter(key => property.amenities?.[key])
            .map((key) => {
              const AmenityIcon = amenityIcons[key];
              return (
                <div 
                  key={key} 
                  className="flex items-center space-x-1 bg-gray-100 px-1.5 py-0.5 rounded-sm"
                >
                  {AmenityIcon && <AmenityIcon className="w-3 h-3 text-gray-600" />}
                  <span className="text-[10px] text-gray-700">
                    {getAmenityLabel(key)}
                  </span>
                </div>
              );
          })}
        </div>
      </div>
    </Link>
  );
}
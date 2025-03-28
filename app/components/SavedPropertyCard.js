'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaArrowRight } from 'react-icons/fa';
import DeleteModal from './DeleteModal';

export default function SavedPropertyCard({ property, onUnsave }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function to format location
  const formatLocation = (location) => {
    if (typeof location === 'string') return location;
    if (location && typeof location === 'object' && location.address) return location.address;
    if (location && typeof location === 'object' && location.lat && location.lng) {
      return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
    }
    return 'Manzil ko\'rsatilmagan'; // Location not specified
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onUnsave();
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Link href={`/properties/${property.id}`}>
        <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
          {/* Image Container */}
          <div className="relative h-[240px] w-full overflow-hidden">
            <Image
              src={property.images[0] || '/placeholder.jpg'}
              alt={property.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowDeleteModal(true);
              }}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full 
                         hover:bg-black/10 transition-all duration-300 group/btn"
            >
              <FaHeart className="h-5 w-5 text-black group-hover/btn:scale-110" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Price and Name */}
            <div className="flex justify-between items-center gap-4">
              <h2 className="text-lg font-medium text-gray-800 line-clamp-1 flex-1">
                {property.name}
              </h2>
              <h3 className="text-xl font-semibold text-black whitespace-nowrap">
                {property.price.toLocaleString()} UZS
              </h3>
            </div>

            {/* Type Badge */}
            {/* <div className="flex justify-end">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {property.type}
              </span>
            </div> */}

            {/* Location */}
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm line-clamp-1">
                {property.address}
              </span>
            </div>

            {/* Features */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              <div className="flex items-center text-gray-600">
                <FaBed className="h-4 w-4 mr-2" />
                <span className="text-sm">{property.bedrooms} xona</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaBath className="h-4 w-4 mr-2" />
                <span className="text-sm">{property.bathrooms} hammom</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaRuler className="h-4 w-4 mr-2" />
                <span className="text-sm">{property.area} m²</span>
              </div>
            </div>

            {/* View Details Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/properties/${property.id}`;
                }}
                className="inline-flex items-center gap-2 text-sm text-black hover:text-blue-600 transition-colors"
              >
                Batafsil <FaArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        propertyName={property.name}
        isLoading={isDeleting}
      />
    </>
  );
}

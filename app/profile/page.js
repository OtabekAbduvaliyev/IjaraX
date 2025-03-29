'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { getPropertiesByLandlord } from '../lib/properties';
import { ProtectedRoute } from '../components/RouteProtection';
import PropertyCard from '../components/PropertyCard';
import ChatList from '../components/ChatList';

function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;

      try {
        console.log('Fetching properties for user:', user.uid);
        const { properties: landlordProperties, error } = await getPropertiesByLandlord(user.uid);
        if (error) throw new Error(error);
        console.log('Fetched properties:', landlordProperties);
        setProperties(landlordProperties);
      } catch (err) {
        console.error('Error in profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  const handleCreateProperty = () => {
    router.push('/properties/new');
  };

  const formatLocation = (location) => {
    if (!location) return 'Location not specified';
    if (typeof location === 'string') return location;
    if (location.lng && location.lat) {
      return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
    }
    return 'Invalid location';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 xl:px-[0px] sm:px-6 lg:px-8">
        {}
        <div className="mb-12">
          <div className="flex items-start justify-between border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-2xl font-medium text-gray-900">Mening Profilim</h1>
              <p className="mt-1 text-sm text-gray-500">
                Ko'chmas mulkingizni boshqaring
              </p>
            </div>
            <button
              onClick={handleCreateProperty}
              className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              Yangi E'lon
            </button>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-12">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Jami E'lonlar</div>
            <div className="text-2xl font-medium">{properties.length}</div>
          </div>
        </div>

        {}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Mening E'lonlarim</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-500 mb-4">Hozircha e'lonlar mavjud emas</p>
              <button
                onClick={handleCreateProperty}
                className="text-sm text-black hover:text-gray-600 underline"
              >
                Yangi e'lon qo'shish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div 
                  key={property.id} 
                  className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {property.images?.[0] && (
                      <img
                        src={property.images[0]}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => router.push(`/properties/${property.id}/edit`)}
                        className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
                      >
                        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{property.name}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        {'Faol'}
                      </span>
                    </div>
                    {}
                    <p className="text-sm text-gray-500 mb-3 ">{property.address}</p>                    
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Xonalar: </span>
                        <span className="font-medium">{property.rooms || 'Kiritilmagan'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Maydon: </span>
                        <span className="font-medium">{property.area ? `${property.area} m²` : 'Kiritilmagan'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Turi: </span>
                        <span className="font-medium">{property.propertyType || 'Kiritilmagan'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="font-medium text-lg">{property.price?.toLocaleString()} so'm/oy</span>
                      <button
                        onClick={() => router.push(`/properties/${property.id}/edit`)}
                        className="text-sm text-gray-600 hover:text-black transition-colors"
                      >
                        Tahrirlash →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Chatlar</h2>
          <ChatList userId={user?.uid} />
        </div>
      </div>
    </div>
  );
}

export default function ProtectedProfile() {
  return <Profile />;
}

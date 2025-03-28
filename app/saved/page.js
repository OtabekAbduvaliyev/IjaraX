'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSavedProperties, unsaveProperty } from '../lib/properties';
import SavedPropertyCard from '../components/SavedPropertyCard';

export default function SavedProperties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { properties: savedProperties, error } = await getSavedProperties(user.uid);
        if (error) throw new Error(error);
        setProperties(savedProperties);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, [user]);

  const handleUnsave = async (propertyId) => {
    try {
      const { success, error } = await unsaveProperty(user.uid, propertyId);
      if (error) throw new Error(error);
      if (success) {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
      }
    } catch (err) {
      console.error('Error unsaving property:', err);
      // You might want to show a toast notification here
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-light text-black">Saqlangan mulklarni ko'rish uchun tizimga kiring</h2>
          <a
            href="/auth"
            className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-all"
          >
            Kirish
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-red-600 font-light text-lg">Xatolik: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 font-[Lekton]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0">
        <h1 className="text-4xl font-light text-black mb-12">Saqlangan Mulklar</h1>
        
        {properties.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <h2 className="text-2xl text-gray-600 font-light">Sizning to'plamingiz bo'sh</h2>
            <p className="text-gray-500">Ko'rib chiqing va yoqqan mulklarni saqlang</p>
            <a
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-all"
            >
              Mulklarni Ko'rish
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <SavedPropertyCard
                key={property.id}
                property={property}
                onUnsave={() => handleUnsave(property.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

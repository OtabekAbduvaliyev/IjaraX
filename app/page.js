'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase/config';
import Filters from './components/Filters';
import PropertyCard from './components/PropertyCard';

export default function Hero() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const scrollContainerRef = useRef(null);
  const filterRef = useRef(null);
  const [filterHeight, setFilterHeight] = useState(0);

  useEffect(() => {
    const updateFilterHeight = () => {
      if (filterRef.current && window.innerWidth >= 1024) {
        const height = filterRef.current.offsetHeight;
        setFilterHeight(height);
      }
    };

    // Initial update
    updateFilterHeight();
    
    // Update on filter component changes
    const observer = new MutationObserver(updateFilterHeight);
    if (filterRef.current) {
      observer.observe(filterRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      });
    }

    window.addEventListener('resize', updateFilterHeight);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateFilterHeight);
    };
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      let q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      let querySnapshot = await getDocs(q);
      let filteredProperties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (filters.priceRange && filters.priceRange > 0) {
        const maxPrice = Number(filters.priceRange) * 1000000;
        filteredProperties = filteredProperties.filter(property => Number(property.price) <= maxPrice);
      }

      if (filters.propertyType) {
        filteredProperties = filteredProperties.filter(property => 
          property.propertyType.toLowerCase() === filters.propertyType.toLowerCase()
        );
      }

      if (filters.rentalType) {
        filteredProperties = filteredProperties.filter(property => 
          property.durationType.toLowerCase() === filters.rentalType.toLowerCase()
        );
      }

      if (filters.bedrooms) {
        if (filters.bedrooms === '4+') {
          filteredProperties = filteredProperties.filter(property => Number(property.rooms) >= 4);
        } else {
          filteredProperties = filteredProperties.filter(property => String(property.rooms) === String(filters.bedrooms));
        }
      }

      if (filters.location) {
        filteredProperties = filteredProperties.filter(property => 
          property.place.toLowerCase() === filters.location.toLowerCase()
        );
      }

      setProperties(filteredProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, value]) => value !== '')
    );
    setFilters(cleanFilters);
  };

  return (
    <div className='lekton px-[25px] max-w-md md:max-w-2xl xl:px-[0px] lg:max-w-5xl 2xl:max-w-7xl mx-auto py-[30px] md:py-[50px]'>
      <div className="">
        <h1 className='text-2xl md:text-3xl font-bold'>IjaraX platformasi -</h1>
        <h2 className='text-xl md:text-2xl mt-2'>orqali barcha viloyatlardan o'zingizga mos ijaralarni toping !</h2>
      </div>

      <div className="mt-6 lg:mt-8 flex flex-col lg:flex-row gap-6">
        <div ref={filterRef} className="w-full lg:w-[280px] xl:w-[320px] 2xl:w-[350px] shrink-0">
          <Filters onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-grow relative">
          {loading ? (
            <div className="h-[600px] lg:h-auto flex items-center justify-center" 
                 style={{ height: window.innerWidth >= 1024 ? `${filterHeight}px` : '' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-600"></div>
            </div>
          ) : (
            <div className="relative">
              <div 
                ref={scrollContainerRef}
                className="h-[600px] lg:h-auto overflow-y-auto scrollbar-hide pr-4"
                style={{ height: window.innerWidth >= 1024 ? `${filterHeight}px` : '' }}
              >
                <div className="grid grid-cols-1 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                  {properties.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-zinc-50 rounded-lg">
                      <h3 className="text-lg font-medium text-zinc-900">Mulk topilmadi</h3>
                      <p className="mt-2 text-zinc-500">Filtlarni o'zgartiring</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

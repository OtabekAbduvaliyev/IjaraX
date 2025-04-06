
'use client';


import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase/config';
import Filters from './components/Filters';
import PropertyCard from './components/PropertyCard';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

export default function Hero() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [startIndex, setStartIndex] = useState(0); 

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
      setStartIndex(0);
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

  const nextProperties = () => {
    if (startIndex + 3 < properties.length) {
      setStartIndex(startIndex + 3);
    }
  };

  const prevProperties = () => {
    if (startIndex - 3 >= 0) {
      setStartIndex(startIndex - 3);
    }
  };

  const calculatePageNumbers = () => {
    const totalPages = Math.ceil(properties.length / 3);
    const currentPage = Math.floor(startIndex / 3) + 1;
    return { totalPages, currentPage };
  };

  return (
    <div className='lekton px-[25px] max-w-md md:max-w-2xl xl:px-[0px] lg:max-w-5xl 2xl:max-w-7xl mx-auto md:py-[50px]'>
      <div className="">
        <h1 className='text-2xl md:text-3xl font-bold'>IjaraX platformasi -</h1>
        <h2 className='text-xl md:text-2xl mt-2'>orqali barcha viloyatlardan o'zingizga mos ijaralarni toping !</h2>
      </div>

      <div className="mt-6 lg:mt-8 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[280px] xl:w-[320px] 2xl:w-[350px] shrink-0">
          <Filters onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-600"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="grid grid-cols-1 gap-6">
                {properties.slice(startIndex, startIndex + 3).map((property) => (
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
          )}
        </div>

        <div className="hidden lg:flex flex-col items-center gap-3 justify-center ">
          <button 
            onClick={prevProperties} 
            disabled={startIndex === 0} 
            className={`w-8 h-8 border rounded-lg flex items-center justify-center transition-colors
              ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-50'}`}>
            <IoIosArrowUp className='text-lg' />
          </button>
          
          <div className="text-sm font-medium">
            <div>{calculatePageNumbers().currentPage}</div>
            <div className="text-zinc-400">-</div>
            <div>{calculatePageNumbers().totalPages}</div>
          </div>

          <button 
            onClick={nextProperties} 
            disabled={startIndex + 3 >= properties.length} 
            className={`w-8 h-8 border rounded-lg flex items-center justify-center transition-colors
              ${startIndex + 3 >= properties.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-50'}`}>
            <IoIosArrowDown className='text-lg' />
          </button>
        </div>

        <div className="lg:hidden flex justify-center items-center gap-4 mt-6 ">
          <button 
            onClick={prevProperties} 
            disabled={startIndex === 0} 
            className={`w-[32px] h-[25px] border rounded-[8px] flex justify-center items-center ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <IoIosArrowUp className='text-[18px] rotate-270' />
          </button>
          <div className="text-sm">
            <span>{calculatePageNumbers().currentPage}</span>
            <span className="text-gray-400"> / </span>
            <span>{calculatePageNumbers().totalPages}</span>
          </div>
          <button 
            onClick={nextProperties} 
            disabled={startIndex + 3 >= properties.length} 
            className={`w-[32px] h-[25px] border rounded-[8px] flex justify-center items-center ${startIndex + 3 >= properties.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <IoIosArrowDown className='text-[18px] rotate-270' />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import Filters from '../components/Filters';
import PropertyCard from '../components/PropertyCard';
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
    <div className='max-w-md md:max-w-2xl xl:px-[0px] lg:max-w-5xl 2xl:max-w-7xl mx-auto font-[Lekton] px-[25px] pb-[25px]'>
      <div className="heading pt-[54px]">
        <h1 className='text-[32px] font-bold'>IjaraX platformasi -</h1>
        <h2 className='text-[32px]'>orqali barcha viloyatlardan o'zingizga mos ijaralarni toping !</h2>
      </div>

      <div className="mt-[46px] xl:flex justify-between xl:gap-[40px] 2xl:gap-[50px]">
        <div className="filter-side">
          <Filters onFilterChange={handleFilterChange} />
        </div>
        <div className="propertyside relative mt-[50px] xl:mt-[0px]">
          {loading ? (
            <div className="flex justify-center items-center h-64 mt-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="grid grid-cols-1 gap-6">
                {properties.slice(startIndex, startIndex + 3).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
                {properties.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900">Mulk topilmadi</h3>
                    <p className="mt-2 text-gray-500">Filtlarni o'zgartiring</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden pagination lg:flex flex-col gap-[8px] justify-center">
          <button 
            onClick={prevProperties} 
            disabled={startIndex === 0} 
            className={`w-[25px] h-[32px] border rounded-[8px] flex justify-center items-center ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <IoIosArrowUp className='text-[18px]' />
          </button>
          <div className="text-center text-sm flex flex-col">
            <span>{calculatePageNumbers().currentPage}</span>
            <span className="text-gray-400"> - </span>
            <span>{calculatePageNumbers().totalPages}</span>
          </div>
          <button 
            onClick={nextProperties} 
            disabled={startIndex + 3 >= properties.length} 
            className={`w-[25px] h-[32px] border rounded-[8px] flex justify-center items-center ${startIndex + 3 >= properties.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <IoIosArrowDown className='text-[18px]' />
          </button>
        </div>
        <div className="pagination lg:hidden justify-center mt-[20px] flex flex-row items-center gap-[8px]">
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

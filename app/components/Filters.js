'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Filters({ onFilterChange }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize filters from URL query parameters or defaults
  const [filters, setFilters] = useState({
    priceRange: searchParams.get('price') || '0',
    propertyType: searchParams.get('type') || '',
    rentalType: searchParams.get('rental') || '',
    bedrooms: searchParams.get('beds') || '',
    location: searchParams.get('location') || '',
  });
  
  const [isExpanded, setIsExpanded] = useState(false);

  // Update URL when filters change
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.priceRange && newFilters.priceRange !== '0') {
      params.set('price', newFilters.priceRange);
    }
    if (newFilters.propertyType) {
      params.set('type', newFilters.propertyType);
    }
    if (newFilters.rentalType) {
      params.set('rental', newFilters.rentalType);
    }
    if (newFilters.bedrooms) {
      params.set('beds', newFilters.bedrooms);
    }
    if (newFilters.location) {
      params.set('location', newFilters.location);
    }
    
    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : window.location.pathname;
    
    // Update URL without page reload
    router.push(newURL, { scroll: false });
  };

  // Apply filters from URL on initial load
  useEffect(() => {
    onFilterChange(filters);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Filter change:', name, value);
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateURL(newFilters);
  };

  const handlePriceRangeChange = (e) => {
    const value = e.target.value;
    setFilters(prev => {
      const newFilters = { ...prev, priceRange: value };
      onFilterChange(newFilters);
      updateURL(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const resetFilters = {
      priceRange: '0',
      propertyType: '',
      rentalType: '',
      bedrooms: '',
      location: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    updateURL(resetFilters);
    router.push(window.location.pathname);
  };

  return (
    <div className="w-full lg:max-w-[350px] bg-white rounded-lg border border-zinc-200 shadow-sm">
      {/* Mobile Toggle Header - Only visible on mobile */}
      <div 
        className="p-3 flex items-center justify-between cursor-pointer lg:hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-medium text-zinc-800">Filtrlash</h3>
        <span className="text-zinc-500">
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          )}
        </span>
      </div>

      {/* Filter Content - Always visible on desktop, toggleable on mobile */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        {/* Keeping the exact desktop layout and padding */}
        <div className="p-4 md:p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">
                Narx oralig'i
              </label>
              <span className="text-xs font-medium bg-zinc-100 text-zinc-900 px-2 py-1 rounded-md">
                {filters.priceRange} MLN
              </span>
            </div>
            
            <input
              type="range"
              name="priceRange"
              min="0"
              max="520"
              value={filters.priceRange}
              onChange={handlePriceRangeChange}
              className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-800 hover:accent-zinc-700"
            />
            <div className="flex justify-between">
              <span className="text-xs text-zinc-500">0</span>
              <span className="text-xs text-zinc-500">520</span>
            </div>
          </div>

          {/* Original selects with exact same layout */}
          {['propertyType', 'rentalType', 'bedrooms', 'location'].map((field) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                {field === 'propertyType' && "Mulk turi"}
                {field === 'rentalType' && "To'lov turi"}
                {field === 'bedrooms' && "Xonalar soni"}
                {field === 'location' && "Joylashuv"}
              </label>
              <select
                name={field}
                value={filters[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md shadow-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors hover:border-zinc-300"
              >
                <option value="">
                  {field === 'propertyType' && "Mulk turini tanlang"}
                  {field === 'rentalType' && "To'lov turini tanlang"}
                  {field === 'bedrooms' && "Xonalar soni tanlang"}
                  {field === 'location' && "Joylashuv tanlang"}
                </option>
                {field === 'propertyType' && (
                  <>
                    <option value="apartment">Kvartira</option>
                    <option value="house">Uy</option>
                    <option value="villa">Villa</option>
                    <option value="room">Xona</option>
                  </>
                )}
                {field === 'rentalType' && (
                  <>
                    <option value="daily">Kunlik</option>
                    <option value="monthly">Oylik</option>
                    <option value="yearly">Yillik</option>
                  </>
                )}
                {field === 'bedrooms' && (
                  <>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </>
                )}
                {field === 'location' && (
                  <>
                    <option value="tashkent">Toshkent</option>
                    <option value="samarkand">Samarqand</option>
                    <option value="bukhara">Buxoro</option>
                    <option value="andijan">Andijon</option>
                  </>
                )}
              </select>
            </div>
          ))}
          
          {/* Mobile Actions */}
          <div className="flex flex-col gap-2 lg:hidden">
            <button 
              className="w-full py-2 bg-zinc-800 text-white text-sm font-medium rounded-md hover:bg-zinc-700"
              onClick={() => setIsExpanded(false)}
            >
              Qo'llash
            </button>
            <button 
              className="w-full py-2 bg-white text-zinc-800 text-sm font-medium border border-zinc-300 rounded-md hover:bg-zinc-50"
              onClick={clearFilters}
            >
              Bekor qilish
            </button>
          </div>
          
          {/* Desktop Clear Button */}
          <div className="hidden lg:block">
            <button 
              className="w-full py-2 bg-white text-zinc-800 text-sm font-medium border border-zinc-300 rounded-md hover:bg-zinc-50"
              onClick={clearFilters}
            >
              Barcha filtrlarni o'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
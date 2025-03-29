'use client';

import { useState } from 'react';

export default function Filters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    priceRange: 0,
    propertyType: '',
    rentalType: '',
    bedrooms: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Filter change:', name, value);
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (e) => {
    const value = e.target.value;
    setFilters(prev => {
      const newFilters = { ...prev, priceRange: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  return (
    <div className="w-full lg:max-w-[350px] bg-white rounded-lg border border-zinc-200 shadow-sm">
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
      </div>
    </div>
  );
}
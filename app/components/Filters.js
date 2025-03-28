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
    <div className="border-1 rounded-[15px] py-[25px] px-[20px] max-w-[100%px] xl:w-[320px] 2xl:w-[350px]">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[24px] ">
              Narx oralig'i:
            </label>
            <span className="text-sm font-bold border rounded-[5px] py-[1px] px-[18px] ">
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
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[#171717] mt-1">
            <span>0</span>
            <span>520</span>
          </div>
        </div>

        <div>
          <label className="block text-[20px] font-medium text-[#171717] mb-2">
            Mulk turi:
          </label>
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            className="block w-full rounded-[10px] border  focus:border-blue-500 focus:black py-1 px-[15px]"
          >
            <option value="">Mulk turini tanlang</option>
            <option value="apartment">Kvartira</option>
            <option value="house">Uy</option>
            <option value="villa">Villa</option>
            <option value="room">Xona</option>
          </select>
        </div>

        <div>
          <label className="block text-[20px] font-medium text-[#171717] mb-2">
            To'lov turi:
          </label>
          <select
            name="rentalType"
            value={filters.rentalType}
            onChange={handleChange}
            className="block w-full rounded-[10px] border  focus:border-blue-500 focus:black py-1 px-[15px]"
          >
            <option value="">To'lov turini tanlang</option>
            <option value="daily">Kunlik</option>
            <option value="monthly">Oylik</option>
            <option value="yearly">Yillik</option>
          </select>
        </div>

        <div>
          <label className="block text-[20px] font-medium text-[#171717] mb-2">
            Xonalar soni:
          </label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="block w-full rounded-[10px] border  focus:border-blue-500 focus:black py-1 px-[15px]"
          >
            <option value="">Xonalar soni tanlang</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4+">4+</option>
          </select>
        </div>

        <div>
          <label className="block text-[20px] font-medium text-[#171717] mb-2">
            Joylashuv:
          </label>
          <select
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="block w-full rounded-[10px] border  focus:border-blue-500 focus:black py-1 px-[15px]"
          >
            <option value="">Joylashuv tanlang</option>
            <option value="tashkent">Toshkent</option>
            <option value="samarkand">Samarqand</option>
            <option value="bukhara">Buxoro</option>
            <option value="andijan">Andijon</option>
          </select>
        </div>
      </div>
    </div>
  );
}
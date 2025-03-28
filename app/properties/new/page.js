'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ProtectedRoute } from '../../components/RouteProtection';
import { createProperty } from '../../lib/properties';
import { useAuth } from '../../context/AuthContext';
import { Plus, X, FileText, FileImage } from 'lucide-react';

// Dynamically import LocationMap to avoid SSR issues
const LocationMap = dynamic(
  () => import('../../components/LocationMap'),
  { ssr: false }
);

const cities = [
  'Toshkent', 'Namangan', 'Andijon', 'Farg\'ona', 'Jizzax', 
  'Samarqand', 'Buxoro', 'Navoiy', 'Qarshi', 'Nukus', 
  'Urganch', 'Termiz'
];

const cityCoordinates = {
  'Toshkent': { lat: 41.2995, lng: 69.2401 },
  'Namangan': { lat: 41.0011, lng: 71.6673 },
  'Andijon': { lat: 40.7829, lng: 72.3442 },
  'Farg\'ona': { lat: 40.3834, lng: 71.7870 },
  'Jizzax': { lat: 40.1158, lng: 67.8422 },
  'Samarqand': { lat: 39.6270, lng: 66.9750 },
  'Buxoro': { lat: 39.7680, lng: 64.4210 },
  'Navoiy': { lat: 40.0984, lng: 65.3791 },
  'Qarshi': { lat: 38.8600, lng: 65.7900 },
  'Nukus': { lat: 42.4600, lng: 59.6200 },
  'Urganch': { lat: 41.5500, lng: 60.6333 },
  'Termiz': { lat: 37.2242, lng: 67.2783 }
};

export default function CreatePropertyForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(cityCoordinates['Toshkent']);
  const [address, setAddress] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    place: 'Toshkent',
    rooms: '',
    bathrooms: '',
    area: '',
    durationType: 'monthly',
    propertyType: 'apartment',
    price: '',
    description: '',
    phoneNumber: '',
    telegramAccount: '',
    amenities: {
      wifi: false,
      airConditioning: false,
      parking: false,
      balcony: false,
      elevator: false,
      furniture: false,
      refrigerator: false,
      washer: false,
      dishwasher: false,
      security: false
    }
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [previewLicenses, setPreviewLicenses] = useState([]);

  const onImagesDropped = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.filter(file => 
      !images.some(existingFile => existingFile.name === file.name)
    );

    setImages(prev => [...prev, ...newFiles]);
    const newPreviews = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  }, [images]);

  const onLicensesDropped = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.filter(file => 
      !licenses.some(existingFile => existingFile.name === file.name)
    );

    setLicenses(prev => [...prev, ...newFiles]);
    const newPreviews = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPreviewLicenses(prev => [...prev, ...newPreviews]);
  }, [licenses]);

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeLicense = (index) => {
    setLicenses(prev => prev.filter((_, i) => i !== index));
    setPreviewLicenses(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: onImagesDropped,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10
  });

  const { getRootProps: getLicenseRootProps, getInputProps: getLicenseInputProps } = useDropzone({
    onDrop: onLicensesDropped,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('amenities.')) {
      const amenityName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [amenityName]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleLocationSelect = ({ lat, lng, address }) => {
    setLocation({ lat, lng });
    setAddress(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      setError('Iltimos, kamida bitta mulk rasmi yuklang');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const propertyData = {
        ...formData,
        landlordId: user.uid,
        location: {
          lat: location.lat,
          lng: location.lng
        },
        address
      };

      const { success, propertyId, error } = await createProperty(
        propertyData,
        images,
        licenses
      );

      if (error) throw new Error(error);

      if (success) {
        router.push('/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-[25px] xl:px-0 py-8 font-[Lekton]">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 ">
          Mulk E'lonini Yaratish
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Property Information */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mulk Nomi
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mulk nomini kiriting"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Shahar
              </label>
              <select
                name="place"
                value={formData.place}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mulk Turi
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="apartment">Kvartira</option>
                <option value="house">Uy</option>
                <option value="villa">Villa</option>
                <option value="room">Xona</option>
              </select>
            </div>
          </div>

          {/* Detailed Property Information */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Xonalar Soni
              </label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Xonalar soni"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Hammom Soni
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hammomlar soni"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Maydon (m²)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Umumiy maydon"
              />
            </div>
          </div>

          {/* Rental Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Ijara Muddati
              </label>
              <select
                name="durationType"
                value={formData.durationType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Oylik</option>
                <option value="daily">Kunlik</option>
                <option value="yearly">Yillik</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Narx (UZS)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ijara narxi"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Mulk Tavsifi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mulk haqida batafsil ma'lumot"
            />
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Qulayliklar
            </h3>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.keys(formData.amenities).map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`amenities.${amenity}`}
                    checked={formData.amenities[amenity]}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    {amenity === 'wifi' ? 'Wi-Fi' :
                     amenity === 'airConditioning' ? 'Konditsioner' :
                     amenity === 'parking' ? 'Parking' :
                     amenity === 'balcony' ? 'Balkon' :
                     amenity === 'elevator' ? 'Lift' :
                     amenity === 'furniture' ? 'Mebel' :
                     amenity === 'refrigerator' ? 'Muzlatgich' :
                     amenity === 'washer' ? 'Kir yuvish mashinasi' :
                     amenity === 'dishwasher' ? 'Idish-tovoq yuvish mashinasi' :
                     amenity === 'security' ? 'Xavfsizlik' : amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Joylashuv
            </h3>
            <div className="h-96 w-full border rounded-md overflow-hidden">
              <LocationMap
                center={location}
                zoom={13}
                marker={location}
                onLocationSelect={handleLocationSelect}
              />
            </div>
            {address && (
              <p className="mt-2 text-sm text-gray-500">
                Tanlangan manzil: {address}
              </p>
            )}
          </div>

          {/* Images Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mulk Rasmlari
            </h3>
            <div 
              {...getImageRootProps()} 
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <input {...getImageInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Plus className="h-10 w-10 text-gray-400" />
                <p className="text-gray-600">
                  Rasmlarni torting yoki tanlash uchun bosing
                </p>
                <em className="text-xs text-gray-500">
                  (Eng ko'pi bilan 10 rasm, .jpg, .png, .webp)
                </em>
              </div>
            </div>

            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={preview.preview} className="relative group">
                    <Image
                      src={preview.preview}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Licenses Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hujjatlar va Litsenziyalar
            </h3>
            <div 
              {...getLicenseRootProps()} 
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <input {...getLicenseInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Plus className="h-10 w-10 text-gray-400" />
                <p className="text-gray-600">
                  Hujjatlarni torting yoki tanlash uchun bosing
                </p>
                <em className="text-xs text-gray-500">
                  (Eng ko'pi bilan 5 PDF yoki rasm)
                </em>
              </div>
            </div>

            {previewLicenses.length > 0 && (
              <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-4">
                {previewLicenses.map((preview, index) => (
                  <div key={preview.preview} className="relative group">
                    {preview.file.type === 'application/pdf' ? (
                      <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                        <FileText className="h-12 w-12 text-red-500" />
                      </div>
                    ) : (
                      <Image
                        src={preview.preview}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeLicense(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Raqam
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="+998 90 123 4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telegram Foydalanuvchi Nomi
              </label>
              <input
                type="text"
                name="telegramAccount"
                value={formData.telegramAccount}
                onChange={handleInputChange}
                required
                placeholder="@username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-center text-sm mt-4">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="text-start md:text-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#171717] text-white rounded-md hover:bg-[#181818] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Mulk yaratilmoqda...' : 'Mulk E\'lonini Yaratish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
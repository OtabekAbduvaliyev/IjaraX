'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useAuth } from '../../../context/AuthContext';
import { getPropertyById, updateProperty, deleteProperty } from '../../../lib/properties';
import { Plus, X, FileText } from 'lucide-react';
import DeleteModal from '@/app/components/DeleteModal';

// Import map component dynamically to avoid SSR issues
const LocationMap = dynamic(
  () => import('../../../components/LocationMap'),
  { ssr: false }
);

// Add these constants at the top of the file
const cities = [
  'Tashkent',
  'Namangan',
  'Andijan',
  'Fergana',
  'Jizzakh',
  'Samarkand',
  'Bukhara',
  'Navoiy',
  'Qarshi',
  'Nukus',
  'Urgench',
  'Termez'
];

const cityCoordinates = {
  'Tashkent': { lat: 41.2995, lng: 69.2401 },
  'Namangan': { lat: 41.0011, lng: 71.6673 },
  'Andijan': { lat: 40.7829, lng: 72.3442 },
  'Fergana': { lat: 40.3834, lng: 71.7870 },
  'Jizzakh': { lat: 40.1158, lng: 67.8422 },
  'Samarkand': { lat: 39.6270, lng: 66.9750 },
  'Bukhara': { lat: 39.7680, lng: 64.4210 },
  'Navoiy': { lat: 40.0984, lng: 65.3791 },
  'Qarshi': { lat: 38.8600, lng: 65.7900 },
  'Nukus': { lat: 42.4600, lng: 59.6200 },
  'Urgench': { lat: 41.5500, lng: 60.6333 },
  'Termez': { lat: 37.2242, lng: 67.2783 }
};



function EditProperty() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [location, setLocation] = useState({ lat: 41.2995, lng: 69.2401 });
  const [address, setAddress] = useState('');

  // Image states
  const [images, setImages] = useState([]);
  const [licenseImages, setLicenseImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewLicenseImages, setPreviewLicenseImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [removedLicenseImages, setRemovedLicenseImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingLicenseImages, setExistingLicenseImages] = useState([]);

  // Update formData to match create page amenities
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
      wifi: false,          // Wi-Fi
      airConditioning: false, // Konditsioner
      parking: false,       // Parking
      balcony: false,      // Balkon
      elevator: false,      // Lift
      furniture: false,     // Mebel
      refrigerator: false,  // Muzlatgich
      washer: false,       // Kir yuvish mashinasi
      dishwasher: false,   // Idish-tovoq yuvish mashinasi
      security: false      // Xavfsizlik
    }
  });

  // Dropzone setup
  const onImagesDropped = useCallback((acceptedFiles) => {
    setImages(prev => [...prev, ...acceptedFiles]);
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  }, []);

  const onLicenseImagesDropped = useCallback((acceptedFiles) => {
    setLicenseImages(prev => [...prev, ...acceptedFiles]);
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPreviewLicenseImages(prev => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: onImagesDropped
  });

  const { getRootProps: getLicenseRootProps, getInputProps: getLicenseInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: onLicenseImagesDropped
  });

  // Remove image handlers
  const removeExistingImage = (url, isLicense = false) => {
    if (isLicense) {
      setExistingLicenseImages(prev => prev.filter(img => img !== url));
      setRemovedLicenseImages(prev => [...prev, url]);
    } else {
      setExistingImages(prev => prev.filter(img => img !== url));
      setRemovedImages(prev => [...prev, url]);
    }
  };

  const removeNewImage = (index, isLicense = false) => {
    if (isLicense) {
      setLicenseImages(prev => prev.filter((_, i) => i !== index));
      setPreviewLicenseImages(prev => {
        URL.revokeObjectURL(prev[index].preview);
        return prev.filter((_, i) => i !== index);
      });
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
      setPreviewImages(prev => {
        URL.revokeObjectURL(prev[index].preview);
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  // Load property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyId = params?.id;
        if (!propertyId) {
          throw new Error('Property ID not found');
        }

        const { property, error } = await getPropertyById(propertyId);
        if (error) throw new Error(error);

        if (property.landlordId !== user?.uid) {
          router.push('/profile');
          return;
        }

        setFormData({
          ...property,
          amenities: property.amenities || formData.amenities
        });
        setLocation(property.location);
        setAddress(property.address || '');
        setExistingImages(property.images || []);
        setExistingLicenseImages(property.licenseImages || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchProperty();
    }
  }, [params, user, router]);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach(preview => URL.revokeObjectURL(preview.preview));
      previewLicenseImages.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const propertyId = params?.id;
      if (!propertyId) {
        throw new Error('Property ID not found');
      }

      const propertyData = {
        ...formData,
        landlordId: user.uid,
        location,
        address
      };

      const { success, error } = await updateProperty(
        propertyId,
        propertyData,
        images,
        licenseImages,
        removedImages,
        removedLicenseImages
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

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const propertyId = params?.id;
      if (!propertyId) {
        throw new Error('Property ID not found');
      }

      const { success, error } = await deleteProperty(propertyId);
      if (error) throw new Error(error);

      if (success) {
        router.push('/profile');
      }
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLocationSelect = ({ lat, lng, address }) => {
    setLocation({ lat, lng });
    setAddress(address);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        propertyName={'Mulk'}
        isLoading={deleteLoading}
      />
      <div className="w-full max-w-7xl mx-auto px-[25px] xl:px-0 py-8 font-[Lekton]">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Mulk E'lonini Tahrirlash
            </h1>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-[#171717] text-white rounded-md hover:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              O'chirish
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
              {error}
            </div>
          )}

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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mulk nomini kiriting"
                />
              </div>

              <div>
                <label htmlFor="place" className="block text-sm font-bold text-gray-700 mb-2">
                  Shahar
                </label>
                <select
                  id="place"
                  value={formData.place}
                  onChange={(e) => {
                    setFormData({ ...formData, place: e.target.value });
                    setLocation(cityCoordinates[e.target.value]);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-bold text-gray-700 mb-2">
                  Mulk Turi
                </label>
                <select
                  id="propertyType"
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="apartment">Kvartira</option>
                  <option value="house">Uy</option>
                  <option value="villa">Villa</option>
                  <option value="office">Ofis</option>
                </select>
              </div>

              <div>
                <label htmlFor="durationType" className="block text-sm font-bold text-gray-700 mb-2">
                  Ijaraga Berish Davri
                </label>
                <select
                  id="durationType"
                  value={formData.durationType}
                  onChange={(e) => setFormData({ ...formData, durationType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="daily">Kunlik</option>
                  <option value="monthly">Oylik</option>
                  <option value="yearly">Yillik</option>
                </select>
              </div>

              <div>
                <label htmlFor="rooms" className="block text-sm font-bold text-gray-700 mb-2">
                  Xonalar Soni
                </label>
                <input
                  type="number"
                  id="rooms"
                  value={formData.rooms}
                  onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-bold text-gray-700 mb-2">
                  Hammomlar Soni
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-bold text-gray-700 mb-2">
                  Maydon (m²)
                </label>
                <input
                  type="number"
                  id="area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">
                  Narx (UZS)
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Detailed Property Information */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 mb-2">
                  Telefon Raqami
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="telegramAccount" className="block text-sm font-bold text-gray-700 mb-2">
                  Telegram Hisobi
                </label>
                <input
                  type="text"
                  id="telegramAccount"
                  value={formData.telegramAccount}
                  onChange={(e) => setFormData({ ...formData, telegramAccount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Rental Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                  Mulk Tavsifi
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Qulayliklar
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.amenities).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={key}
                      checked={value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={key} className="ml-2 block text-sm text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
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
                {...getImagesRootProps()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <input {...getImagesInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Plus className="h-10 w-10 text-gray-400" />
                  <p className="text-gray-600">
                    Yangi rasmlarni torting yoki tanlash uchun bosing
                  </p>
                  <em className="text-xs text-gray-500">
                    (.jpg, .png, .webp)
                  </em>
                </div>
              </div>

              {existingImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Mavjud Rasmlar</h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {existingImages.map((url, index) => (
                      <div key={url} className="relative group">
                        <Image
                          src={url}
                          alt={`Mulk rasmi ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full aspect-square object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Yangi Rasmlar</h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={preview.preview} className="relative group">
                        <Image
                          src={preview.preview}
                          alt={`Yangi rasm ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full aspect-square object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* License Images Upload */}
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
                    Yangi hujjatlarni torting yoki tanlash uchun bosing
                  </p>
                  <em className="text-xs text-gray-500">
                    (PDF yoki rasm)
                  </em>
                </div>
              </div>

              {existingLicenseImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Mavjud Hujjatlar</h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {existingLicenseImages.map((url, index) => (
                      <div key={url} className="relative group">
                        <Image
                          src={url}
                          alt={`Hujjat ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full aspect-square object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url, true)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewLicenseImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Yangi Hujjatlar</h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {previewLicenseImages.map((preview, index) => (
                      <div key={preview.preview} className="relative group">
                        <Image
                          src={preview.preview}
                          alt={`Yangi hujjat ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full aspect-square object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index, true)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 mb-2">
                  Telefon Raqami
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="telegramAccount" className="block text-sm font-bold text-gray-700 mb-2">
                  Telegram Hisobi
                </label>
                <input
                  type="text"
                  id="telegramAccount"
                  value={formData.telegramAccount}
                  onChange={(e) => setFormData({ ...formData, telegramAccount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-start md:text-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#171717] text-white rounded-md hover:bg-[#181818] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {loading ? "O'zgarishlar saqlanmoqda..." : "O'zgarishlarni Saqlash"}
              </button>
            </div>
          </form>

          {/* <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            loading={deleteLoading}
          /> */}
        </div>
      </div>

    </div>
  );
}

export default function ProtectedEditProperty() {
  return <EditProperty />;
}

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useAuth } from '../../context/AuthContext';
import { getPropertyById } from '../../lib/properties';
import ImageModal from '../../components/ImageModal';
import { X, FileText } from 'lucide-react';
const LocationMap = dynamic(
  () => import('../../components/LocationMap'),
  { ssr: false }
);

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState('property');
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { property: propertyData, error } = await getPropertyById(id);
        if (error) throw new Error(error);
        setProperty(propertyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-[Lekton]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-[Lekton]">
        <div className="text-red-600">Xatolik: {error}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center font-[Lekton]">
        <div className="text-gray-600">Mulk topilmadi</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-[Lekton]">
      {}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.name}</h1>
            <p className="text-gray-600 mt-2">{property.location.exactLocation || property.location.city}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-black">
              {Number(property.price).toLocaleString()} UZS
            </div>
            <div className="text-gray-500 mt-1">
              {property.durationType === 'monthly' ? 'Oylik' : 
               property.durationType === 'daily' ? 'Kunlik' : 'Yillik'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 space-y-6">
          {}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-4">
              {selectedImageType === 'property' && property.images && property.images.length > 0 && (
                <Image
                  src={property.images[activeImage]}
                  alt={`${property.name} - Rasm ${activeImage + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1536px) 100vw, 1536px"
                  priority
                />
              )}
              {selectedImageType === 'license' && property.licenseImages && property.licenseImages.length > 0 && (
                <Image
                  src={property.licenseImages[activeImage]}
                  alt={`Hujjat ${activeImage + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1536px) 100vw, 1536px"
                  priority
                />
              )}
              
              {}
              {((selectedImageType === 'property' && property.images?.length > 1) ||
                (selectedImageType === 'license' && property.licenseImages?.length > 1)) && (
                <>
                  <button
                    onClick={() => {
                      const images = selectedImageType === 'property' ? property.images : property.licenseImages;
                      setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      const images = selectedImageType === 'property' ? property.images : property.licenseImages;
                      setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {}
            <div className="flex gap-3 mb-4">
              <button
                className="px-4 py-2 rounded-xl font-medium transition-colors bg-black text-white"
              >
                Mulk Rasmlari
              </button>
            </div>

            {}
            {property?.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
                      activeImage === index ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${property.name} - Rasm ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mulk Tavsifi
            </h2>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>

          {}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Joylashuv
            </h2>
            <div className="h-[300px] w-full rounded-xl overflow-hidden mb-3">
              <LocationMap
                center={{ lat: property.location.lat, lng: property.location.lng }}
                marker={{ lat: property.location.lat, lng: property.location.lng }}
                zoom={15}
              />
            </div>
            <p className="text-sm text-gray-500">
              {property.location.exactLocation || property.location.city}
            </p>
          </div>
        </div>

        {}
        <div className="space-y-6">
          {}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mulk Tafsilotlari
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-600">Mulk Turi</div>
                  <div className="font-medium">
                    {property.propertyType === 'apartment' ? 'Kvartira' :
                     property.propertyType === 'house' ? 'Uy' :
                     property.propertyType === 'villa' ? 'Villa' :
                     property.propertyType === 'room' ? 'Xona' : property.propertyType}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Xonalar Soni</div>
                  <div className="font-medium">{property.rooms}</div>
                </div>
                <div>
                  <div className="text-gray-600">Hammomlar Soni</div>
                  <div className="font-medium">{property.bathrooms}</div>
                </div>
                <div>
                  <div className="text-gray-600">Ijara Muddati</div>
                  <div className="font-medium">
                    {property.durationType === 'monthly' ? 'Oylik' : 
                     property.durationType === 'daily' ? 'Kunlik' : 
                     'Yillik'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Qulayliklar
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(property.amenities).map(([key, value]) => 
                value && (
                  <div key={key} className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <svg className="w-5 h-5 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {key === 'wifi' ? 'Wi-Fi' :
                     key === 'airConditioning' ? 'Konditsioner' :
                     key === 'parking' ? 'Parking' :
                     key === 'balcony' ? 'Balkon' :
                     key === 'elevator' ? 'Lift' :
                     key === 'furniture' ? 'Mebel' :
                     key === 'refrigerator' ? 'Muzlatgich' :
                     key === 'washer' ? 'Kir yuvish mashinasi' :
                     key === 'dishwasher' ? 'Idish-tovoq yuvish mashinasi' :
                     key === 'security' ? 'Xavfsizlik' : key}
                  </div>
                )
              )}
            </div>
          </div>

          {}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {user ? (
              <div>
                {showContact ? (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Aloqa Ma'lumotlari
                    </h2>
                    <div className="space-y-3">
                      {property.phoneNumber && (
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${property.phoneNumber}`} className="text-black hover:underline">
                            {property.phoneNumber}
                          </a>
                        </div>
                      )}
                      {property.telegramAccount && (
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.98 1.26-5.61 3.71-.53.36-1.01.54-1.44.53-.47-.01-1.38-.26-2.06-.48-.83-.27-1.49-.42-1.43-.89.03-.24.37-.49 1.02-.74 4.01-1.74 6.69-2.89 8.04-3.45 3.82-1.59 4.61-1.87 5.13-1.88.12 0 .37.03.54.18.14.12.18.28.2.45-.02.14-.02.3-.02.43z"/>
                          </svg>
                          <a 
                            href={`https://t.me/${property.telegramAccount.replace('@', '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-black hover:underline"
                          >
                            {property.telegramAccount}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowContact(true)}
                    className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors"
                  >
                    Aloqa Ma'lumotlarini Ko'rsatish
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Aloqa ma'lumotlarini ko'rish uchun tizimga kiring</p>
                <a
                  href="/auth"
                  className="inline-block bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors"
                >
                  Tizimga Kirish
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      {property.licenseImages && property.licenseImages.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Hujjatlar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {property.licenseImages.map((image, index) => (
              <div key={image} className="relative group">
                {image.toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-16 w-16 text-black" />
                  </div>
                ) : (
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={image}
                      alt={`Hujjat ${index + 1}`}
                      fill
                      className="object-cover rounded-lg transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                )}
                <button
                  onClick={() => setModalImage(image)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="bg-white/80 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    To'liq Ko'rish
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {modalImage && (
        <ImageModal
          image={modalImage}
          onClose={() => setModalImage(null)}
        />
      )}
    </div>
  );
}
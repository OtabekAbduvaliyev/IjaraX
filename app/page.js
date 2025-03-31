'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push('/all');
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push('/')}>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">IjaraX</h1>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-4">
              {!user ? (
                <>
                  <button
                    onClick={() => router.push('/auth')}
                    className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Kirish
                  </button>
                  <button
                    onClick={() => router.push('/auth')}
                    className="text-sm font-medium px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
                  >
                    Ro'yxatdan o'tish
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-950 shadow-lg border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 py-4 space-y-4">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      router.push('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Kirish
                  </button>
                  <button
                    onClick={() => {
                      router.push('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Ro'yxatdan o'tish
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    router.push('/profile');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-1/4 right-1/4 top-1/3 -z-10 h-60 sm:h-80 md:h-96 w-full rounded-full bg-gray-100 dark:bg-gray-800/20 opacity-20 blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center justify-center px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 mr-1.5 sm:mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-black dark:bg-white"></span>
                </span>
                <span className="text-xs sm:text-sm">O'zbekistondagi eng yirik ijara platformasi</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight px-2">
                Uyni ijaraga olish va berish
                <span className="relative block mt-2">
                  <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute left-0 top-2/3 h-[0.58em] w-full fill-gray-300/40 dark:fill-gray-600/40" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
                  <span className="relative text-black dark:text-white">oson yechim</span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
                Istalgan hududdagi uylarni real vaqtda ko'ring, mulk egasi bilan 
                to'g'ridan-to'g'ri bog'laning va shartnoma tuzing
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mt-6 sm:mt-8 px-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-700 dark:to-gray-900 rounded-lg opacity-30 blur transition duration-300 group-hover:opacity-100"></div>
                  <div className="relative flex flex-col sm:flex-row items-center gap-2 bg-white dark:bg-gray-900 p-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
                    <input
                      type="text"
                      placeholder="Manzil, hudud yoki metro bekati"
                      className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-md bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 mt-2 sm:mt-0 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all font-medium"
                    >
                      Qidirish
                    </button>
                  </div>
                </div>
              </form>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 w-full max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">10,000+</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Faol e'lonlar</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">500+</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Kunlik yangi e'lonlar</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">5,000+</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Muvaffaqiyatli shartnomalar</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Qo'llab-quvvatlash</div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 w-full max-w-4xl mx-auto px-4">
                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black dark:text-white mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Ishonchli mulk egalari</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Barcha e'lonlar tekshirilgan va tasdiqlangan mulk egalaridan</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black dark:text-white mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Tez va oson</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bir necha daqiqada kerakli uyni toping va bog'laning</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 sm:col-span-2 md:col-span-1">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black dark:text-white mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Barcha hududlar</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">O'zbekistonning barcha viloyatlari va shaharlari bo'yicha e'lonlar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Mijozlarimiz fikri</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Platformamizdan foydalangan mijozlarimiz tajribasi
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="ml-3 sm:ml-4">
                  <h4 className="text-sm sm:text-base font-medium">Aziz Karimov</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">"Juda qulay platforma, tez va oson uy topdim. Mulk egasi bilan to'g'ridan-to'g'ri bog'lanish imkoniyati juda yaxshi."</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="ml-3 sm:ml-4">
                  <h4 className="text-sm sm:text-base font-medium">Dilnoza Aliyeva</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">"Uyimni ijaraga berish juda oson bo'ldi. Ko'p talabgorlar orasidan eng yaxshisini tanladim. Rahmat!"</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 sm:col-span-2 md:col-span-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="ml-3 sm:ml-4">
                  <h4 className="text-sm sm:text-base font-medium">Bobur Mamadaliyev</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">"Boshqa platformalardan farqli o'laroq, bu yerda haqiqiy e'lonlar. Vaqtim behuda ketmadi. Tavsiya qilaman!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black dark:bg-gray-800 text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Uyingizni ijaraga bermoqchimisiz?</h2>
              <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
                Bizning platformada e'loningizni joylashtiring va minglab potensial mijozlarga yeting. Tez, oson va ishonchli!
              </p>
              <button
                onClick={() => router.push('/add-listing')}
                className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-all font-medium text-sm sm:text-base"
              >
                E'lon joylashtirish
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
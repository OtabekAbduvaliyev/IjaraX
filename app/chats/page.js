'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatList from '../components/ChatList';
import { Link } from 'lucide-react';

export default function ChatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth');
  //   }
  // }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-[70vh] p-6">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-800">Tizimga kiring</h1>
          <p className="text-gray-600">Chat xizmatidan foydalanish uchun tizimga kirishingiz kerak</p>
        </div>
        <button 
          onClick={() => router.push('/auth')}
          className="px-6 py-3 bg-black text-white rounded-lg font-medium
            hover:bg-zinc-800 transition-colors duration-200 
            flex items-center gap-2 shadow-md"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Tizimga kirish
        </button>
      </div>
    );
  }

  return (
    <div className="px-[25px] max-w-md md:max-w-2xl xl:px-[0px] lg:max-w-5xl 2xl:max-w-7xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mening Chatlarim</h1>
      <ChatList userId={user.uid} />
    </div>
  );
}

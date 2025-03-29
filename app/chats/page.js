'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatList from '../components/ChatList';

export default function ChatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="px-[25px] max-w-md md:max-w-2xl xl:px-[0px] lg:max-w-5xl 2xl:max-w-7xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mening Chatlarim</h1>
      <ChatList userId={user.uid} />
    </div>
  );
}

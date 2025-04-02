'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserChats } from '../lib/chat';
import { getPropertyById } from '../lib/properties';
import Image from 'next/image';
import ChatModal from './ChatModal';

export default function ChatList({ userId }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState(null);

  // Simple function to format relative time
  const formatRelativeTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const messageDate = new Date(date);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);
    
    if (diffInSeconds < 60) return 'hozirgina';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiqa oldin`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} soat oldin`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} kun oldin`;
    
    // Format as date for older messages
    return messageDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
  };

  useEffect(() => {
    const loadChats = async () => {
      try {
        const { chats, error } = await getUserChats(userId);
        if (error) throw new Error(error);
        const chatsWithDetails = await Promise.all(
          chats.map(async (chat) => {
            const { property } = await getPropertyById(chat.propertyId);
            return {
              ...chat,
              property,
              lastUpdated: chat.updatedAt || new Date(),
            };
          })
        );

        // Sort chats by last message time
        const sortedChats = chatsWithDetails.sort((a, b) => 
          new Date(b.lastUpdated) - new Date(a.lastUpdated)
        );

        setChats(sortedChats);
      } catch (err) {
        console.error('Error loading chats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [userId]);

  const handleChatClick = (chat) => {
    // Extract propertyId from the chat.id (format: propertyId_user1_user2)
    const propertyId = chat.propertyId;
    const otherUserId = chat.participants.find(id => id !== userId);
    
    setSelectedChat({
      propertyId: propertyId,
      landlordId: otherUserId,
      propertyTitle: chat.property?.name || 'Chat'
    });
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <p className="text-gray-600 font-medium">Hozircha chatlar mavjud emas</p>
        <p className="text-gray-500 text-sm mt-1">Mulk egasi bilan muloqotni boshlang</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <h2 className="px-4 pt-4 pb-2 border-b font-semibold text-lg">Suhbatlar</h2>
      <div className="divide-y">
        {chats.map((chat) => {
          const timeAgo = formatRelativeTime(chat.lastUpdated);
          
          return (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                chat.unreadCount > 0 ? 'bg-gray-50' : ''
              }`}
            >
              {chat.property?.images?.[0] ? (
                <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={chat.property.images[0]}
                    alt={chat.property.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 truncate">
                    {chat.property?.name || 'Mulk nomi mavjud emas'}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {timeAgo}
                  </span>
                </div>
                <p className={`text-sm ${chat.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'} truncate mt-1`}>
                  {chat.lastMessage || 'Xabarlar mavjud emas'}
                </p>
              </div>
              
              {chat.unreadCount > 0 && (
                <div className="bg-black text-white text-xs font-medium rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedChat && (
        <ChatModal
          isOpen={true}
          onClose={handleCloseChat}
          propertyId={selectedChat.propertyId}
          landlordId={selectedChat.landlordId}
          propertyTitle={selectedChat.propertyTitle}
        />
      )}
    </div>
  );
}
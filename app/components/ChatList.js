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

  useEffect(() => {
    const loadChats = async () => {
      try {
        const { chats, error } = await getUserChats(userId);
        if (error) throw new Error(error);

        // Fetch property details for each chat
        const chatsWithDetails = await Promise.all(
          chats.map(async (chat) => {
            const { property } = await getPropertyById(chat.propertyId);
            return {
              ...chat,
              property
            };
          })
        );

        setChats(chatsWithDetails);
      } catch (err) {
        console.error('Error loading chats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [userId]);

  const handleChatClick = (chat) => {
    setSelectedChat({
      propertyId: chat.propertyId,
      landlordId: chat.senderId === userId ? chat.receiverId : chat.senderId,
      propertyTitle: chat.property?.name || 'Chat'
    });
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Hozircha chatlar mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => handleChatClick(chat)}
          className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
        >
          {chat.property?.images?.[0] && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={chat.property.images[0]}
                alt={chat.property.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {chat.property?.name || 'Mulk nomi mavjud emas'}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {chat.lastMessage || 'Xabarlar mavjud emas'}
            </p>
          </div>
          {chat.unreadCount > 0 && (
            <div className="bg-black text-white text-xs rounded-full px-2 py-1">
              {chat.unreadCount}
            </div>
          )}
        </div>
      ))}

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

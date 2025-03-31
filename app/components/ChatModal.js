'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import { Send, X } from 'lucide-react';
import { sendMessage, listenToMessages } from '../lib/chat';
import { getUserInfo } from '../lib/user';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
export default function ChatModal({ isOpen, onClose, propertyId, landlordId, propertyTitle }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});
  const messagesEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.uid || !landlordId || !propertyId) return;

    try {
      await sendMessage(user.uid, landlordId, propertyId, {
        text: newMessage.trim()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (!isOpen || !user?.uid || !landlordId || !propertyId) return;

    let mounted = true;
    setLoading(true);

    // Load user info first
    const loadUserInfo = async () => {
      try {
        const [senderDoc, receiverDoc] = await Promise.all([
          getDoc(doc(db, 'users', user.uid)),
          getDoc(doc(db, 'users', landlordId))
        ]);
        
        if (mounted) {
          const receiverData = receiverDoc.data();
          setUsers({
            [user.uid]: {
              email: user.email,
              isPropertyOwner: user.uid === landlordId
            },
            [landlordId]: {
              email: receiverData?.email || 'Unknown',
              isPropertyOwner: true
            }
          });
          // Only start listening to messages after user info is loaded
          startMessageListener();
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        if (mounted) setLoading(false);
      }
    };

    // Separate function for message listener
    const startMessageListener = () => {
      const unsubscribe = listenToMessages(user.uid, landlordId, propertyId, (newMessages) => {
        if (mounted) {
          setMessages(newMessages);
          setLoading(false);
        }
      });
      return unsubscribe;
    };

    let messageUnsubscribe;
    loadUserInfo().then(() => {
      if (mounted) {
        messageUnsubscribe = startMessageListener();
      }
    });

    return () => {
      mounted = false;
      if (messageUnsubscribe) messageUnsubscribe();
    };
  }, [isOpen, user?.uid, landlordId, propertyId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full h-full sm:h-[600px] sm:max-h-[90vh] sm:rounded-lg 
        sm:w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] flex flex-col">
        <div className="p-3 sm:p-4 border-b flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-semibold truncate">{propertyTitle}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"/>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">
              Suhbatni boshlash uchun xabar yozing
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
              >
                {message.senderId !== user.uid && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 
                    bg-gray-100 text-gray-600">
                    <span className="text-xs sm:text-sm font-medium">
                      {users[message.senderId]?.email?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div
                  className={`max-w-[75%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                    message.senderId === user.uid
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm sm:text-base">{message.text}</p>
                  <div className="flex items-center justify-end mt-1">
                    <span className="text-[10px] sm:text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                {message.senderId === user.uid && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0 
                    bg-black text-white">
                    <span className="text-xs sm:text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1 border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import { Send, X } from 'lucide-react';
import { sendMessage, listenToMessages } from '../lib/chat';
import { getUserInfo } from '../lib/user';
import { doc, getDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function ChatModal({ isOpen, onClose, propertyId, landlordId, propertyTitle }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});
  const [hasAccess, setHasAccess] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !user) return;

    const checkAccess = async () => {
      try {
        if (user.uid === landlordId) {
          setHasAccess(true);
          setAccessChecked(true);
          return;
        }

        const requestDoc = await getDoc(doc(db, 'requests', `${propertyId}_${user.uid}`));
        if (requestDoc.exists() && requestDoc.data().status === 'pending') {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
        setAccessChecked(true);
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
        setAccessChecked(true);
      }
    };

    checkAccess();
  }, [isOpen, user, landlordId, propertyId]);

  useEffect(() => {
    if (!isOpen || !hasAccess) return;

    const loadUserInfo = async () => {
      try {
        const [senderDoc, receiverDoc] = await Promise.all([
          getDoc(doc(db, 'users', user.uid)),
          getDoc(doc(db, 'users', landlordId))
        ]);
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
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadUserInfo();

    const unsubscribe = listenToMessages(user.uid, landlordId, propertyId, (messages) => {
      setMessages(messages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, user?.uid, landlordId, propertyId, hasAccess]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await sendMessage(user.uid, landlordId, propertyId, {
        text: newMessage,
        senderId: user.uid,
        timestamp: new Date().toISOString(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!isOpen) return null;

  if (accessChecked && !hasAccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Xatolik</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600">
            Siz ushbu mulk egasi bilan suhbatlashish huquqiga ega emassiz. Iltimos, avval mulkni ijaraga olish so'rovini yuboring.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md md:max-w-xl lg:max-w-2xl h-[600px] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{propertyTitle}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 
                    ${message.senderId === landlordId ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}
                  >
                    <span className="text-sm font-medium">
                      {users[message.senderId]?.email?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === user.uid
                      ? 'bg-black text-white'
                      : message.senderId === landlordId
                        ? 'bg-blue-50 text-gray-900'
                        : 'bg-gray-100'
                  }`}
                >
                  <p>{message.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {message.senderId === landlordId && (
                      <span className="text-xs text-blue-600 font-medium ml-2">
                        Mulk egasi
                      </span>
                    )}
                  </div>
                </div>
                {message.senderId === user.uid && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0 
                    ${user.uid === landlordId ? 'bg-blue-500' : 'bg-black'} text-white`}
                  >
                    <span className="text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

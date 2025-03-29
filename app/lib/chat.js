import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs,
  or 
} from 'firebase/firestore';

export const sendMessage = async (senderId, receiverId, propertyId, message) => {
  try {
    const chatRef = collection(db, 'chats');
    await addDoc(chatRef, {
      senderId,
      receiverId,
      propertyId,
      text: message.text,
      timestamp: serverTimestamp(),
      participants: [senderId, receiverId], // Add participants array
      lastMessageAt: serverTimestamp(),
      lastMessage: message.text
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { error: error.message };
  }
};

export const listenToMessages = (userId1, userId2, propertyId, callback) => {
  const chatRef = collection(db, 'chats');
  // Modified query to work with the composite index
  const q = query(
    chatRef,
    where('propertyId', '==', propertyId),
    orderBy('timestamp', 'asc'),
    orderBy('__name__', 'asc') // Add this to match the index
  );

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore Timestamp to JS Date
      const timestamp = data.timestamp?.toDate?.() || new Date();
      messages.push({ 
        id: doc.id,
        ...data,
        timestamp: timestamp
      });
    });
    callback(messages);
  });
};

export const getUserChats = async (userId) => {
  try {
    const chatRef = collection(db, 'chats');
    const q = query(
      chatRef,
      or(
        where('senderId', '==', userId),
        where('receiverId', '==', userId)
      ),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    const chats = [];
    
    // Create a Set to track unique property IDs
    const uniqueProperties = new Set();
    
    snapshot.forEach((doc) => {
      const chatData = doc.data();
      // Only add if we haven't seen this property before
      if (!uniqueProperties.has(chatData.propertyId)) {
        uniqueProperties.add(chatData.propertyId);
        chats.push({
          id: doc.id,
          ...chatData,
          timestamp: chatData.timestamp?.toDate() || new Date(),
        });
      }
    });

    return { chats };
  } catch (error) {
    console.error('Error getting user chats:', error);
    return { error: error.message };
  }
};

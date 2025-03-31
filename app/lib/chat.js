import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc
} from 'firebase/firestore';

export const sendMessage = async (senderId, receiverId, propertyId, messageData) => {
  const chatRef = collection(db, 'chats');
  await addDoc(chatRef, {
    ...messageData,
    propertyId,
    participants: [senderId, receiverId].sort(),
  });
};

export const listenToMessages = (userId, landlordId, propertyId, callback) => {
  const chatRef = collection(db, 'chats');
  const q = query(
    chatRef,
    where('participants', '==', [userId, landlordId].sort()),
    where('propertyId', '==', propertyId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

export const getUserChats = (userId, callback) => {
  const chatRef = collection(db, 'chats');
  const q = query(
    chatRef,
    where('participants', 'array-contains', userId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(chats);
  });
};

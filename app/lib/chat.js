import { realtimeDb } from '../firebase/config';
import { ref, push, onValue, query, orderByChild, get, set, update } from 'firebase/database';

const createChatRoomId = (propertyId, userId1, userId2) => {
  const sortedUsers = [userId1, userId2].sort();
  return `${propertyId}_${sortedUsers[0]}_${sortedUsers[1]}`;
};

export const sendMessage = async (senderId, receiverId, propertyId, message) => {
  if (!senderId || !receiverId || !propertyId || !message?.text) {
    throw new Error('Missing required parameters for sending message');
  }

  const roomId = createChatRoomId(propertyId, senderId, receiverId);
  const timestamp = Date.now();
  const messageRef = push(ref(realtimeDb, `messages/${roomId}`));
  
  const updates = {
    [`messages/${roomId}/${messageRef.key}`]: {
      senderId,
      text: message.text,
      timestamp
    },
    [`chatRooms/${roomId}`]: {
      propertyId,
      participants: [senderId, receiverId],
      lastMessageAt: timestamp,
      lastMessage: message.text,
      lastSenderId: senderId
    }
  };

  await update(ref(realtimeDb), updates);
  return { success: true };
};

export const listenToMessages = (userId1, userId2, propertyId, callback) => {
  const roomId = createChatRoomId(propertyId, userId1, userId2);
  console.log('Listening to room:', roomId); // Debug log
  
  // Create room if it doesn't exist
  const roomRef = ref(realtimeDb, `chatRooms/${roomId}`);
  get(roomRef).then((snapshot) => {
    if (!snapshot.exists()) {
      set(roomRef, {
        propertyId,
        participants: [userId1, userId2],
        lastMessageAt: Date.now(),
        lastMessage: '',
        lastSenderId: ''
      });
    }
  });

  const messagesRef = ref(realtimeDb, `messages/${roomId}`);
  const messagesQuery = query(messagesRef, orderByChild('timestamp'));
  
  return onValue(messagesQuery, (snapshot) => {
    const messages = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        if (messageData && messageData.senderId) {
          messages.push({
            id: childSnapshot.key,
            ...messageData,
            timestamp: messageData.timestamp
          });
        }
      });
    }
    callback(messages.sort((a, b) => a.timestamp - b.timestamp));
  });
};

export const getUserChats = async (userId) => {
  try {
    const roomsRef = ref(realtimeDb, 'chatRooms');
    const roomsQuery = query(roomsRef, orderByChild('lastMessageAt'));
    
    const snapshot = await get(roomsQuery);
    if (!snapshot.exists()) {
      return { chats: [] };
    }

    const chats = [];
    snapshot.forEach((childSnapshot) => {
      const roomData = childSnapshot.val();
      if (roomData.participants && roomData.participants.includes(userId)) {
        // Find the other participant (receiver/sender)
        const otherParticipant = roomData.participants.find(p => p !== userId);
        chats.push({
          id: childSnapshot.key,
          ...roomData,
          receiverId: otherParticipant,
          senderId: roomData.lastSenderId,
          timestamp: new Date(roomData.lastMessageAt || 0)
        });
      }
    });

    return { 
      chats: chats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    };
  } catch (error) {
    console.error('Error getting user chats:', error);
    return { error: error.message, chats: [] };
  }
};

// Optional: Add function to mark messages as read
export const markMessagesAsRead = async (roomId, userId) => {
  try {
    await update(ref(realtimeDb, `chatRooms/${roomId}`), {
      [`lastReadBy/${userId}`]: Date.now()
    });
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

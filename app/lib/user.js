import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const setUserRole = async (userId, role) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      role,
      createdAt: new Date().toISOString(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { role: userDoc.data().role, error: null };
    }
    return { role: null, error: null };
  } catch (error) {
    return { role: null, error: error.message };
  }
};

export const getUserInfo = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

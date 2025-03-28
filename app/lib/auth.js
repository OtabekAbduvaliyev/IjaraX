import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import Cookies from 'js-cookie';

const googleProvider = new GoogleAuthProvider();

const setAuthCookie = async (user) => {
  const token = await user.getIdToken();
  // Set cookie with token
  Cookies.set('user-token', token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};

const removeAuthCookie = () => {
  Cookies.remove('user-token');
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await setAuthCookie(result.user);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await setAuthCookie(result.user);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setAuthCookie(result.user);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
    removeAuthCookie();
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

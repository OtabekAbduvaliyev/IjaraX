'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../lib/auth';
import { getUserRole } from '../lib/user';
import { FaGoogle } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailWarning, setEmailWarning] = useState('');
  const [passwordWarning, setPasswordWarning] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailWarning('');
    setPasswordWarning('');
    if (!email.trim()) {
      setEmailWarning("Email kiritish majburiy!");
      return;
    }
    if (!password.trim()) {
      setPasswordWarning("Parol kiritish majburiy!");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { user, error } = isLogin
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);

      if (error) throw new Error(error);

      if (user) {
        if (isLogin) {
          const { role, error: roleError } = await getUserRole(user.uid);
          if (roleError) throw new Error(roleError);

          if (role) {
            router.push('/'); //agar userni roli mavjud bo'lsa, home pagega jonatvoradi
          } else {
            router.push('/role-selection');
          }
        } else {
          router.push('/role-selection');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { user, error } = await signInWithGoogle();
      if (error) throw new Error(error);

      if (user) {
        const { role, error: roleError } = await getUserRole(user.uid);
        if (roleError) throw new Error(roleError);

        if (role) {
          router.push('/');
        } else {
          router.push('/role-selection');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-5xl 2xl:max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-12 py-8 lg:py-0">
        {/* Image Section */}
        <div className="hidden lg:block lg:w-1/2 xl:w-3/5">
          {!isLogin ? (
            <Image 
              src="/images/signup.jpg" 
              alt="Sign Up" 
              width={700} 
              height={500} 
              className="object-cover rounded-2xl"
            />
          ) : (
            <Image 
              src="/images/signin.png" 
              alt="Sign In" 
              width={700} 
              height={500} 
              className="object-cover rounded-2xl"
            />
          )}
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 xl:w-2/5 space-y-6 lg:space-y-8">
          <h1 className="text-3xl lg:text-4xl font-bold">
            {isLogin ? "Hisobga kirish" : "Ro'yxatdan o'tish"}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <span className="block sm:inline">
                {error === 'Firebase: Error (auth/invalid-email).' && 'Email noto\'g\'ri formatda kiritildi'}
                {error === 'Firebase: Error (auth/user-not-found).' && 'Foydalanuvchi topilmadi'}
                {error === 'Firebase: Error (auth/wrong-password).' && 'Parol noto\'g\'ri'}
                {error === 'Firebase: Error (auth/email-already-in-use).' && 'Bu email allaqachon ro\'yxatdan o\'tgan'}
                {error === 'Firebase: Error (auth/weak-password).' && 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'}
                {!error.includes('Firebase') && error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Foydalanuvchi emaili:
                </label>
                {emailWarning && <span className="text-red-500 text-xs">{emailWarning}</span>}
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-colors"
                placeholder="Emailingizni kiritng..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Foydalanuvchi kaliti:
                </label>
                {passwordWarning && <span className="text-red-500 text-xs">{passwordWarning}</span>}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-colors"
                placeholder="Parolingizni kiritng..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-white border border-gray-200 rounded-lg text-base font-medium hover:bg-zinc-900 hover:text-white transition-colors"
            >
              {loading ? 'Yuklanmoqda...' : isLogin ? "Hisobga kirish" : "Ro'yxatdan o'tish"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Tarmoqlar orqali davom etish</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <FaGoogle className="w-5 h-5" />
                <span>Google orqali davom eting</span>
              </button>

              <button
                type="button"
                className="w-full py-2.5 px-4 border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <FaFacebookSquare className="w-5 h-5" />
                <span>Facebook orqali davom eting</span>
              </button>
            </div>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
          >
            {isLogin ? "Hali hisobingiz yo'qmi? Ro'yxatdan o'tish" : "Akkountingiz mavjudmi? Hisobga kirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex flex-col py-[100px] justify-center lg:flex lg:flex-row lg:justify-between lg:py-0 h-screen items-center max-w-md md:max-w-2xl lg:max-w-5xl  2xl:max-w-7xl mx-auto font-[Lekton] lg:pr-[53px] gap-[80px]">
      <div className="right-side">
        {!isLogin ? <Image src="/images/signup.jpg" className='hidden lg:block ' alt="Auth" width={700} height={500} /> :
        <Image src="/images/signin.png" alt="Auth" className='hidden lg:block' width={700} height={500} />}
      </div>
      <div className='left-side px-[25px] lg:px-[0px]  w-[100%] lg:max-w-[416]'>
        <h1 className='text-[35px] lg:text-[45px] font-[Lekton] font-[700] '>{isLogin ? "Hisobga kirish": "Ro'yxatdan o'tish"}</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
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
        <form className='form mt-[48px]' onSubmit={handleSubmit} >
          <div className='email flex flex-col'>
            <div className="flex justify-between items-center">
              <label htmlFor='email' className='text-[14px] text-[20px] font-[700]'>Foydalanuvchi emaili:</label>
              {emailWarning && <span className="text-red-500 text-sm">{emailWarning}</span>}
            </div>
            <input value={email}  onChange={(e)=>setEmail(e.target.value)} id='email' className='w-[100%] lg:w-[416px]  h-[50px] border-1 rounded-[10px]  placeholder:font-[Lekton] pl-[12px]' placeholder='Emailingizni kiritng...' />
          </div>
          <div className='password flex flex-col mt-[22px]'>
            <div className="flex justify-between items-center">
              <label htmlFor='password' className='text-[20px] font-[700]'>Foydalanuvchi kaliti:</label>
              {passwordWarning && <span className="text-red-500 text-sm">{passwordWarning}</span>}
            </div>
            <input type='password'  value={password} onChange={(e)=>setPassword(e.target.value)} id='password' className='font-sans w-[100%] lg:w-[416px]  h-[50px] border-1 rounded-[10px]  placeholder:font-[Lekton] pl-[12px]' placeholder='Parolinigzni kiritng...' />
          </div>
          <div className='enter-button'>
            <button type='submit' className='w-[100%] border-1 rounded-[10px] h-[50px] font-[700] text-[20px] mt-[25px] hover:bg-[#171717] hover:text-white cursor-pointer'>
              {loading ? 'Yuklanmoqda...' : isLogin ? "Hisobga kirish" : "Ro'yxatdan o'tish"}
            </button>
          </div>
          <div className="flex items-center my-[18px]">
            <div className="flex-1 border-t border-gray-400"></div>
            <span className="px-3 text-gray-600 text-[18px]">Tarmoqlar orqali davom etish</span>
            <div className="flex-1 border-t border-gray-400"></div>
          </div>
          <div className='google-button' onClick={handleGoogleSignIn}>
            <button type='submit' className='w-[100%] border-1 rounded-[10px] h-[50px] font-[700] text-[20px] hover:bg-[#171717] hover:text-white cursor-pointer flex items-center justify-center gap-[8px]'>
              <FaGoogle className='w-[26px]' />
              {"Google orqali davom eting"}
            </button>
          </div>
          <div className='facebook-button'>
            <button type='submit' className='w-[100%] border-1 rounded-[10px] h-[50px] font-[700] text-[20px] mt-[18px] hover:bg-[#171717] hover:text-white cursor-pointer flex items-center justify-center gap-[8px]'>
              <FaFacebookSquare className='w-[26px]' />
              {"Facebook orqali davom eting"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-[#171717] ">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[14px] lg:text-[16px] cursor-pointer"
            >
              {isLogin ? "Hali hisobingiz yo'qmi? Ro'yxatdan o'tish" : "Akkountingiz mavjudmi? Hisobga kirish"}
            </button>
          </div>
      </div>
    </div>
  );
}

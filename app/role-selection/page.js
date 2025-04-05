'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';
import { setUserRole } from '../lib/user';
import { ProtectedRoute } from '../components/RouteProtection';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

export default function RoleSelection() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async (role) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await setUserRole(user.uid, role);
      if (error) throw new Error(error);
      
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <ProtectedRoute requireAuth={true}>
      // <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      //   <div className="sm:mx-auto sm:w-full sm:max-w-md">
      //     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
      //       Welcome to IjaraX
      //     </h2>
      //     <p className="mt-2 text-center text-sm text-gray-600">
      //       Choose how you want to use our platform
      //     </p>
      //   </div>

      //   <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      //     <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      //       {error && (
      //         <div className="mb-4 text-sm text-red-600">{error}</div>
      //       )}
            
      //       <div className="space-y-4">
      //         <button
      //           onClick={() => handleRoleSelection('renter')}
      //           disabled={loading}
      //           className="w-full flex justify-center items-center px-4 py-6 border-2 border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
      //         >
      //           <div className="text-left">
      //             <div className="text-xl font-semibold">I want to rent</div>
      //             <div className="text-sm text-gray-500 mt-1">
      //               Browse available properties and find your perfect home
      //             </div>
      //           </div>
      //         </button>

      //         <button
      //           onClick={() => handleRoleSelection('landlord')}
      //           disabled={loading}
      //           className="w-full flex justify-center items-center px-4 py-6 border-2 border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
      //         >
      //           <div className="text-left">
      //             <div className="text-xl font-semibold">I want to rent out</div>
      //             <div className="text-sm text-gray-500 mt-1">
      //               List your properties and find reliable tenants
      //             </div>
      //           </div>
      //         </button>
      //       </div>
      //     </div>
      //   </div>
      // </div>
      
    // </ProtectedRoute>
    <div className='role-selection lekton flex flex-col justify-center px-[15px] h-screen max-w-md md:max-w-2xl lg:max-w-5xl 2xl:max-w-7xl mx-auto'>
     <div className='heading'>
      <h1 className='text-[30px] md:text-[52px] font-bold text-center'>Akkountingiz uchun rol tanlang</h1>
     </div>
     <div className="selections flex flex-col items-center md:justify-center md:flex-row gap-[36px] mt-[55px]">
      <div onClick={() => handleRoleSelection('landlord')} className="landlord flex items-center md:flex-col py-[20px] md:py-[34px] w-[100%] cursor-pointer hover:text-white hover:bg-[#171717] transition-all duration-100 border rounded rounded-[15px] md:w-[445px] text-center ">
        <div className="image flex justify-center">
        <Image className='w-[50%]' src={"/images/landlord-role.png"} alt='landlord role img' width={268} height={268}/>
        </div>
        <h1 className=' text-[28px] md:text-[38px]'>Ijara bervuchi</h1>
      </div>
      <div onClick={() => handleRoleSelection('renter')} className="renter flex items-center md:flex-col py-[26px] md:py-[38px] w-[100%] cursor-pointer hover:text-white hover:bg-[#171717] transition-all duration-100 border rounded rounded-[15px] md:w-[445px] text-center">
        <div className="image flex justify-center">
        <Image className='w-[50%]' src={"/images/renter-role.png"} alt='landlord role img' width={268} height={268}/>
        </div>
        <h1 className='text-[28px] md:text-[38px] md:mt-[30px]'>Ijara oluvchi</h1>
      </div>
     </div>
    </div>
  );
}

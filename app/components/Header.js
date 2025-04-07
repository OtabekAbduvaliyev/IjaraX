'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../lib/auth';
import { GoHome } from "react-icons/go";
import { CiHeart } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import { Dropdown, Space } from 'antd';
import { FaRegUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { HiMiniBars3 } from "react-icons/hi2";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";

export default function Header() {
  const { user, userRole } = useAuth();
  const router = useRouter();
  console.log(userRole);
   
  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw new Error(error);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddProperty = () => {
    router.push('/properties/new');
  };

  const items1 = [
    {
      key: '1',
      label: 'Mening Hisobim',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: (
        <div className='flex items-center gap-[5px]'>
          <Link href={'/profile'} className='text-black'>Profilim </Link> <FaRegUser />
        </div>
      ),
      extra: '⌘P',
      // hidden:!userRole == "landlord" || userRole == 'renter'
    },
    {
      key: '3',
      label: (
        <div className='flex items-center gap-[5px]'>
         <button onClick={handleSignOut}>Chiqish</button>  <IoIosLogOut />
        </div>
      ),
      extra: '⌘B',
    },
  ];

  const items2 = [
    {
      key: '1',
      label: (
        <Link href={'/'}  className='flex items-center gap-[7px] border-1 rounded-[10px] px-[16px] py-[3px] hover:bg-[#171717] hover:text-white duration-100'><GoHome className='text-[18px]'/>Bosh sahifa</Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link href={'/saved'} className='flex items-center gap-[7px] border-1 rounded-[10px] px-[16px] py-[3px]  hover:bg-[#171717] hover:text-white duration-100'><CiHeart className='text-[18px]'/>Yoqtirilganlar</Link>
      ),
    },
    {
      key: '3',
      label: (
        <Link href={'/chats'} className='flex items-center gap-[7px] border-1 rounded-[10px] px-[16px] py-[3px]  hover:bg-[#171717] hover:text-white duration-100'><IoChatbubbleOutline className='text-[18px]'/>Chatlar</Link>
      ),
    },
  ];
console.log(user);

  return (
    <header className='lekton mt-[] flex items-center px-[25px] max-w-md md:max-w-2xl xl:px-[0px] lg:max-w-5xl 2xl:max-w-7xl mx-auto justify-between py-[23px] border-b'>
      <div className="logo">
        <Link href='/'> <h1 className='text-[36px] font-bold'>IjaraX</h1> </Link>
      </div>
      <div className="right-side flex items-center gap-[15px]">
        <div className="hidden lg:flex links gap-[10px]">
          <Link href={'/'}  className='flex items-center gap-[7px] border-1 rounded-[10px] px-[16px] py-[3px] hover:bg-[#171717] hover:text-white duration-100'><GoHome className='text-[18px]'/>Bosh sahifa</Link>
          <Link href={'/saved'} className='flex items-center gap-[7px] border-1 rounded-[10px] px-[16px] py-[3px]  hover:bg-[#171717] hover:text-white duration-100'><CiHeart className='text-[18px]'/>Yoqtirilganlar</Link>
          {(<Link href={'/properties/new'} className='flex items-center gap-[7px] border-1 rounded-[10px] px-[16px] py-[3px]  hover:bg-[#171717] hover:text-white duration-100'><IoKeyOutline className='text-[18px]'/>Ijara joylash</Link>)}
          <Link href={'/chats'} className='flex items-center gap-[7px] border-1 rounded-[10px] px-[16px] py-[3px]  hover:bg-[#171717] hover:text-white duration-100'><IoChatbubbleOutline className='text-[18px]'/>Chatlar</Link>
        </div>
        
        {/* Mobile Add Property Button - Circular design matching black/white theme */}
        <div className="lg:hidden">
          <button 
            onClick={handleAddProperty}
            className="flex items-center justify-center rounded-full w-9 h-9 border border-black hover:bg-[#171717] hover:text-white transition-colors"
            aria-label="Ijara qo'shish"
          >
            <IoAdd className="text-xl" />
          </button>
        </div>
        
        <div className="account-menu lg:hidden">
          <Dropdown
            placement='bottomRight'
            trigger={'click'}
            menu={{
              items:items2,
            }}
          >
            <button className='rounded-[50%] font-bold text-black py-[7px] px-[7px] cursor-pointer border'><HiMiniBars3 className='text-[18px]'/></button>
          </Dropdown>
        </div>
        
        <div className="account-menu">
          <Dropdown
            trigger={'click'}
            menu={{
              items:items1
            }}
          >
            <button className='rounded-[50%] hover:bg-[#171717] hover:text-white font-bold text-black py-[5px] px-[5px] cursor-pointer border'><CiUser className='text-[20px]'/></button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
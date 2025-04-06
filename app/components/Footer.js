// components/Footer.jsx
export default function Footer() {
    return (
      <footer className="px-[25px] max-w-md md:max-w-2xl xl:px-[0px] lg:max-w-5xl 2xl:max-w-7xl mx-auto justify-between py-[23px] bg-white text-black py-6 px-4 border-t ">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} IjaraX. Barcha huquqlar himoyalangan.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/welcome" className="hover:underline text-sm">Biz haqimizda</a>
            <a href="/welcome" className="hover:underline text-sm">Maxfiylik</a>
            <a href="/welcome" className="hover:underline text-sm">Bog‘lanish</a>
          </div>
        </div>
      </footer>
    );
  }
  
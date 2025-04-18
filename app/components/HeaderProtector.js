'use client'


import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderOrg (){
    const pathname = usePathname();
    return(<div>
        {pathname !== "/auth" && pathname !== "/role-selection" && pathname !== "/welcome"  && <Header />}
    </div>
    )
}
export const metadata = {
    title: "Auth | IjaraX",
    description: "Sign in to access your account on IjaraX.",
    openGraph: {
        title: "Auth | IjaraX",
        description: "Ijara X platformasi uchun ro'yxatdan o'ting !",
        images: [{ url: "https://ijara-x.vercel.app/default-property.webp" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Auth | IjaraX",
        description: "Ijara X platformasi uchun ro'yxatdan o'ting !",
        images: [{ url: "https://ijara-x.vercel.app/default-property.webp" }],
    },
  };
  
  export default function AuthLayout({ children }) {
    return <>{children}</>;
  }
  
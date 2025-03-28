export async function generateMetadata({ params }) {
    const { id } = params;

    try {
        const res = await fetch(`https://ijara-x.vercel.app/api/metadata/${id}`, {
            next: { revalidate: 60 }, // Caches for 1 minute
        });
        const metadata = await res.json();

        return {
            title: metadata.title || "IjaraX | Find Your Next Rental",
            description: metadata.description || "Discover the best properties on IjaraX.",
            openGraph: {
                title: metadata.title,
                description: metadata.description,
                images: [{ url: metadata.image }],
                type: "article",
            },
            twitter: {
                card: "summary_large_image",
                title: metadata.title,
                description: metadata.description,
                images: [{ url: metadata.image }],
            },
        };
    } catch (error) {
        console.error("Metadata Fetch Error:", error);
        return {
            title: "IjaraX | Find Your Next Rental",
            description: "Discover the best properties on IjaraX.",
            openGraph: {
                title: "IjaraX | Find Your Next Rental",
                description: "Discover the best properties on IjaraX.",
                images: [{ url: "https://ijara-x.vercel.app/default-property.webp" }],
            },
        };
    }
}

// ✅ Ensure this function returns children (React Component)
export default function PropertiesLayout({ children }) {
    return <>{children}</>;
}

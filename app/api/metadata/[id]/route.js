import { getPropertyById } from "../../../lib/properties";

export async function GET(req, { params }) {
    const { id } = params;

    try {
        const { property } = await getPropertyById(id);
        
        if (!property) {
            return new Response(JSON.stringify({
                title: "Property Not Found | IjaraX",
                description: "The requested property does not exist.",
                image: "https://ijara-x.vercel.app/default-property.webp",
                url: `https://ijara-x.vercel.app/properties/${id}`,
                type: "website"
            }), { 
                status: 404,
                headers: {
                    "Cache-Control": "public, max-age=60",
                    "Content-Type": "application/json"
                }
            });
        }

        // Format price for description
        const priceFormatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'UZS'
        }).format(property.price);

        // Create a rich description
        const description = `${property.name} - ${priceFormatted}. ${property.description?.slice(0, 120)}...`;

        return new Response(JSON.stringify({
            title: `${property.name} | IjaraX`,
            description,
            image: property.images?.[0] || "https://ijara-x.vercel.app/default-property.webp",
            url: `https://ijara-x.vercel.app/properties/${id}`,
            type: "article",
            price: property.price,
            location: property.location,
            propertyType: property.propertyType
        }), { 
            status: 200,
            headers: {
                "Cache-Control": "public, max-age=60",
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error fetching property metadata:", error);
        return new Response(JSON.stringify({
            title: "Error | IjaraX",
            description: "Something went wrong while fetching this property.",
            image: "https://ijara-x.vercel.app/default-property.webp",
            url: `https://ijara-x.vercel.app/properties/${id}`,
            type: "website"
        }), { 
            status: 500,
            headers: {
                "Cache-Control": "public, max-age=60",
                "Content-Type": "application/json"
            }
        });
    }
}

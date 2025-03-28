import { getAllProperties } from "./lib/properties"; 

export default async function sitemap() {
    const baseUrl = "https://ijara-x.vercel.app";
    
    const properties = await getAllProperties();

    return [
        { url: baseUrl, lastModified: new Date() },
        ...properties.map(property => ({
            url: `${baseUrl}/properties/${property.id}`,
            lastModified: new Date(property.updatedAt),
        }))
    ];
}

export default function robots() {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
      sitemap: 'https://ijara-x.vercel.app/sitemap.xml',
    };
  }
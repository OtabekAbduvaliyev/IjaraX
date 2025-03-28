import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Get User-Agent header
    const userAgent = request.headers.get('user-agent') || '';

    // List of allowed bots (SEO + Open Graph)
    const allowedBots = [
        "googlebot", "bingbot", "yandexbot", "duckduckbot", "baiduspider", // Search Engines
        "facebookexternalhit", "twitterbot", "linkedinbot", "slurp", // Social Media (OG)
        "discordbot", "whatsapp", "telegrambot", "pinterest", "redditbot"
    ];

    // Detect if request is from a bot
    const isBot = allowedBots.some(keyword => userAgent.toLowerCase().includes(keyword));

    if (isBot || path.startsWith("/images/")) {
        console.log("Allowed bot or image request detected:", userAgent);
        return NextResponse.next(); // Allow bots and image requests
    }

    // Get the token from the cookies
    const isAuthenticated = request.cookies.has('user-token');

    // Define public paths that don't require authentication
    const publicPaths = ['/auth'];
    const isPublicPath = publicPaths.includes(path);

    // Redirect logic
    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    if (isAuthenticated && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Matching Paths
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images/).*)', // Exclude /images/
    ],
};

import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Get User-Agent header
    const userAgent = request.headers.get('user-agent') || '';

    // List of allowed bots (SEO + Open Graph)
    const allowedBots = [
        "googlebot", "bingbot", "yandexbot", "duckduckbot", "baiduspider",
        "facebookexternalhit", "twitterbot", "linkedinbot", "slurp",
        "discordbot", "whatsapp", "telegrambot", "pinterest", "redditbot"
    ];

    // Detect if request is from a bot
    const isBot = allowedBots.some(keyword => userAgent.toLowerCase().includes(keyword));

    if (isBot || path.startsWith("/images/")) {
        return NextResponse.next();
    }

    // Get the token from the cookies
    const isAuthenticated = request.cookies.has('user-token');

    // Define public paths that don't require authentication
    const publicPaths = ['/','/auth'];
    const isPublicPath = publicPaths.some(publicPath => path === publicPath);

    // Redirect logic
    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    return NextResponse.next();
}

// Matching Paths - protect everything except static files
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images/).*)',
    ],
};

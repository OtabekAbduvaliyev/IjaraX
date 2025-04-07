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
    const publicPaths = [
        '/', 
        '/auth', 
        '/welcome',
        '/auth/login',
    ];
    
    const isPublicPath = publicPaths.some(publicPath => 
        path.startsWith(publicPath) || 
        path === publicPath
    ) || (path.match(/^\/properties\/[^\/]+$/) && !path.endsWith('/new'));

    // Redirect logic
    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Prevent authenticated users from accessing auth pages
    if (isAuthenticated && (path === '/auth' || path === '/auth/login' || path === '/auth/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Matching Paths - protect everything except static files
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images/).*)',
    ],
};

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Beta invite codes
const VALID_INVITE_CODES = [
  "BETA-A1RJSZDS", "BETA-9VICAINO", "BETA-33DKVDC4", "BETA-TQB9NZVB",
  "BETA-RRASBI3X", "BETA-GFNX6RBS", "BETA-PRD0FT90", "BETA-T7GSC4B0",
  "BETA-4MVRJ5SF", "BETA-NUAM6UOM", "BETA-H1PRFA32", "BETA-9YNBBNKM",
  "BETA-WQURYCWT", "BETA-AICJDNAC", "BETA-SFJSNXF0", "BETA-G5SKNYVA",
  "BETA-KXVZJMRP", "BETA-0CPGD91Q", "BETA-VJMY8FUH", "BETA-2MF2HBC6",
  "BETA-FOUNDER"
];

const isPublicRoute = createRouteMatcher([
  '/waitlist(.*)',
  '/api(.*)'  // All API routes bypass beta gate - they handle auth internally
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Waitlist is always accessible
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Check beta access
  const inviteCode = request.cookies.get("beta_invite")?.value;
  const hasValidInvite = inviteCode && VALID_INVITE_CODES.includes(inviteCode);

  // OAuth users have access
  if (userId) {
    return NextResponse.next();
  }

  // Valid invite cookie = access
  if (hasValidInvite) {
    return NextResponse.next();
  }

  // Check URL for invite code
  const url = new URL(request.url);
  const urlInviteCode = url.searchParams.get("invite");

  if (urlInviteCode && VALID_INVITE_CODES.includes(urlInviteCode)) {
    const response = NextResponse.next();
    response.cookies.set("beta_invite", urlInviteCode, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: "lax"
    });
    return response;
  }

  // No access - redirect to waitlist
  return NextResponse.redirect(new URL("/waitlist", request.url));
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

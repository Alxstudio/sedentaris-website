import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Set PREVIEW_ONLY=true in Vercel environment variables to lock the site to /preview/atletes
const PREVIEW_ONLY = process.env.PREVIEW_ONLY === 'true'

export function middleware(request: NextRequest) {
  if (!PREVIEW_ONLY) return NextResponse.next()

  const { pathname } = request.nextUrl

  // Allow: preview pages, admin, api, and Next.js internals
  const allowed =
    pathname.startsWith('/preview') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')

  if (!allowed) {
    return NextResponse.redirect(new URL('/preview/atletes', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|webp|svg|ico|css|js)).*)'],
}

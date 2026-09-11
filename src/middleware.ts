import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const { pathname } = request.nextUrl
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase environment is unconfigured, fail open for public routes and protect dashboards
  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/customer')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return supabaseResponse
  }

  // Sanitize Supabase URL to strip accidental trailing slashes or /rest/v1
  const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')

  const supabase = createServerClient(
    cleanUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Calling getUser() safely refreshes tokens without stale JWT vulnerabilities
  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error && data?.user) {
      user = data.user
    }
  } catch {
    user = null
  }

  // --------------------------------------------------------------------------
  // 1. The Public Hero Page (Strictly Public) & 3. Protected Route Guards
  // --------------------------------------------------------------------------
  if (!user) {
    // Protected Route Guards: Unauthenticated users cannot visit /admin/... or /customer/...
    if (pathname.startsWith('/admin') || pathname.startsWith('/customer')) {
      const redirectResponse = NextResponse.redirect(new URL('/', request.url))
      // Propagate any updated session cookies
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      })
      return redirectResponse
    }

    // Root route ('/') and other public pages MUST load for unauthenticated users
    return supabaseResponse
  }

  // --------------------------------------------------------------------------
  // Role verification from database 'profiles' table
  // --------------------------------------------------------------------------
  let role: 'admin' | 'customer' = 'customer'
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (!error && profile?.role === 'admin') {
      role = 'admin'
    } else {
      role = 'customer'
    }
  } catch {
    role = 'customer'
  }

  // --------------------------------------------------------------------------
  // 2. Smart Login Redirects:
  // IF a user is successfully authenticated AND they visit the root page ('/'),
  // intercept them and redirect based on their database role:
  //   - Role === 'admin' -> Redirect to /admin/dashboard
  //   - Role === 'customer' -> Redirect to /customer/dashboard
  // --------------------------------------------------------------------------
  if (pathname === '/') {
    const destination = role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'
    const redirectResponse = NextResponse.redirect(new URL(destination, request.url))
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  // --------------------------------------------------------------------------
  // 3. Protected Route Guards:
  // IF an authenticated Customer attempts to access /admin/..., redirect back to /customer/dashboard
  // --------------------------------------------------------------------------
  if (pathname.startsWith('/admin') && role !== 'admin') {
    const redirectResponse = NextResponse.redirect(new URL('/customer/dashboard', request.url))
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  return supabaseResponse
}

// ----------------------------------------------------------------------------
// 4. Safe Config Matcher:
// Strictly excludes Next.js internals, favicon, images, and auth callbacks
// to prevent infinite redirect loops.
// ----------------------------------------------------------------------------
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (Supabase auth callback routes)
     * - standard images (svg, png, jpg, jpeg, gif, webp, ico)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}

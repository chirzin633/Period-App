import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
    let supabaseResponse = NextResponse.next({ request })

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({ request })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // IMPORTANT: DO NOT remove auth.getUser() - refreshes the session
        const { data: { user } } = await supabase.auth.getUser()

        const { pathname } = request.nextUrl

        // Protected routes - redirect to login if not authenticated
        const protectedRoutes = ['/dashboard', '/cycle-tracker', '/symptom-log', '/insights', '/settings']
        const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

        // Auth routes - redirect to dashboard if already authenticated
        const authRoutes = ['/login', '/signup']
        const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

        if (isProtected && !user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        if (isAuthRoute && user) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    } catch (error) {
        console.error('Middleware error:', error)
        // Continue with the request even if there's an error
    }

    return supabaseResponse
}
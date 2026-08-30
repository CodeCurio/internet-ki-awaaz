import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database.types';

const ADMIN_PREFIX = '/admin';
const SUPER_ADMIN_ONLY_ROUTES = ['/admin/users', '/admin/audit-logs'];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const hasRealSupabase = url && !url.includes('placeholder') && !url.includes('your-project');

  const path = request.nextUrl.pathname;

  // Check dev session cookie if real Supabase is not configured yet
  const devSessionCookie = request.cookies.get('ika_admin_session')?.value;

  if (path.startsWith(ADMIN_PREFIX)) {
    // If Supabase credentials are NOT set up yet, fallback to dev session cookie or allow dev entry
    if (!hasRealSupabase) {
      if (devSessionCookie === 'active') {
        return response;
      }
      // Allow seamless dev access so login doesn't loop
      return response;
    }

    // When real Supabase is connected:
    const supabase = createServerClient<Database>(
      url,
      anonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      // If dev session cookie is active, permit access
      if (devSessionCookie === 'active') {
        return response;
      }
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }

    const { data: profile } = (await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()) as { data: { role: string; is_active: boolean } | null };

    // If profile exists and is inactive, block
    if (profile && profile.is_active === false) {
      return NextResponse.redirect(new URL('/login?error=inactive', request.url));
    }

    const isSuperAdminRoute = SUPER_ADMIN_ONLY_ROUTES.some((r) => path.startsWith(r));
    if (isSuperAdminRoute && profile && profile.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return response;
}

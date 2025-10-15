import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';
import type { AuthResponse } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Email and password are required',
          },
        },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: {
            code: error.code || 'AUTH_ERROR',
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    // Fetch user data
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Create response
    const response = NextResponse.json<AuthResponse>(
      {
        success: true,
        data: {
          user: userData,
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          },
        },
        message: 'Login successful',
      },
      { status: 200 }
    );

    // ✅ ADD EMAIL TO TRACKING COOKIE
    const existingEmails = request.cookies.get('user_emails')?.value || '';
    const emailsArray = existingEmails ? existingEmails.split(',') : [];
    
    if (!emailsArray.includes(email)) {
      emailsArray.push(email);
    }
    
    response.cookies.set('user_emails', emailsArray.join(','), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';
import type { SignupData, AuthResponse } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body: SignupData = await request.json();
    const { email, password, username, first_name, last_name, phone, role } = body;

    // Validation
    if (!email || !password || !username) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Email, password, and username are required',
          },
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Invalid email format',
          },
        },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Password must be at least 6 characters',
          },
        },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Check if username exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: {
            code: 'USERNAME_EXISTS',
            message: 'Username is already taken',
          },
        },
        { status: 409 }
      );
    }

    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email`,
        data: {
          username,
          first_name: first_name || null,
          last_name: last_name || null,
          phone: phone || null,
          role: role || 'customer',
        },
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: {
            code: authError.code || 'AUTH_ERROR',
            message: authError.message,
          },
        },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: {
            code: 'SIGNUP_FAILED',
            message: 'Failed to create user',
          },
        },
        { status: 500 }
      );
    }

    // Wait for trigger to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fetch user data
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    // Create response
    const response = NextResponse.json<AuthResponse>(
      {
        success: true,
        data: {
          user: userData || {
            id: authData.user.id,
            email: authData.user.email!,
            username,
            role: role || 'customer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          session: {
            access_token: authData.session?.access_token || '',
            refresh_token: authData.session?.refresh_token || '',
          },
        },
        message: 'Account created! Check your email to verify.',
      },
      { status: 201 }
    );

    // Add email to tracking cookie
    response.cookies.set('user_emails', email, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
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

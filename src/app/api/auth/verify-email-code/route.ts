import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: { message: 'Code is required' } },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Verification error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { success: false, error: { message: 'Verification failed' } },
        { status: 400 }
      );
    }

    // Get user data from public.users
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to verify email' } },
      { status: 500 }
    );
  }
}

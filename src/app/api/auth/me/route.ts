import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    // Get user data from public.users
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        email: user.email,
        email_verified: user.email_confirmed_at !== null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch user' } },
      { status: 500 }
    );
  }
}

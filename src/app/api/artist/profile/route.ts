import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

// GET - Fetch artist profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const { data: artistProfile, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      success: true,
      profile: artistProfile,
      hasProfile: !!artistProfile,
    });
  } catch (error: any) {
    console.error('Get artist profile error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

// POST - Create artist profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { display_name, bio, portfolio_url, instagram_handle, twitter_handle } = body;

    if (!display_name) {
      return NextResponse.json(
        { success: false, error: { message: 'Display name is required' } },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    // Check if profile already exists
    const { data: existing } = await supabase
      .from('artist_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Artist profile already exists' } },
        { status: 409 }
      );
    }

    // Create artist profile
    const { data: profile, error } = await supabase
      .from('artist_profiles')
      .insert({
        user_id: user.id,
        display_name,
        bio: bio || null,
        portfolio_url: portfolio_url || null,
        instagram_handle: instagram_handle || null,
        twitter_handle: twitter_handle || null,
        commission_rate: 30,
        is_verified: false,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    // Update user role to artist
    await supabase
      .from('users')
      .update({ role: 'artist' })
      .eq('id', user.id);

    return NextResponse.json({
      success: true,
      profile,
      message: 'Artist profile created successfully',
    });
  } catch (error: any) {
    console.error('Create artist profile error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

// PUT - Update artist profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { display_name, bio, portfolio_url, instagram_handle, twitter_handle, banner_image_url } = body;

    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const { data: profile, error } = await supabase
      .from('artist_profiles')
      .update({
        display_name: display_name || undefined,
        bio: bio || undefined,
        portfolio_url: portfolio_url || undefined,
        instagram_handle: instagram_handle || undefined,
        twitter_handle: twitter_handle || undefined,
        banner_image_url: banner_image_url || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update artist profile error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

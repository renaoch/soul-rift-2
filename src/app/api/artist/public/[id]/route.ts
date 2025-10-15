import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Changed to Promise
) {
  try {
    const { id } = await params;  // ← Added await
    const supabase = await createServerSupabaseClient();

    // Fetch artist profile with user data
    const { data: artist, error: artistError } = await supabase
      .from('artist_profiles')
      .select(`
        *,
        users (
          username,
          avatar_url,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (artistError || !artist) {
      return NextResponse.json(
        { success: false, error: { message: 'Artist not found' } },
        { status: 404 }
      );
    }

    // Fetch artist's designs
    const { data: designs, error: designsError } = await supabase
      .from('designs')
      .select('*')
      .eq('artist_id', id)
      .eq('is_public', true)
      .eq('is_approved', true)
      .order('view_count', { ascending: false });

    // Count total designs
    const { count: designCount } = await supabase
      .from('designs')
      .select('*', { count: 'exact', head: true })
      .eq('artist_id', id)
      .eq('is_public', true)
      .eq('is_approved', true);

    // Check if current user is following
    const { data: { user } } = await supabase.auth.getUser();
    let isFollowing = false;

    if (user) {
      const { data: followData } = await supabase
        .from('artist_followers')
        .select('id')
        .eq('artist_id', id)
        .eq('follower_user_id', user.id)
        .maybeSingle();

      isFollowing = !!followData;
    }

    return NextResponse.json({
      success: true,
      artist: {
        id: artist.id,
        name: artist.display_name,
        username: artist.users?.username || '',
        bio: artist.bio,
        avatar: artist.users?.avatar_url || '',
        banner: artist.banner_image_url,
        instagram: artist.instagram_handle,
        twitter: artist.twitter_handle,
        website: artist.portfolio_url,
        verified: artist.is_verified,
        joinDate: new Date(artist.users?.created_at).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }),
        stats: {
          designs: designCount || 0,
          sales: artist.total_sales?.toLocaleString() || '0',
          followers: artist.follower_count?.toLocaleString() || '0',
          revenue: `₹${artist.total_earnings?.toLocaleString() || '0'}`,
        },
        isFollowing,
      },
      designs: designs?.map(design => ({
        id: design.id,
        name: design.title,
        image: design.design_url,
        thumbnail: design.thumbnail_url,
        likes: design.like_count || 0,
        views: design.view_count || 0,
        price: 599, // Base price - you can calculate this differently
      })) || [],
    });
  } catch (error) {
    console.error('Artist fetch error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch artist' } },
      { status: 500 }
    );
  }
}

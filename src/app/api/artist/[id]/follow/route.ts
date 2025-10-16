import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: artistId } = params;
    const supabase = await createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    // Check if already following
    const { data: existing } = await supabase
      .from('artist_followers')
      .select('id')
      .eq('artist_id', artistId)
      .eq('follower_user_id', user.id)
      .maybeSingle();

    if (existing) {
      // Unfollow
      await supabase
        .from('artist_followers')
        .delete()
        .eq('artist_id', artistId)
        .eq('follower_user_id', user.id);

      // Decrement follower count
      await supabase.rpc('decrement_follower_count', { artist_id: artistId });

      return NextResponse.json({
        success: true,
        isFollowing: false,
      });
    } else {
      // Follow
      await supabase
        .from('artist_followers')
        .insert({
          artist_id: artistId,
          follower_user_id: user.id,
        });

      // Increment follower count
      await supabase.rpc('increment_follower_count', { artist_id: artistId });

      return NextResponse.json({
        success: true,
        isFollowing: true,
      });
    }
  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to update follow status' } },
      { status: 500 }
    );
  }
}

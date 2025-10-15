import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort') || 'popular';

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from('artist_profiles')
      .select(`
        *,
        users!inner (
          username,
          avatar_url
        )
      `)
      .eq('is_active', true);

    // Sorting
    switch (sortBy) {
      case 'followers':
        query = query.order('follower_count', { ascending: false });
        break;
      case 'designs':
        query = query.order('total_sales', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default: // popular
        query = query.order('total_sales', { ascending: false });
    }

    const { data: artists, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    // Get design count for each artist
    const artistsWithStats = await Promise.all(
      (artists || []).map(async (artist) => {
        const { count } = await supabase
          .from('designs')
          .select('*', { count: 'exact', head: true })
          .eq('artist_id', artist.id)
          .eq('is_public', true)
          .eq('is_approved', true);

        // Assign colors based on artist index
        const colors = ['#ff6b35', '#00d9ff', '#39ff14', '#ff3131', '#a855f7'];
        const colorIndex = artists.indexOf(artist) % colors.length;

        // users is a single object, not an array
        const user = Array.isArray(artist.users) ? artist.users[0] : artist.users;

        return {
          id: artist.id,
          name: artist.display_name,
          username: user?.username || '',
          bio: artist.bio || '',
          avatar: user?.avatar_url || '/placeholder-avatar.png',
          coverDesign: artist.banner_image_url || '/design1.png',
          verified: artist.is_verified,
          stats: {
            designs: count || 0,
            sales: artist.total_sales?.toLocaleString() || '0',
            followers: artist.follower_count?.toLocaleString() || '0',
          },
          color: colors[colorIndex],
          badge: artist.is_verified ? 'Verified' : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      artists: artistsWithStats,
    });
  } catch (error) {
    console.error('Artists fetch error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch artists' } },
      { status: 500 }
    );
  }
}

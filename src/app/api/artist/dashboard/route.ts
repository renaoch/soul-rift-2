import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    // Get artist profile
    const { data: artistProfile, error: profileError } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !artistProfile) {
      return NextResponse.json(
        { success: false, error: { message: 'Artist profile not found. Please create one first.' } },
        { status: 404 }
      );
    }

    // Fetch dashboard stats
    const artistId = artistProfile.id;

    // 1. Get total and pending earnings
    const { data: earningsData } = await supabase
      .from('artist_earnings')
      .select('amount, status')
      .eq('artist_id', artistId);

    const totalEarnings = earningsData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    const pendingEarnings = earningsData?.filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + Number(e.amount), 0) || 0;

    // 2. Get design stats
    const { data: designsData, count: totalDesigns } = await supabase
      .from('designs')
      .select('id, is_approved, view_count, like_count', { count: 'exact' })
      .eq('artist_id', artistId);

    const approvedDesigns = designsData?.filter(d => d.is_approved).length || 0;
    const pendingDesigns = designsData?.filter(d => !d.is_approved).length || 0;
    const totalViews = designsData?.reduce((sum, d) => sum + (d.view_count || 0), 0) || 0;
    const totalLikes = designsData?.reduce((sum, d) => sum + (d.like_count || 0), 0) || 0;

    // 3. Get total sales from order_items
    const { count: totalSales } = await supabase
      .from('order_items')
      .select('id', { count: 'exact' })
      .eq('artist_id', artistId);

    // 4. Get recent designs (last 5)
    const { data: recentDesigns } = await supabase
      .from('designs')
      .select('id, title, design_url, is_approved, view_count, like_count, use_count, created_at')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false })
      .limit(5);

    // 5. Get recent earnings (last 5)
    const { data: recentEarnings } = await supabase
      .from('artist_earnings')
      .select(`
        id,
        amount,
        commission_rate,
        status,
        created_at,
        orders (
          order_number
        )
      `)
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Compile stats
    const stats = {
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      pendingEarnings: Math.round(pendingEarnings * 100) / 100,
      totalSales: totalSales || 0,
      totalDesigns: totalDesigns || 0,
      approvedDesigns,
      pendingDesigns,
      rejectedDesigns: 0, // You can add rejection tracking later
      totalViews,
      totalLikes,
      followerCount: artistProfile.follower_count || 0,
    };

    return NextResponse.json({
      success: true,
      stats,
      recentDesigns: recentDesigns || [],
      recentEarnings: recentEarnings || [],
      artistProfile: {
        id: artistProfile.id,
        display_name: artistProfile.display_name,
        bio: artistProfile.bio,
        is_verified: artistProfile.is_verified,
        commission_rate: artistProfile.commission_rate,
      },
    });
  } catch (error: any) {
    console.error('Artist dashboard error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch dashboard data' } },
      { status: 500 }
    );
  }
}

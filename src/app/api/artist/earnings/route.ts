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
      .select('id, total_earnings, commission_rate')
      .eq('user_id', user.id)
      .single();

    if (profileError || !artistProfile) {
      return NextResponse.json(
        { success: false, error: { message: 'Artist profile not found' } },
        { status: 404 }
      );
    }

    // Get all earnings
    const { data: earnings, error: earningsError } = await supabase
      .from('artist_earnings')
      .select(`
        id,
        amount,
        commission_rate,
        status,
        payout_id,
        payout_date,
        created_at,
        orders (
          order_number,
          total_order_value,
          payment_status,
          order_status
        ),
        order_items (
          quantity,
          price,
          products (
            name,
            image_url
          ),
          designs (
            title,
            design_url
          )
        )
      `)
      .eq('artist_id', artistProfile.id)
      .order('created_at', { ascending: false });

    if (earningsError) {
      console.error('Earnings fetch error:', earningsError);
      return NextResponse.json(
        { success: false, error: { message: earningsError.message } },
        { status: 500 }
      );
    }

    // Calculate stats
    const totalEarnings = earnings?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    const pendingEarnings = earnings?.filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    const paidEarnings = earnings?.filter(e => e.status === 'paid')
      .reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    const totalTransactions = earnings?.length || 0;

    // Get monthly earnings (last 6 months)
    const monthlyData = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = date.toISOString();
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
      
      const monthEarnings = earnings?.filter(e => {
        const earnDate = new Date(e.created_at);
        return earnDate >= new Date(monthStart) && earnDate <= new Date(monthEnd);
      }).reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      monthlyData.push({
        month: date.toLocaleString('default', { month: 'short' }),
        earnings: Math.round(monthEarnings * 100) / 100,
      });
    }

    // Get recent payouts
    const { data: payouts } = await supabase
      .from('artist_payouts')
      .select('*')
      .eq('artist_id', artistProfile.id)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      stats: {
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        pendingEarnings: Math.round(pendingEarnings * 100) / 100,
        paidEarnings: Math.round(paidEarnings * 100) / 100,
        totalTransactions,
        commissionRate: artistProfile.commission_rate,
      },
      earnings: earnings || [],
      monthlyData,
      payouts: payouts || [],
    });
  } catch (error: any) {
    console.error('Earnings API error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

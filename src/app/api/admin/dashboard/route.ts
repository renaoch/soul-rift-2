import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user and check if admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized - Admin only' } },
        { status: 403 }
      );
    }

    // 1. Get total revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('total_order_value, platform_revenue, total_artist_commission, payment_status, created_at')
      .eq('payment_status', 'paid');

    const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_order_value), 0) || 0;
    const platformRevenue = orders?.reduce((sum, o) => sum + Number(o.platform_revenue), 0) || 0;
    const artistCommissions = orders?.reduce((sum, o) => sum + Number(o.total_artist_commission), 0) || 0;

    // 2. Get order stats
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true });

    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('order_status', 'created');

    const { count: processingOrders } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .in('order_status', ['processing', 'shipped']);

    const { count: completedOrders } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('order_status', 'delivered');

    // 3. Get user stats
    const { count: totalUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });

    const { count: totalArtists } = await supabase
      .from('artist_profiles')
      .select('id', { count: 'exact', head: true });

    const { count: activeArtists } = await supabase
      .from('artist_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    // 4. Get design stats
    const { count: totalDesigns } = await supabase
      .from('designs')
      .select('id', { count: 'exact', head: true });

    const { count: pendingDesigns } = await supabase
      .from('designs')
      .select('id', { count: 'exact', head: true })
      .eq('is_approved', false);

    const { count: approvedDesigns } = await supabase
      .from('designs')
      .select('id', { count: 'exact', head: true })
      .eq('is_approved', true);

    // 5. Get product stats
    const { count: totalProducts } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true });

    const { count: activeProducts } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    // 6. Get recent orders
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_order_value,
        payment_status,
        order_status,
        created_at,
        users (
          username,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // 7. Get pending designs for review
    const { data: pendingDesignsList } = await supabase
      .from('designs')
      .select(`
        id,
        title,
        design_url,
        created_at,
        artist_profiles (
          display_name
        )
      `)
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
      .limit(5);

    // 8. Calculate monthly revenue (last 6 months)
    const monthlyRevenue = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = date.toISOString();
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
      
      const monthOrders = orders?.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= new Date(monthStart) && orderDate <= new Date(monthEnd);
      }) || [];

      const revenue = monthOrders.reduce((sum, o) => sum + Number(o.total_order_value), 0);
      const platform = monthOrders.reduce((sum, o) => sum + Number(o.platform_revenue), 0);

      monthlyRevenue.push({
        month: date.toLocaleString('default', { month: 'short' }),
        revenue: Math.round(revenue * 100) / 100,
        platformRevenue: Math.round(platform * 100) / 100,
        orders: monthOrders.length,
      });
    }

    // 9. Get top artists
    const { data: topArtists } = await supabase
      .from('artist_profiles')
      .select('id, display_name, total_earnings, total_sales')
      .order('total_earnings', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      stats: {
        revenue: {
          total: Math.round(totalRevenue * 100) / 100,
          platform: Math.round(platformRevenue * 100) / 100,
          artistCommissions: Math.round(artistCommissions * 100) / 100,
        },
        orders: {
          total: totalOrders || 0,
          pending: pendingOrders || 0,
          processing: processingOrders || 0,
          completed: completedOrders || 0,
        },
        users: {
          total: totalUsers || 0,
          artists: totalArtists || 0,
          activeArtists: activeArtists || 0,
        },
        designs: {
          total: totalDesigns || 0,
          pending: pendingDesigns || 0,
          approved: approvedDesigns || 0,
        },
        products: {
          total: totalProducts || 0,
          active: activeProducts || 0,
        },
      },
      recentOrders: recentOrders || [],
      pendingDesigns: pendingDesignsList || [],
      monthlyRevenue,
      topArtists: topArtists || [],
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';

    // ✅ SINGLE QUERY with joins (works after adding FK)
    const { data: allOrders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        users!orders_user_id_fkey (
          id,
          username,
          email,
          phone
        ),
        shipping_addresses (
          first_name,
          last_name,
          phone,
          email,
          address1,
          address2,
          city,
          zip,
          province,
          country_code,
          awb,
          tracking_link
        )
      `)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Orders fetch error:', ordersError);
      return NextResponse.json(
        { success: false, error: { message: ordersError.message } },
        { status: 500 }
      );
    }

    console.log('Raw orders fetched:', allOrders?.length);

    // Transform
    const transformedOrders = allOrders?.map(order => {
      let user = null;
      if (Array.isArray(order.users) && order.users.length > 0) {
        user = order.users[0];
      } else if (order.users && !Array.isArray(order.users)) {
        user = order.users;
      }

      let shipping_address = null;
      if (Array.isArray(order.shipping_addresses) && order.shipping_addresses.length > 0) {
        shipping_address = order.shipping_addresses[0];
      } else if (order.shipping_addresses && !Array.isArray(order.shipping_addresses)) {
        shipping_address = order.shipping_addresses;
      }

      return {
        ...order,
        user,
        shipping_address,
      };
    }) || [];

    const stats = {
      total: transformedOrders.length,
      paid: transformedOrders.filter(o => o.payment_status === 'paid').length,
      pending: transformedOrders.filter(o => o.order_status === 'created' || o.order_status === 'pending').length,
      processing: transformedOrders.filter(o => o.order_status === 'processing').length,
      confirmed: transformedOrders.filter(o => o.order_status === 'confirmed').length,
      shipped: transformedOrders.filter(o => o.order_status === 'shipped').length,
      delivered: transformedOrders.filter(o => o.order_status === 'delivered').length,
      cancelled: transformedOrders.filter(o => o.order_status === 'cancelled').length,
      totalRevenue: transformedOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total_order_value), 0),
    };

    let filteredOrders = transformedOrders;

    if (status && status !== 'all') {
      if (status === 'pending') {
        filteredOrders = filteredOrders.filter(o => o.order_status === 'created' || o.order_status === 'pending');
      } else {
        filteredOrders = filteredOrders.filter(o => o.order_status === status);
      }
    }

    if (search) {
      filteredOrders = filteredOrders.filter(o => 
        o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.username?.toLowerCase().includes(search.toLowerCase())
      );
    }

    console.log('Filtered orders:', filteredOrders.length);

    return NextResponse.json({
      success: true,
      orders: filteredOrders,
      stats,
    });
  } catch (error: any) {
    console.error('Admin orders API error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, orderStatus, trackingLink, awb } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: { message: 'Order ID required' } },
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

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (orderStatus) {
      updateData.order_status = orderStatus;
      
      if (orderStatus === 'processing' && !updateData.live_date) {
        updateData.live_date = new Date().toISOString();
      }
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: { message: updateError.message } },
        { status: 500 }
      );
    }

    if (trackingLink || awb) {
      const shippingUpdate: any = {};
      if (trackingLink) shippingUpdate.tracking_link = trackingLink;
      if (awb) shippingUpdate.awb = awb;

      await supabase
        .from('shipping_addresses')
        .update(shippingUpdate)
        .eq('order_id', orderId);
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
    });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

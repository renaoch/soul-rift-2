import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // LOGGED IN: Fetch orders by user_id
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          payment_status,
          order_status,
          total_order_value,
          created_at,
          order_items (
            id,
            quantity,
            products (name, image_url),
            designs (title, design_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json(
          { success: false, error: { message: error.message } },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        orders: orders || [],
      });
    } else {
      // GUEST: Use email cookie fallback
      const userEmailsCookie = request.cookies.get('user_emails')?.value;

      if (!userEmailsCookie) {
        return NextResponse.json({
          success: true,
          orders: [],
          requiresAuth: true,
        });
      }

      const userEmails = userEmailsCookie.split(',');
      
      const { data: shippingAddresses } = await supabase
        .from('shipping_addresses')
        .select('order_id')
        .in('email', userEmails);

      if (!shippingAddresses || shippingAddresses.length === 0) {
        return NextResponse.json({
          success: true,
          orders: [],
        });
      }

      const orderIds = shippingAddresses.map(addr => addr.order_id);

      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          payment_status,
          order_status,
          total_order_value,
          created_at,
          order_items (
            id,
            quantity,
            products (name, image_url),
            designs (title, design_url)
          )
        `)
        .in('id', orderIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json(
          { success: false, error: { message: error.message } },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        orders: orders || [],
      });
    }
  } catch (error: any) {
    console.error('Orders list error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

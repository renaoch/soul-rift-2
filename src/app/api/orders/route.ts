import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SR-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shippingAddress, items, totalAmount } = body;

    const supabase = await createServerSupabaseClient();

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    const orderNumber = generateOrderNumber();

    // Calculate commissions
    let totalArtistCommission = 0;
    let platformRevenue = 0;

    items.forEach((item: any) => {
      const baseCost = item.price * 0.4;
      const artistCommission = item.artistId ? item.price * 0.3 : 0;
      const profit = item.price - baseCost - artistCommission;
      
      totalArtistCommission += artistCommission * item.quantity;
      platformRevenue += profit * item.quantity;
    });

    // Create order with user_id if logged in
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null, // Link to user if authenticated
        order_number: orderNumber,
        gateway: 'razorpay',
        payment_status: 'pending',
        order_status: 'created',
        qikink_shipping: true,
        total_order_value: totalAmount,
        platform_revenue: platformRevenue,
        total_artist_commission: totalArtistCommission,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { success: false, error: { message: orderError.message } },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item: any) => {
      const baseCost = item.price * 0.4;
      const artistCommission = item.artistId ? item.price * 0.3 : 0;
      const platformProfit = item.price - baseCost - artistCommission;

      return {
        order_id: order.id,
        product_id: item.productId,
        design_id: item.designId,
        artist_id: item.artistId,
        sku: `SKU-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        quantity: item.quantity,
        price: item.price,
        base_cost: baseCost,
        platform_profit: platformProfit,
        artist_commission: artistCommission,
        artist_commission_rate: item.artistId ? 30 : 0,
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { success: false, error: { message: itemsError.message } },
        { status: 500 }
      );
    }

    // Create shipping address
    await supabase.from('shipping_addresses').insert({
      order_id: order.id,
      first_name: shippingAddress.firstName,
      last_name: shippingAddress.lastName,
      address1: shippingAddress.address1,
      address2: shippingAddress.address2,
      phone: shippingAddress.phone,
      email: shippingAddress.email,
      city: shippingAddress.city,
      zip: shippingAddress.zip,
      province: shippingAddress.province,
      country_code: shippingAddress.countryCode,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      amount: totalAmount,
      currency: 'INR',
    });
  } catch (error: any) {
    console.error('Order error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: { message: 'Order ID required' } },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name, image_url),
          designs (title, design_url)
        ),
        shipping_addresses (*)
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: { message: 'Order not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch order' } },
      { status: 500 }
    );
  }
}

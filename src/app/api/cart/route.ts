import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch cart items
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    let cartItems;

    if (user) {
      // LOGGED IN: Fetch by user_id
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (name, image_url, selling_price),
          designs (title, design_url),
          artist_profiles (display_name)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      cartItems = data;
    } else {
      // GUEST: Fetch by session_id
      const sessionId = request.cookies.get('cart_session')?.value;

      if (!sessionId) {
        return NextResponse.json({ success: true, items: [] });
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (name, image_url, selling_price),
          designs (title, design_url),
          artist_profiles (display_name)
        `)
        .eq('session_id', sessionId)
        .is('user_id', null);

      if (error) throw error;
      cartItems = data;
    }

    const transformedItems = cartItems?.map(item => ({
      id: item.id,
      productId: item.product_id,
      designId: item.design_id,
      artistId: item.artist_id,
      name: item.designs?.title || item.products?.name || 'Product',
      artist: item.artist_profiles?.display_name || 'Unknown',
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.designs?.design_url || item.products?.image_url || '/placeholder.png',
      productColor: '#ff6b35',
    })) || [];

    return NextResponse.json({
      success: true,
      items: transformedItems,
    });
  } catch (error: any) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch cart' } },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, designId, artistId, quantity, size, color, price } = body;

    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    const cartItem: any = {
      product_id: productId,
      design_id: designId || null,
      artist_id: artistId || null,
      quantity: quantity || 1,
      size: size || 'M',
      color: color || 'Black',
      price: price,
    };

    if (user) {
      // LOGGED IN: Use user_id
      cartItem.user_id = user.id;
      cartItem.session_id = null;

      // Check if item already exists
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', size)
        .eq('color', color);

      if (existingItems && existingItems.length > 0) {
        // Update quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItems[0].quantity + (quantity || 1),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItems[0].id)
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json({
          success: true,
          id: data.id,
        });
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert(cartItem)
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json({
          success: true,
          id: data.id,
        });
      }
    } else {
      // GUEST: Use session_id
      let sessionId = request.cookies.get('cart_session')?.value;
      if (!sessionId) {
        sessionId = uuidv4();
      }

      cartItem.session_id = sessionId;
      cartItem.user_id = null;

      // Check if item already exists
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId)
        .is('user_id', null)
        .eq('product_id', productId)
        .eq('size', size)
        .eq('color', color);

      if (existingItems && existingItems.length > 0) {
        // Update quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItems[0].quantity + (quantity || 1),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItems[0].id)
          .select()
          .single();

        if (error) throw error;

        const response = NextResponse.json({
          success: true,
          id: data.id,
        });

        // Set session cookie
        response.cookies.set('cart_session', sessionId, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });

        return response;
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert(cartItem)
          .select()
          .single();

        if (error) throw error;

        const response = NextResponse.json({
          success: true,
          id: data.id,
        });

        // Set session cookie
        response.cookies.set('cart_session', sessionId, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });

        return response;
      }
    }
  } catch (error: any) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to add to cart' } },
      { status: 500 }
    );
  }
}

// DELETE - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // LOGGED IN: Clear by user_id
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    } else {
      // GUEST: Clear by session_id
      const sessionId = request.cookies.get('cart_session')?.value;

      if (!sessionId) {
        return NextResponse.json({ success: true });
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId)
        .is('user_id', null);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to clear cart' } },
      { status: 500 }
    );
  }
}

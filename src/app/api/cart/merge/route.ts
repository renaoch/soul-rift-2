import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    // Get session ID
    const sessionId = request.cookies.get('cart_session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ success: true, message: 'No guest cart to merge' });
    }

    // Get guest cart items
    const { data: guestItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .is('user_id', null);

    if (!guestItems || guestItems.length === 0) {
      return NextResponse.json({ success: true, message: 'No items to merge' });
    }

    // Get user's existing cart
    const { data: userItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);

    // Merge logic
    for (const guestItem of guestItems) {
      const existingItem = userItems?.find(
        item => 
          item.product_id === guestItem.product_id &&
          item.size === guestItem.size &&
          item.color === guestItem.color
      );

      if (existingItem) {
        // Update quantity
        await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + guestItem.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id);

        // Delete guest item
        await supabase
          .from('cart_items')
          .delete()
          .eq('id', guestItem.id);
      } else {
        // Transfer guest item to user
        await supabase
          .from('cart_items')
          .update({ 
            user_id: user.id,
            session_id: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', guestItem.id);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cart merged successfully',
      itemsMerged: guestItems.length 
    });
  } catch (error: any) {
    console.error('Cart merge error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

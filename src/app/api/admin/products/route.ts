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
    const status = searchParams.get('status'); // 'all', 'active', 'inactive'
    const search = searchParams.get('search') || '';

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Products fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    const stats = {
      total: products?.length || 0,
      active: products?.filter(p => p.is_active).length || 0,
      inactive: products?.filter(p => !p.is_active).length || 0,
    };

    return NextResponse.json({
      success: true,
      products: products || [],
      stats,
    });
  } catch (error: any) {
    console.error('Admin products API error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
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

    const productData = await request.json();

    // Calculate profit margin
    const profitMargin = productData.selling_price - productData.base_price;

    const { data: product, error: insertError } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        base_price: productData.base_price,
        selling_price: productData.selling_price,
        profit_margin: profitMargin,
        sku: productData.sku,
        size: productData.size,
        color: productData.color,
        material: productData.material,
        product_type: productData.product_type || 't-shirt',
        is_active: productData.is_active !== false,
        stock_status: productData.stock_status || 'in_stock',
        image_url: productData.image_url,
        images: productData.images || [],
        style: productData.style,
        is_trending: productData.is_trending || false,
        is_new: productData.is_new || false,
        badge: productData.badge,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { success: false, error: { message: insertError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully',
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

// PATCH - Update product
export async function PATCH(request: NextRequest) {
  try {
    const { productId, ...updateData } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: { message: 'Product ID required' } },
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

    // Recalculate profit margin if prices changed
    if (updateData.base_price || updateData.selling_price) {
      const { data: currentProduct } = await supabase
        .from('products')
        .select('base_price, selling_price')
        .eq('id', productId)
        .single();

      const basePrice = updateData.base_price || currentProduct?.base_price;
      const sellingPrice = updateData.selling_price || currentProduct?.selling_price;
      updateData.profit_margin = sellingPrice - basePrice;
    }

    updateData.updated_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: { message: updateError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: { message: 'Product ID required' } },
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

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: { message: deleteError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

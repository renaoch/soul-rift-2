import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filters
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const style = searchParams.get('style');
    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const sortBy = searchParams.get('sort') || 'popular';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from('products')
      .select(`
        *,
        product_designs (
          design_id,
          designs (
            id,
            title,
            design_url,
            thumbnail_url,
            artist_id,
            artist_profiles (
              display_name
            )
          )
        )
      `)
      .eq('is_active', true);

    // Apply filters
    if (priceMin) query = query.gte('selling_price', parseFloat(priceMin));
    if (priceMax) query = query.lte('selling_price', parseFloat(priceMax));
    if (style) query = query.eq('style', style);
    if (color) query = query.eq('color', color);
    if (size) query = query.eq('size', size);

    // Sorting
    switch (sortBy) {
      case 'popular':
        query = query.order('view_count', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'price_low':
        query = query.order('selling_price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('selling_price', { ascending: false });
        break;
      default:
        query = query.order('view_count', { ascending: false });
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Products fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    // Transform data to match your frontend structure
    const transformedProducts = products?.map(product => ({
      id: product.id,
      name: product.name,
      artist: product.product_designs?.[0]?.designs?.artist_profiles?.display_name || 'Unknown',
      artist_id: product.product_designs?.[0]?.designs?.artist_id,
      price: product.selling_price,
      image: product.product_designs?.[0]?.designs?.design_url || product.image_url,
      thumbnail: product.product_designs?.[0]?.designs?.thumbnail_url,
      likes: product.like_count || 0,
      views: product.view_count || 0,
      color: product.color || '#ff6b35',
      badge: product.badge,
      size: product.size,
      style: product.style,
      sku: product.sku,
    }));

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch products' } },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // UI-style params
    const q = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'popular'; // popular | newest | price_asc | price_desc
    const cat = searchParams.get('cat') || 'all'; // optional mapping to style/category
    const priceBucket = searchParams.get('price') || ''; // budget|standard|premium|luxury (optional)
    const stylesParam = (searchParams.get('styles') || '').split(',').filter(Boolean);
    const colorsParam = (searchParams.get('colors') || '').split(',').filter(Boolean);
    const sizesParam = (searchParams.get('sizes') || '').split(',').filter(Boolean);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    // Map price bucket to min/max (edit ranges as desired)
    let priceMin: number | null = null;
    let priceMax: number | null = null;
    switch (priceBucket) {
      case 'budget':
        priceMin = 0; priceMax = 500; break;
      case 'standard':
        priceMin = 500; priceMax = 1000; break;
      case 'premium':
        priceMin = 1000; priceMax = 2000; break;
      case 'luxury':
        priceMin = 2000; priceMax = null; break;
      default:
        // leave null
        break;
    }

    const supabase = await createServerSupabaseClient();

    // Base query: public facing, only active products
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
      `, { count: 'exact' })
      .eq('is_active', true);

    // Search across name and SKU
    if (q) {
      query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%`);
    }

    // Category → map to style when provided
    if (cat && cat !== 'all') {
      query = query.eq('style', cat);
    }

    // Price bucket
    if (priceMin !== null) query = query.gte('selling_price', priceMin);
    if (priceMax !== null) query = query.lte('selling_price', priceMax);

    // Multi-filters
    if (stylesParam.length) query = query.in('style', stylesParam);
    if (colorsParam.length) query = query.in('color', colorsParam.map(capitalizeFirst));
    if (sizesParam.length) query = query.in('size', sizesParam);

    // Sorting
    switch (sort) {
      case 'popular':
        query = query.order('view_count', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'price_asc':
        query = query.order('selling_price', { ascending: true });
        break;
      case 'price_desc':
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

    // Transform with In‑House fallbacks
    const transformed = (products || []).map((p: any) => {
      const rel = p.product_designs?.[0]?.designs;
      const artistName = rel?.artist_profiles?.display_name || 'In‑House Design';
      const artistId = rel?.artist_id || null;
      const image = rel?.design_url || p.image_url || '/placeholder.png';
      const thumbnail = rel?.thumbnail_url || p.image_url || null;

      return {
        id: p.id,
        name: p.name,
        artist: artistName,
        artist_id: artistId,
        price: p.selling_price,
        image,
        thumbnail,
        likes: p.like_count || 0,
        views: p.view_count || 0,
        color: p.color || '#ff6b35',
        badge: p.badge,
        size: p.size,
        style: p.style,
        sku: p.sku,
      };
    });

    return NextResponse.json({
      success: true,
      products: transformed,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (e: any) {
    console.error('Products API error:', e?.message || e);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch products' } },
      { status: 500 }
    );
  }
}

function capitalizeFirst(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

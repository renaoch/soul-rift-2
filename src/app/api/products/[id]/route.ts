import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        artist_profiles (
          id,
          display_name,
          is_verified,
          bio
        ),
        product_designs (
          design_id,
          designs (
            id,
            title,
            design_url,
            artist_id,
            artist_profiles (
              id,
              display_name,
              is_verified
            )
          )
        )
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .single();

    if (error || !product) {
      console.error('Product fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: 'Product not found' } },
        { status: 404 }
      );
    }

    // Transform to include artist from design if product doesn't have direct artist
    const transformedProduct = {
      ...product,
      artist_profiles: product.artist_profiles || 
        product.product_designs?.[0]?.designs?.artist_profiles || 
        { display_name: 'Unknown Artist', is_verified: false }
    };

    return NextResponse.json({
      success: true,
      product: transformedProduct,
    });
  } catch (error) {
    console.error('Product detail error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch product' } },
      { status: 500 }
    );
  }
}

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

    // Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'all', 'pending', 'approved'
    const search = searchParams.get('search') || '';

    // Build query - Get ALL designs first for stats
    const { data: allDesigns } = await supabase
      .from('designs')
      .select(`
        id,
        title,
        description,
        design_code,
        design_url,
        thumbnail_url,
        is_approved,
        is_public,
        view_count,
        like_count,
        use_count,
        file_size_kb,
        tags,
        created_at,
        artist_profiles (
          id,
          display_name,
          is_verified
        )
      `)
      .order('created_at', { ascending: false });

    // Calculate stats from ALL designs
    const stats = {
      total: allDesigns?.length || 0,
      approved: allDesigns?.filter(d => d.is_approved).length || 0,
      pending: allDesigns?.filter(d => !d.is_approved).length || 0,
    };

    // Now filter for display based on status
    let filteredDesigns = allDesigns || [];

    if (status === 'pending') {
      filteredDesigns = filteredDesigns.filter(d => !d.is_approved);
    } else if (status === 'approved') {
      filteredDesigns = filteredDesigns.filter(d => d.is_approved);
    }
    // 'all' shows everything

    // Apply search
    if (search) {
      filteredDesigns = filteredDesigns.filter(d => 
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.design_code.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      designs: filteredDesigns,
      stats,
    });
  } catch (error: any) {
    console.error('Admin designs API error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

// PATCH - Approve/Reject design
export async function PATCH(request: NextRequest) {
  try {
    const { designId, action, reason } = await request.json();

    if (!designId || !action) {
      return NextResponse.json(
        { success: false, error: { message: 'Design ID and action required' } },
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

    // Get design details
    const { data: design } = await supabase
      .from('designs')
      .select('artist_id, title')
      .eq('id', designId)
      .single();

    if (!design) {
      return NextResponse.json(
        { success: false, error: { message: 'Design not found' } },
        { status: 404 }
      );
    }

    // Update design status
    const updateData: any = {
      is_approved: action === 'approve',
      updated_at: new Date().toISOString(),
    };

    // If rejecting, hide the design
    if (action === 'reject') {
      updateData.is_public = false;
    }

    const { error: updateError } = await supabase
      .from('designs')
      .update(updateData)
      .eq('id', designId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { success: false, error: { message: updateError.message } },
        { status: 500 }
      );
    }

    // TODO: Send email notification to artist
    console.log(`Design ${action}ed:`, designId, reason || '');

    return NextResponse.json({
      success: true,
      message: `Design ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error: any) {
    console.error('Update design error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

// DELETE - Delete design
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const designId = searchParams.get('id');

    if (!designId) {
      return NextResponse.json(
        { success: false, error: { message: 'Design ID required' } },
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

    // Get design to get file path
    const { data: design } = await supabase
      .from('designs')
      .select('original_file_path, storage_bucket')
      .eq('id', designId)
      .single();

    if (!design) {
      return NextResponse.json(
        { success: false, error: { message: 'Design not found' } },
        { status: 404 }
      );
    }

    // Delete from storage
    if (design.original_file_path) {
      await supabase.storage
        .from(design.storage_bucket || 'designs')
        .remove([design.original_file_path]);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('designs')
      .delete()
      .eq('id', designId);

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: { message: deleteError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Design deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete design error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

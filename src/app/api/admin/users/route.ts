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
    const role = searchParams.get('role');
    const search = searchParams.get('search') || '';

    let query = supabase
      .from('users')
      .select(`
        *,
        artist_profiles (
          id,
          display_name,
          is_verified,
          is_active,
          total_earnings,
          total_sales
        )
      `)
      .order('created_at', { ascending: false });

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error('Users fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    const stats = {
      total: users?.length || 0,
      customers: users?.filter(u => u.role === 'customer').length || 0,
      artists: users?.filter(u => u.role === 'artist').length || 0,
      admins: users?.filter(u => u.role === 'admin').length || 0,
    };

    return NextResponse.json({
      success: true,
      users: users || [],
      stats,
    });
  } catch (error: any) {
    console.error('Admin users API error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

// PATCH - Update user role
export async function PATCH(request: NextRequest) {
  try {
    const { userId, role, adminSecret } = await request.json();

    console.log('PATCH request received:', { userId, role, hasSecret: !!adminSecret });

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: { message: 'User ID and role required' } },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
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

    if (userId === user.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Cannot change your own role' } },
        { status: 400 }
      );
    }

    // Check admin secret
    if (role === 'admin') {
      const secretCode = process.env.ADMIN_SECRET_CODE || 'SOULRIFT_ADMIN_2025';
      console.log('Admin promotion check - Secret valid:', adminSecret === secretCode);
      
      if (!adminSecret || adminSecret !== secretCode) {
        return NextResponse.json(
          { success: false, error: { message: 'Invalid admin secret code' } },
          { status: 403 }
        );
      }
    }

    console.log('Attempting to update user:', userId, 'to role:', role);

    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ 
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    console.log('Update result:', { updateData, updateError });

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { success: false, error: { message: updateError.message } },
        { status: 500 }
      );
    }

    if (!updateData || updateData.length === 0) {
      console.error('No rows updated - user not found or RLS policy blocked update');
      return NextResponse.json(
        { success: false, error: { message: 'Failed to update user - check RLS policies' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User role updated successfully',
      updated: updateData[0]
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

// DELETE - Ban user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    console.log('DELETE request for user:', userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { message: 'User ID required' } },
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

    if (userId === user.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Cannot ban your own account' } },
        { status: 400 }
      );
    }

    console.log('Attempting to ban user:', userId);

    const { data: banData, error: banError } = await supabase
      .from('users')
      .update({ 
        role: 'banned',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    console.log('Ban result:', { banData, banError });

    if (banError) {
      console.error('Ban error:', banError);
      return NextResponse.json(
        { success: false, error: { message: banError.message } },
        { status: 500 }
      );
    }

    if (!banData || banData.length === 0) {
      console.error('No rows updated - user not found or RLS policy blocked update');
      return NextResponse.json(
        { success: false, error: { message: 'Failed to ban user - check RLS policies' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User banned successfully',
      banned: banData[0]
    });
  } catch (error: any) {
    console.error('Ban user error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

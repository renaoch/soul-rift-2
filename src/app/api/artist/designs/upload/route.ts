import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/app/lib/supabase/server';

function generateDesignCode() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DSN-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    // Get artist profile
    const { data: artistProfile, error: profileError } = await supabase
      .from('artist_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !artistProfile) {
      return NextResponse.json(
        { success: false, error: { message: 'Artist profile not found' } },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tagsString = formData.get('tags') as string;
    const allow_commercial_use = formData.get('allow_commercial_use') === 'true';

    if (!file) {
      return NextResponse.json(
        { success: false, error: { message: 'No file uploaded' } },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { success: false, error: { message: 'Title is required' } },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: { message: 'Only image files are allowed' } },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: { message: 'File size must be less than 10MB' } },
        { status: 400 }
      );
    }

    // Generate unique design code
    const designCode = generateDesignCode();
    
    // Generate file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${artistProfile.id}/${designCode}.${fileExt}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('designs')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: { message: 'Failed to upload file' } },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('designs')
      .getPublicUrl(fileName);

    // Parse tags
    let tags: string[] = [];
    try {
      tags = tagsString ? JSON.parse(tagsString) : [];
    } catch (e) {
      tags = [];
    }

    // Calculate file size in KB
    const fileSizeKb = Math.round(file.size / 1024);

    // Insert design into database
    const { data: design, error: insertError } = await supabase
      .from('designs')
      .insert({
        artist_id: artistProfile.id,
        title,
        description: description || null,
        design_code: designCode,
        original_file_path: fileName,
        storage_bucket: 'designs',
        design_url: publicUrl,
        thumbnail_url: publicUrl,
        mockup_url: null,
        category_id: null, // Optional - can add later
        tags: tags.length > 0 ? tags : null,
        file_size_kb: fileSizeKb,
        is_public: true,
        is_approved: false,
        allow_commercial_use,
        view_count: 0,
        like_count: 0,
        use_count: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Clean up uploaded file
      await supabase.storage.from('designs').remove([fileName]);
      
      return NextResponse.json(
        { success: false, error: { message: 'Failed to save design' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      design: {
        id: design.id,
        title: design.title,
        design_code: design.design_code,
        design_url: design.design_url,
        is_approved: design.is_approved,
      },
      message: 'Design uploaded successfully! Pending approval.',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Upload failed' } },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/admin';
import { Storage } from '@google-cloud/storage';

const BUCKET_NAME = 'primeluxurystays';

// Initialize GCS client
function getStorageClient() {
  const credentialsBase64 = process.env.GCS_CREDENTIALS_BASE64;
  
  if (!credentialsBase64) {
    throw new Error('GCS_CREDENTIALS_BASE64 environment variable not set');
  }
  
  const credentials = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString('utf-8'));
  
  return new Storage({
    projectId: credentials.project_id,
    credentials,
  });
}

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return await validateSession(token);
}

// POST - Upload image to GCS
export async function POST(request: NextRequest) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertySlug = formData.get('propertySlug') as string;
    const propertyId = formData.get('propertyId') as string;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!propertySlug) {
      return NextResponse.json({ success: false, error: 'Property slug required' }, { status: 400 });
    }

    // Create safe filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${propertySlug}/${timestamp}-${safeName}`;
    
    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to GCS
    const storage = getStorageClient();
    const bucket = storage.bucket(BUCKET_NAME);
    const blob = bucket.file(storagePath);
    
    await blob.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });
    
    // Note: Bucket has uniform bucket-level access, so files inherit bucket's public access
    // No need to call makePublic() on individual files
    
    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${encodeURIComponent(storagePath).replace(/%2F/g, '/')}`;
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      storagePath,
      fileName: safeName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 });
  }
}


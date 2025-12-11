import { sql } from './db';
import { cookies } from 'next/headers';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

export interface PropertyImage {
  id: number;
  property_id: number;
  image_url: string;
  caption: string | null;
  display_order: number;
  is_featured: boolean;
}

export interface PropertyAvailability {
  id: number;
  property_id: number;
  start_date: string;
  end_date: string;
  price_per_week: number;
  price_per_night: number | null;
  min_nights: number;
  status: 'available' | 'booked' | 'blocked';
  notes: string | null;
}

// Generate a simple session token
function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Login function
export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const users = await sql`
      SELECT id, email, name, password_hash FROM admin_users 
      WHERE email = ${email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return { success: false, error: 'Invalid credentials' };
    }

    const user = users[0];
    
    // Simple password check (in production, use bcrypt)
    if (user.password_hash !== password) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Create session
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await sql`
      INSERT INTO admin_sessions (user_id, session_token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt})
    `;

    return { success: true, token };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

// Validate session
export async function validateSession(token: string): Promise<AdminUser | null> {
  try {
    const sessions = await sql`
      SELECT s.*, u.id as user_id, u.email, u.name
      FROM admin_sessions s
      JOIN admin_users u ON s.user_id = u.id
      WHERE s.session_token = ${token} AND s.expires_at > NOW()
      LIMIT 1
    `;

    if (sessions.length === 0) {
      return null;
    }

    return {
      id: sessions[0].user_id,
      email: sessions[0].email,
      name: sessions[0].name,
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

// Logout
export async function adminLogout(token: string): Promise<void> {
  await sql`DELETE FROM admin_sessions WHERE session_token = ${token}`;
}

// Get all properties (including inactive) for admin
export async function getAllPropertiesAdmin() {
  return await sql`
    SELECT * FROM properties 
    ORDER BY name ASC
  `;
}

// Get single property for admin
export async function getPropertyAdmin(id: number) {
  const properties = await sql`
    SELECT * FROM properties WHERE id = ${id} LIMIT 1
  `;
  return properties[0] || null;
}

// Update property - handled by API routes with explicit SQL
export async function updateProperty(id: number, data: Record<string, any>) {
  // This function is not used - updates are handled in API routes
  console.log('updateProperty called - use API route instead');
}

// Create property - handled by API routes with explicit SQL
export async function createProperty(data: Record<string, any>) {
  // This function is not used - creates are handled in API routes
  console.log('createProperty called - use API route instead');
  return null;
}

// Delete property
export async function deleteProperty(id: number) {
  await sql`DELETE FROM properties WHERE id = ${id}`;
}

// ===== IMAGES =====

export async function getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
  const images = await sql`
    SELECT * FROM property_images 
    WHERE property_id = ${propertyId}
    ORDER BY display_order ASC, id ASC
  `;
  return images as PropertyImage[];
}

export async function addPropertyImage(propertyId: number, imageUrl: string, caption?: string, isFeatured: boolean = false) {
  // Get max display order
  const maxOrder = await sql`
    SELECT COALESCE(MAX(display_order), 0) as max_order 
    FROM property_images 
    WHERE property_id = ${propertyId}
  `;
  
  const displayOrder = (maxOrder[0]?.max_order || 0) + 1;
  
  const result = await sql`
    INSERT INTO property_images (property_id, image_url, caption, display_order, is_featured)
    VALUES (${propertyId}, ${imageUrl}, ${caption || null}, ${displayOrder}, ${isFeatured})
    RETURNING id
  `;
  
  // If this is featured, update the property's featured_image
  if (isFeatured) {
    await sql`UPDATE properties SET featured_image = ${imageUrl} WHERE id = ${propertyId}`;
  }
  
  return result[0]?.id;
}

export async function deletePropertyImage(imageId: number) {
  await sql`DELETE FROM property_images WHERE id = ${imageId}`;
}

export async function setFeaturedImage(propertyId: number, imageId: number) {
  // Unset all featured for this property
  await sql`UPDATE property_images SET is_featured = false WHERE property_id = ${propertyId}`;
  
  // Set new featured
  const images = await sql`
    UPDATE property_images SET is_featured = true WHERE id = ${imageId}
    RETURNING image_url
  `;
  
  // Update property featured_image
  if (images[0]) {
    await sql`UPDATE properties SET featured_image = ${images[0].image_url} WHERE id = ${propertyId}`;
  }
}

// ===== AVAILABILITY =====

export async function getPropertyAvailability(propertyId: number): Promise<PropertyAvailability[]> {
  const availability = await sql`
    SELECT * FROM property_availability 
    WHERE property_id = ${propertyId}
    ORDER BY start_date ASC
  `;
  return availability as PropertyAvailability[];
}

export async function addAvailability(data: {
  property_id: number;
  start_date: string;
  end_date: string;
  price_per_week: number;
  price_per_night?: number;
  min_nights?: number;
  status?: string;
  notes?: string;
}) {
  const result = await sql`
    INSERT INTO property_availability (
      property_id, start_date, end_date, price_per_week, 
      price_per_night, min_nights, status, notes
    )
    VALUES (
      ${data.property_id}, ${data.start_date}, ${data.end_date}, ${data.price_per_week},
      ${data.price_per_night || null}, ${data.min_nights || 7}, ${data.status || 'available'}, ${data.notes || null}
    )
    RETURNING id
  `;
  return result[0]?.id;
}

export async function updateAvailability(id: number, data: Record<string, any>) {
  // This function is not used - updates are handled in API routes
  console.log('updateAvailability called - use API route instead');
}

export async function deleteAvailability(id: number) {
  await sql`DELETE FROM property_availability WHERE id = ${id}`;
}


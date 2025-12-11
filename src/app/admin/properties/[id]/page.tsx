import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { validateSession, getPropertyAdmin, getPropertyImages, getPropertyAvailability } from '@/lib/admin';
import PropertyEditor from './PropertyEditor';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyEditPage({ params }: Props) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const user = await validateSession(token);
  if (!user) {
    redirect('/admin/login');
  }

  // Handle "new" property
  if (id === 'new') {
    return <PropertyEditor property={null} images={[]} availability={[]} isNew={true} />;
  }

  const propertyId = parseInt(id, 10);
  if (isNaN(propertyId)) {
    notFound();
  }

  const property = await getPropertyAdmin(propertyId);
  if (!property) {
    notFound();
  }

  const images = await getPropertyImages(propertyId);
  const availability = await getPropertyAvailability(propertyId);

  return (
    <PropertyEditor 
      property={property as any} 
      images={images as any} 
      availability={availability as any}
      isNew={false}
    />
  );
}


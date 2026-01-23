import { Metadata } from 'next'
import AvailabilityClient from './AvailabilityClient'

export const metadata: Metadata = {
  title: 'Property Availability | Admin',
}

export default function AvailabilityPage() {
  return <AvailabilityClient />
}

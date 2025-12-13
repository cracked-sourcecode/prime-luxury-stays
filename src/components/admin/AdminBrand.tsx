import Link from 'next/link'

const LOGO_URL =
  'https://storage.googleapis.com/primeluxurystays/Logo%20no%20text%20(global%20header).png'

export function AdminBrand({
  subtitle = 'Admin Portal',
  compact = false,
}: {
  subtitle?: string
  compact?: boolean
}) {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <img
        src={LOGO_URL}
        alt="Prime Luxury Stays"
        className={compact ? 'h-9 w-9 object-contain' : 'h-10 w-10 object-contain'}
      />
      <div className="leading-tight">
        <div className="font-merriweather text-charcoal-900 text-lg">
          Prime Luxury Stays
        </div>
        <div className="text-[11px] tracking-[0.22em] uppercase text-gold-600">
          {subtitle}
        </div>
      </div>
    </Link>
  )
}



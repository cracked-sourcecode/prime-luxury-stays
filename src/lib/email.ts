import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Prime Luxury Stays <concierge@primeluxurystays.com>'
const ADMIN_EMAIL = 'concierge@primeluxurystays.com'

interface InquiryEmailData {
  fullName: string
  email: string
  phone?: string | null
  message?: string | null
  propertyName?: string | null
  propertyImage?: string | null
  propertySlug?: string | null
  propertyLocation?: string | null
  propertyBedrooms?: number | null
  propertyBathrooms?: number | null
  propertyMaxGuests?: number | null
  checkIn?: string | null
  checkOut?: string | null
  guests?: number | null
  sourceUrl?: string | null
}

const LOGO_URL = 'https://storage.googleapis.com/primeluxurystays/Company%20Logo'

// Admin email - Airbnb style
function getAdminEmailTemplate(data: InquiryEmailData): string {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
      })
    } catch { return dateStr }
  }

  const nights = (() => {
    if (!data.checkIn || !data.checkOut) return null
    try {
      const diff = Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : null
    } catch { return null }
  })()

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, address=no, email=no, date=no, url=no">
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding:20px 16px;">

<!-- Logo -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding-bottom:24px;">
<img src="${LOGO_URL}" alt="Prime Luxury Stays" width="140" style="display:block;border:0;">
</td>
</tr>
</table>

<!-- Main Heading -->
<h1 style="margin:0 0 24px;font-size:28px;font-weight:700;color:#222222;line-height:1.3;">
Respond to ${data.fullName.split(' ')[0]}'s inquiry
</h1>

<!-- Contact Card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr>
<td style="padding:20px;background:#f7f7f7;border-radius:12px;">

<p style="margin:0 0 4px;font-size:18px;font-weight:600;color:#222222;">${data.fullName}</p>
<p style="margin:0 0 16px;font-size:14px;color:#717171;">
<a href="mailto:${data.email}" style="color:#B8954C;text-decoration:none;">${data.email}</a>
${data.phone ? ` · <a href="tel:${data.phone}" style="color:#B8954C;text-decoration:none;">${data.phone}</a>` : ''}
</p>

${data.message ? `
<p style="margin:0;font-size:15px;color:#222222;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
` : ''}

</td>
</tr>
</table>

<!-- Reply Button -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
<tr>
<td style="background:#B8954C;border-radius:8px;">
<a href="mailto:${data.email}?subject=Re: Your Prime Luxury Stays Inquiry" style="display:inline-block;padding:14px 24px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">
Reply to Inquiry
</a>
</td>
</tr>
</table>

${data.propertyName ? `
<!-- Property Section -->
${data.propertyImage ? `
<img src="${data.propertyImage}" alt="${data.propertyName}" width="100%" style="display:block;border-radius:12px;margin-bottom:16px;">
` : ''}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr>
<td>
<p style="margin:0 0 4px;font-size:20px;font-weight:600;color:#222222;">${data.propertyName}</p>
${data.propertyLocation ? `<p style="margin:0 0 12px;font-size:14px;color:#717171;">${data.propertyLocation}</p>` : ''}

${data.propertyBedrooms || data.propertyBathrooms || data.propertyMaxGuests ? `
<p style="margin:0;font-size:14px;color:#717171;">
${data.propertyBedrooms ? `${data.propertyBedrooms} bedrooms` : ''}${data.propertyBathrooms ? ` · ${data.propertyBathrooms} baths` : ''}${data.propertyMaxGuests ? ` · Up to ${data.propertyMaxGuests} guests` : ''}
</p>
` : ''}
</td>
</tr>
</table>
` : ''}

${data.checkIn || data.guests ? `
<!-- Booking Details -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #dddddd;padding-top:20px;margin-bottom:24px;">
<tr>
<td>
<p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#717171;text-transform:uppercase;letter-spacing:0.5px;">Requested dates</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
${data.checkIn ? `
<td width="50%" valign="top">
<p style="margin:0 0 2px;font-size:12px;color:#717171;">CHECK-IN</p>
<p style="margin:0;font-size:16px;font-weight:600;color:#222222;">${formatDate(data.checkIn)}</p>
</td>
` : ''}
${data.checkOut ? `
<td width="50%" valign="top">
<p style="margin:0 0 2px;font-size:12px;color:#717171;">CHECK-OUT</p>
<p style="margin:0;font-size:16px;font-weight:600;color:#222222;">${formatDate(data.checkOut)}</p>
</td>
` : ''}
</tr>
</table>

${nights || data.guests ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
<tr>
${nights ? `
<td width="50%" valign="top">
<p style="margin:0 0 2px;font-size:12px;color:#717171;">DURATION</p>
<p style="margin:0;font-size:16px;font-weight:600;color:#222222;">${nights} night${nights > 1 ? 's' : ''}</p>
</td>
` : ''}
${data.guests ? `
<td width="50%" valign="top">
<p style="margin:0 0 2px;font-size:12px;color:#717171;">GUESTS</p>
<p style="margin:0;font-size:16px;font-weight:600;color:#222222;">${data.guests} guest${data.guests > 1 ? 's' : ''}</p>
</td>
` : ''}
</tr>
</table>
` : ''}

</td>
</tr>
</table>
` : ''}

<!-- Footer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #dddddd;padding-top:20px;">
<tr>
<td>
<p style="margin:0;font-size:12px;color:#717171;">
Prime Luxury Stays · Exclusive Villas & Estates
</p>
</td>
</tr>
</table>

</td>
</tr>
</table>

</body>
</html>`
}

// Customer email - Airbnb style
function getCustomerEmailTemplate(data: InquiryEmailData): string {
  const firstName = data.fullName.split(' ')[0]

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
      })
    } catch { return dateStr }
  }

  const nights = (() => {
    if (!data.checkIn || !data.checkOut) return null
    try {
      const diff = Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : null
    } catch { return null }
  })()

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, address=no, email=no, date=no, url=no">
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding:20px 16px;">

<!-- Logo -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding-bottom:24px;">
<img src="${LOGO_URL}" alt="Prime Luxury Stays" width="140" style="display:block;border:0;">
</td>
</tr>
</table>

<!-- Main Heading -->
<h1 style="margin:0 0 12px;font-size:28px;font-weight:700;color:#222222;line-height:1.3;">
Thanks for your inquiry, ${firstName}
</h1>

<p style="margin:0 0 24px;font-size:16px;color:#717171;line-height:1.5;">
We'll get back to you within 2 hours with availability and pricing details.
</p>

${data.propertyName ? `
<!-- Property Image -->
${data.propertyImage ? `
<a href="https://primeluxurystays.com/properties/${data.propertySlug || ''}" style="text-decoration:none;">
<img src="${data.propertyImage}" alt="${data.propertyName}" width="100%" style="display:block;border-radius:12px;margin-bottom:16px;">
</a>
` : ''}

<!-- Property Info -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr>
<td>
<p style="margin:0 0 4px;font-size:20px;font-weight:600;color:#222222;">
<a href="https://primeluxurystays.com/properties/${data.propertySlug || ''}" style="color:#222222;text-decoration:none;">${data.propertyName}</a>
</p>
${data.propertyLocation ? `<p style="margin:0 0 8px;font-size:14px;color:#717171;">${data.propertyLocation}</p>` : ''}

${data.propertyBedrooms || data.propertyBathrooms || data.propertyMaxGuests ? `
<p style="margin:0;font-size:14px;color:#717171;">
${data.propertyBedrooms ? `${data.propertyBedrooms} bedrooms` : ''}${data.propertyBathrooms ? ` · ${data.propertyBathrooms} baths` : ''}${data.propertyMaxGuests ? ` · Up to ${data.propertyMaxGuests} guests` : ''}
</p>
` : ''}
</td>
</tr>
</table>
` : ''}

${data.checkIn || data.guests ? `
<!-- Your Booking Request -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f7f7;border-radius:12px;padding:20px;margin-bottom:24px;">
<tr>
<td style="padding:20px;">
<p style="margin:0 0 16px;font-size:12px;font-weight:600;color:#717171;text-transform:uppercase;letter-spacing:0.5px;">Your request</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
${data.checkIn ? `
<td width="50%" valign="top" style="padding-bottom:16px;">
<p style="margin:0 0 2px;font-size:12px;color:#717171;">CHECK-IN</p>
<p style="margin:0;font-size:15px;font-weight:600;color:#222222;">${formatDate(data.checkIn)}</p>
</td>
` : ''}
${data.checkOut ? `
<td width="50%" valign="top" style="padding-bottom:16px;">
<p style="margin:0 0 2px;font-size:12px;color:#717171;">CHECK-OUT</p>
<p style="margin:0;font-size:15px;font-weight:600;color:#222222;">${formatDate(data.checkOut)}</p>
</td>
` : ''}
</tr>
<tr>
${nights ? `
<td width="50%" valign="top">
<p style="margin:0 0 2px;font-size:12px;color:#717171;">DURATION</p>
<p style="margin:0;font-size:15px;font-weight:600;color:#222222;">${nights} night${nights > 1 ? 's' : ''}</p>
</td>
` : ''}
${data.guests ? `
<td width="50%" valign="top">
<p style="margin:0 0 2px;font-size:12px;color:#717171;">GUESTS</p>
<p style="margin:0;font-size:15px;font-weight:600;color:#222222;">${data.guests} guest${data.guests > 1 ? 's' : ''}</p>
</td>
` : ''}
</tr>
</table>

</td>
</tr>
</table>
` : ''}

<!-- CTA Button -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
<tr>
<td style="background:#B8954C;border-radius:8px;">
<a href="https://primeluxurystays.com/properties" style="display:inline-block;padding:14px 24px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">
Browse more properties
</a>
</td>
</tr>
</table>

<!-- Help Section -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #dddddd;padding-top:20px;margin-bottom:24px;">
<tr>
<td>
<p style="margin:0 0 8px;font-size:14px;color:#222222;font-weight:600;">Need immediate assistance?</p>
<p style="margin:0;font-size:14px;color:#717171;">
Email us at <a href="mailto:concierge@primeluxurystays.com" style="color:#B8954C;text-decoration:none;">concierge@primeluxurystays.com</a>
</p>
</td>
</tr>
</table>

<!-- Footer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #dddddd;padding-top:20px;">
<tr>
<td>
<p style="margin:0 0 8px;font-size:12px;color:#717171;">
Prime Luxury Stays · Exclusive Villas & Estates
</p>
<p style="margin:0;font-size:12px;color:#717171;">
<a href="https://primeluxurystays.com/mallorca" style="color:#717171;text-decoration:none;">Mallorca</a> · 
<a href="https://primeluxurystays.com/ibiza" style="color:#717171;text-decoration:none;">Ibiza</a> · 
<a href="https://primeluxurystays.com/properties" style="color:#717171;text-decoration:none;">All Properties</a>
</p>
</td>
</tr>
</table>

</td>
</tr>
</table>

</body>
</html>`
}

export async function sendInquiryNotification(data: InquiryEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set, skipping email notification')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `${data.fullName} sent you an inquiry${data.propertyName ? ` · ${data.propertyName}` : ''}`,
      html: getAdminEmailTemplate(data),
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    console.log('Inquiry notification email sent:', emailData?.id)
    return { success: true, id: emailData?.id }
  } catch (err) {
    console.error('Failed to send inquiry notification:', err)
    return { success: false, error: String(err) }
  }
}

export async function sendInquiryConfirmation(data: InquiryEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set, skipping confirmation email')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.email],
      replyTo: ADMIN_EMAIL,
      subject: `We received your inquiry${data.propertyName ? ` for ${data.propertyName}` : ''}`,
      html: getCustomerEmailTemplate(data),
    })

    if (error) {
      console.error('Resend confirmation error:', error)
      return { success: false, error: error.message }
    }

    console.log('Confirmation email sent:', emailData?.id)
    return { success: true, id: emailData?.id }
  } catch (err) {
    console.error('Failed to send confirmation email:', err)
    return { success: false, error: String(err) }
  }
}

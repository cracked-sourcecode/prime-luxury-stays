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

// Brand colors from website
const GOLD = '#B8954C'
const CREAM = '#FAF8F4'
const CHARCOAL = '#1A1A1A'

const LOGO_URL = 'https://storage.googleapis.com/primeluxurystays/Company%20Logo'

function getAdminEmailTemplate(data: InquiryEmailData): string {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric' 
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

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>New Inquiry</title>
</head>
<body style="margin:0; padding:0; background-color:${CREAM}; font-family:Georgia, 'Times New Roman', serif;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${CREAM};">
<tr>
<td align="center" style="padding:30px 15px;">
<table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border:1px solid #e5e5e5;">

<!-- Logo -->
<tr>
<td align="center" style="padding:30px 30px 20px;">
<img src="${LOGO_URL}" alt="Prime Luxury Stays" width="200" height="auto" style="display:block; border:0;" />
</td>
</tr>

<!-- Gold Line -->
<tr>
<td style="padding:0 30px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr><td style="border-top:2px solid ${GOLD};"></td></tr>
</table>
</td>
</tr>

<!-- Heading -->
<tr>
<td style="padding:25px 30px 20px;">
<h1 style="margin:0; font-size:26px; font-weight:normal; color:${CHARCOAL}; font-family:Georgia, 'Times New Roman', serif;">
New inquiry from ${data.fullName}
</h1>
</td>
</tr>

<!-- Contact Details -->
<tr>
<td style="padding:0 30px 25px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${CREAM}; border-radius:8px;">
<tr>
<td style="padding:20px;">
<p style="margin:0 0 5px; font-size:13px; color:#888; text-transform:uppercase; letter-spacing:1px;">Contact</p>
<p style="margin:0 0 3px; font-size:18px; color:${CHARCOAL}; font-weight:bold;">${data.fullName}</p>
<p style="margin:0; font-size:15px;">
<a href="mailto:${data.email}" style="color:${GOLD}; text-decoration:none;">${data.email}</a>
${data.phone ? ` · <a href="tel:${data.phone}" style="color:${GOLD}; text-decoration:none;">${data.phone}</a>` : ''}
</p>
</td>
</tr>
</table>
</td>
</tr>

${data.message ? `
<!-- Message -->
<tr>
<td style="padding:0 30px 25px;">
<p style="margin:0 0 10px; font-size:13px; color:#888; text-transform:uppercase; letter-spacing:1px;">Message</p>
<p style="margin:0; font-size:16px; color:${CHARCOAL}; line-height:1.6; white-space:pre-wrap;">${data.message}</p>
</td>
</tr>
` : ''}

<!-- Reply Button -->
<tr>
<td style="padding:0 30px 30px;">
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="background-color:${GOLD}; border-radius:6px;">
<a href="mailto:${data.email}?subject=Re: Your Prime Luxury Stays Inquiry" style="display:inline-block; padding:14px 28px; font-size:16px; color:#ffffff; text-decoration:none; font-family:Georgia, 'Times New Roman', serif;">
Reply to ${data.fullName.split(' ')[0]}
</a>
</td>
</tr>
</table>
</td>
</tr>

${data.propertyName ? `
<!-- Property -->
<tr>
<td style="padding:0 30px 25px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e5e5e5; border-radius:8px; overflow:hidden;">
${data.propertyImage ? `
<tr>
<td>
<img src="${data.propertyImage}" alt="${data.propertyName}" width="538" height="300" style="display:block; width:100%; height:auto; object-fit:cover;" />
</td>
</tr>
` : ''}
<tr>
<td style="padding:20px;">
<p style="margin:0 0 5px; font-size:18px; color:${CHARCOAL}; font-weight:bold; font-family:Georgia, 'Times New Roman', serif;">${data.propertyName}</p>
${data.propertyLocation ? `<p style="margin:0; font-size:14px; color:#666;">${data.propertyLocation}</p>` : ''}
${data.propertyBedrooms || data.propertyBathrooms ? `
<p style="margin:8px 0 0; font-size:14px; color:#888;">
${data.propertyBedrooms ? `${data.propertyBedrooms} beds` : ''}${data.propertyBathrooms ? ` · ${data.propertyBathrooms} baths` : ''}${data.propertyMaxGuests ? ` · ${data.propertyMaxGuests} guests max` : ''}
</p>
` : ''}
</td>
</tr>
</table>
</td>
</tr>
` : ''}

${data.checkIn ? `
<!-- Dates -->
<tr>
<td style="padding:0 30px 30px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="50%" style="padding:15px 20px; background-color:${CREAM}; border-radius:8px 0 0 8px;">
<p style="margin:0 0 3px; font-size:12px; color:#888; text-transform:uppercase;">Check-in</p>
<p style="margin:0; font-size:16px; color:${CHARCOAL}; font-weight:bold;">${formatDate(data.checkIn)}</p>
</td>
<td width="50%" style="padding:15px 20px; background-color:${CREAM}; border-radius:0 8px 8px 0;">
<p style="margin:0 0 3px; font-size:12px; color:#888; text-transform:uppercase;">Check-out</p>
<p style="margin:0; font-size:16px; color:${CHARCOAL}; font-weight:bold;">${data.checkOut ? formatDate(data.checkOut) : 'TBD'}</p>
</td>
</tr>
</table>
${nights || data.guests ? `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:10px;">
<tr>
${nights ? `<td style="font-size:14px; color:${GOLD}; font-weight:bold;">${nights} nights</td>` : ''}
${data.guests ? `<td align="right" style="font-size:14px; color:#666;">${data.guests} guests</td>` : ''}
</tr>
</table>
` : ''}
</td>
</tr>
` : ''}

<!-- Footer -->
<tr>
<td style="padding:20px 30px; border-top:1px solid #e5e5e5;">
<p style="margin:0; font-size:13px; color:#888;">
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

function getCustomerEmailTemplate(data: InquiryEmailData): string {
  const firstName = data.fullName.split(' ')[0]

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric' 
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

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Thank You</title>
</head>
<body style="margin:0; padding:0; background-color:${CREAM}; font-family:Georgia, 'Times New Roman', serif;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${CREAM};">
<tr>
<td align="center" style="padding:30px 15px;">
<table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border:1px solid #e5e5e5;">

<!-- Logo -->
<tr>
<td align="center" style="padding:30px 30px 20px;">
<img src="${LOGO_URL}" alt="Prime Luxury Stays" width="200" height="auto" style="display:block; border:0;" />
</td>
</tr>

<!-- Gold Line -->
<tr>
<td style="padding:0 30px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr><td style="border-top:2px solid ${GOLD};"></td></tr>
</table>
</td>
</tr>

<!-- Heading -->
<tr>
<td style="padding:25px 30px 15px;">
<h1 style="margin:0; font-size:28px; font-weight:normal; color:${CHARCOAL}; font-family:Georgia, 'Times New Roman', serif;">
Thank you, ${firstName}
</h1>
</td>
</tr>

<!-- Subheading -->
<tr>
<td style="padding:0 30px 25px;">
<p style="margin:0; font-size:17px; color:#666; line-height:1.5;">
We've received your inquiry and will respond within <strong style="color:${GOLD};">2 hours</strong> with availability and pricing.
</p>
</td>
</tr>

${data.propertyName ? `
<!-- Property Card -->
<tr>
<td style="padding:0 30px 25px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e5e5e5; border-radius:8px; overflow:hidden;">
${data.propertyImage ? `
<tr>
<td>
<a href="https://primeluxurystays.com/properties/${data.propertySlug || ''}" style="text-decoration:none;">
<img src="${data.propertyImage}" alt="${data.propertyName}" width="538" height="300" style="display:block; width:100%; height:auto; object-fit:cover;" />
</a>
</td>
</tr>
` : ''}
<tr>
<td style="padding:20px;">
<p style="margin:0 0 5px; font-size:12px; color:${GOLD}; text-transform:uppercase; letter-spacing:1px;">Your Selection</p>
<p style="margin:0 0 5px; font-size:20px; color:${CHARCOAL}; font-weight:bold; font-family:Georgia, 'Times New Roman', serif;">
<a href="https://primeluxurystays.com/properties/${data.propertySlug || ''}" style="color:${CHARCOAL}; text-decoration:none;">${data.propertyName}</a>
</p>
${data.propertyLocation ? `<p style="margin:0; font-size:14px; color:#666;">${data.propertyLocation}</p>` : ''}
${data.propertyBedrooms || data.propertyBathrooms ? `
<p style="margin:10px 0 0; font-size:14px; color:#888;">
${data.propertyBedrooms ? `${data.propertyBedrooms} bedrooms` : ''}${data.propertyBathrooms ? ` · ${data.propertyBathrooms} baths` : ''}${data.propertyMaxGuests ? ` · Up to ${data.propertyMaxGuests} guests` : ''}
</p>
` : ''}
</td>
</tr>
</table>
</td>
</tr>
` : ''}

${data.checkIn ? `
<!-- Booking Details -->
<tr>
<td style="padding:0 30px 25px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${CREAM}; border-radius:8px;">
<tr>
<td style="padding:20px;">
<p style="margin:0 0 15px; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:1px;">Your Request</p>
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="50%">
<p style="margin:0 0 3px; font-size:12px; color:#888;">CHECK-IN</p>
<p style="margin:0; font-size:16px; color:${CHARCOAL}; font-weight:bold;">${formatDate(data.checkIn)}</p>
</td>
<td width="50%">
<p style="margin:0 0 3px; font-size:12px; color:#888;">CHECK-OUT</p>
<p style="margin:0; font-size:16px; color:${CHARCOAL}; font-weight:bold;">${data.checkOut ? formatDate(data.checkOut) : 'TBD'}</p>
</td>
</tr>
${nights || data.guests ? `
<tr>
<td colspan="2" style="padding-top:15px;">
${nights ? `<span style="font-size:15px; color:${GOLD}; font-weight:bold;">${nights} nights</span>` : ''}
${data.guests ? `<span style="font-size:15px; color:#666; margin-left:15px;">${data.guests} guests</span>` : ''}
</td>
</tr>
` : ''}
</table>
</td>
</tr>
</table>
</td>
</tr>
` : ''}

<!-- CTA Button -->
<tr>
<td align="center" style="padding:0 30px 30px;">
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="background-color:${GOLD}; border-radius:6px;">
<a href="https://primeluxurystays.com/properties" style="display:inline-block; padding:14px 28px; font-size:16px; color:#ffffff; text-decoration:none; font-family:Georgia, 'Times New Roman', serif;">
Browse More Properties
</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- Contact -->
<tr>
<td style="padding:0 30px 25px; border-top:1px solid #e5e5e5;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td style="padding-top:20px;">
<p style="margin:0 0 5px; font-size:14px; color:${CHARCOAL}; font-weight:bold;">Need immediate assistance?</p>
<p style="margin:0; font-size:14px; color:#666;">
Email us at <a href="mailto:concierge@primeluxurystays.com" style="color:${GOLD}; text-decoration:none;">concierge@primeluxurystays.com</a>
</p>
</td>
</tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:20px 30px; background-color:${CREAM};">
<p style="margin:0 0 10px; font-size:13px; color:#888;">
Prime Luxury Stays · Exclusive Villas & Estates
</p>
<p style="margin:0; font-size:13px;">
<a href="https://primeluxurystays.com/mallorca" style="color:${GOLD}; text-decoration:none;">Mallorca</a> · 
<a href="https://primeluxurystays.com/ibiza" style="color:${GOLD}; text-decoration:none;">Ibiza</a> · 
<a href="https://primeluxurystays.com/properties" style="color:${GOLD}; text-decoration:none;">All Properties</a>
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
      subject: `New inquiry from ${data.fullName}${data.propertyName ? ` · ${data.propertyName}` : ''}`,
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
      subject: `Thank you for your inquiry${data.propertyName ? ` · ${data.propertyName}` : ''}`,
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

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

const GOLD = '#B8954C'
const CREAM = '#FAF8F4'
const CHARCOAL = '#1A1A1A'
const LOGO_URL = 'https://storage.googleapis.com/primeluxurystays/Company%20Logo'

// Responsive styles for both desktop and mobile
const responsiveStyles = `
<style type="text/css">
  /* Desktop styles */
  .wrapper { width: 100%; background-color: ${CREAM}; }
  .container { width: 600px; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
  .content { padding: 0 40px; }
  .header { padding: 32px 40px 24px; }
  .footer { padding: 24px 40px; }
  .button { padding: 16px 32px; font-size: 16px; }
  .heading { font-size: 32px; }
  .subheading { font-size: 18px; }
  .property-title { font-size: 22px; }
  .property-details { font-size: 15px; }
  .dates-box { padding: 24px; }
  .date-label { font-size: 12px; }
  .date-value { font-size: 18px; }
  
  /* Mobile styles */
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; max-width: 100% !important; }
    .content { padding-left: 20px !important; padding-right: 20px !important; padding-bottom: 24px !important; }
    .header { padding: 24px 20px 20px !important; }
    .footer { padding: 20px !important; }
    .button { padding: 16px 24px !important; font-size: 15px !important; }
    .heading { font-size: 26px !important; }
    .subheading { font-size: 16px !important; }
    .property-title { font-size: 18px !important; }
    .property-details { font-size: 13px !important; }
    .date-label { font-size: 11px !important; }
    .date-value { font-size: 15px !important; }
    .logo { width: 160px !important; }
  }
</style>
`

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

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>New Inquiry</title>
${responsiveStyles}
</head>
<body style="margin:0; padding:0; background-color:${CREAM}; font-family:Georgia, 'Times New Roman', serif; -webkit-font-smoothing:antialiased;">

<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};">
<tr>
<td align="center" style="padding:24px 16px;">

<table class="container" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid #e0e0e0; border-radius:8px;">

<!-- Header -->
<tr>
<td class="header" align="center" style="padding:32px 40px 24px;">
<img class="logo" src="${LOGO_URL}" alt="Prime Luxury Stays" width="200" style="display:block; border:0; max-width:100%;">
<div style="margin-top:20px; border-top:2px solid ${GOLD}; width:60px;"></div>
</td>
</tr>

<!-- Heading -->
<tr>
<td class="content" style="padding:0 40px;">
<h1 class="heading" style="margin:0 0 24px; font-size:32px; font-weight:normal; color:${CHARCOAL}; line-height:1.2;">
New inquiry from ${data.fullName}
</h1>
</td>
</tr>

<!-- Contact Card -->
<tr>
<td class="content" style="padding:0 40px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM}; border-radius:8px;">
<tr>
<td style="padding:20px;">
<p style="margin:0 0 4px; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:1px;">Contact</p>
<p style="margin:0 0 8px; font-size:20px; color:${CHARCOAL}; font-weight:bold;">${data.fullName}</p>
<p style="margin:0; font-size:15px; line-height:1.6;">
<a href="mailto:${data.email}" style="color:${GOLD}; text-decoration:none;">${data.email}</a><br>
${data.phone ? `<a href="tel:${data.phone}" style="color:${GOLD}; text-decoration:none;">${data.phone}</a>` : ''}
</p>
</td>
</tr>
</table>
</td>
</tr>

${data.message ? `
<!-- Message -->
<tr>
<td class="content" style="padding:0 40px 24px;">
<p style="margin:0 0 8px; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:1px;">Message</p>
<p style="margin:0; font-size:16px; color:${CHARCOAL}; line-height:1.6; white-space:pre-wrap;">${data.message}</p>
</td>
</tr>
` : ''}

<!-- Reply Button -->
<tr>
<td class="content" style="padding:0 40px 32px;">
<table cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background-color:${GOLD}; border-radius:6px;">
<a class="button" href="mailto:${data.email}?subject=Re: Your Prime Luxury Stays Inquiry" style="display:inline-block; padding:16px 32px; font-size:16px; color:#ffffff; text-decoration:none; font-family:Georgia, serif;">
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
<td class="content" style="padding:0 40px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e0e0e0; border-radius:8px; overflow:hidden;">
${data.propertyImage ? `
<tr>
<td>
<img src="${data.propertyImage}" alt="${data.propertyName}" width="600" style="display:block; width:100%; height:auto;">
</td>
</tr>
` : ''}
<tr>
<td style="padding:20px;">
<p class="property-title" style="margin:0 0 6px; font-size:22px; color:${CHARCOAL}; font-weight:bold; font-family:Georgia, serif;">${data.propertyName}</p>
${data.propertyLocation ? `<p class="property-details" style="margin:0 0 8px; font-size:15px; color:#666;">${data.propertyLocation}</p>` : ''}
${data.propertyBedrooms || data.propertyBathrooms ? `
<p class="property-details" style="margin:0; font-size:14px; color:#888;">
${data.propertyBedrooms ? `${data.propertyBedrooms} beds` : ''}${data.propertyBathrooms ? ` · ${data.propertyBathrooms} baths` : ''}${data.propertyMaxGuests ? ` · ${data.propertyMaxGuests} guests` : ''}
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
<td class="content" style="padding:0 40px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM}; border-radius:8px;">
<tr>
<td class="dates-box" style="padding:24px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td class="stack" width="48%" valign="top">
<p class="date-label" style="margin:0 0 4px; font-size:12px; color:#888; text-transform:uppercase;">Check-in</p>
<p class="date-value" style="margin:0; font-size:18px; color:${CHARCOAL}; font-weight:bold;">${formatDate(data.checkIn)}</p>
</td>
<td width="4%"></td>
<td class="stack" width="48%" valign="top">
<p class="date-label" style="margin:0 0 4px; font-size:12px; color:#888; text-transform:uppercase;">Check-out</p>
<p class="date-value" style="margin:0; font-size:18px; color:${CHARCOAL}; font-weight:bold;">${data.checkOut ? formatDate(data.checkOut) : 'TBD'}</p>
</td>
</tr>
</table>
${nights || data.guests ? `
<p style="margin:16px 0 0; font-size:15px;">
${nights ? `<strong style="color:${GOLD};">${nights} nights</strong>` : ''}
${data.guests ? `<span style="color:#666; margin-left:16px;">${data.guests} guests</span>` : ''}
</p>
` : ''}
</td>
</tr>
</table>
</td>
</tr>
` : ''}

<!-- Footer -->
<tr>
<td class="footer" style="padding:24px 40px; border-top:1px solid #e0e0e0;">
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

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Thank You</title>
${responsiveStyles}
</head>
<body style="margin:0; padding:0; background-color:${CREAM}; font-family:Georgia, 'Times New Roman', serif; -webkit-font-smoothing:antialiased;">

<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};">
<tr>
<td align="center" style="padding:24px 16px;">

<table class="container" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid #e0e0e0; border-radius:8px;">

<!-- Header -->
<tr>
<td class="header" align="center" style="padding:32px 40px 24px;">
<img class="logo" src="${LOGO_URL}" alt="Prime Luxury Stays" width="200" style="display:block; border:0; max-width:100%;">
<div style="margin-top:20px; border-top:2px solid ${GOLD}; width:60px;"></div>
</td>
</tr>

<!-- Heading -->
<tr>
<td class="content" style="padding:0 40px;">
<h1 class="heading" style="margin:0 0 16px; font-size:32px; font-weight:normal; color:${CHARCOAL}; line-height:1.2;">
Thank you, ${firstName}
</h1>
<p class="subheading" style="margin:0 0 32px; font-size:18px; color:#666; line-height:1.5;">
We've received your inquiry and will respond within <strong style="color:${GOLD};">2 hours</strong> with availability and pricing.
</p>
</td>
</tr>

${data.propertyName ? `
<!-- Property Card -->
<tr>
<td class="content" style="padding:0 40px 28px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e0e0e0; border-radius:8px; overflow:hidden;">
${data.propertyImage ? `
<tr>
<td>
<a href="https://primeluxurystays.com/properties/${data.propertySlug || ''}" style="text-decoration:none;">
<img src="${data.propertyImage}" alt="${data.propertyName}" width="600" style="display:block; width:100%; height:auto;">
</a>
</td>
</tr>
` : ''}
<tr>
<td style="padding:20px;">
<p style="margin:0 0 4px; font-size:11px; color:${GOLD}; text-transform:uppercase; letter-spacing:1px; font-weight:bold;">Your Selection</p>
<p class="property-title" style="margin:0 0 6px; font-size:20px; color:${CHARCOAL}; font-weight:bold; font-family:Georgia, serif;">
<a href="https://primeluxurystays.com/properties/${data.propertySlug || ''}" style="color:${CHARCOAL}; text-decoration:none;">${data.propertyName}</a>
</p>
${data.propertyLocation ? `<p class="property-details" style="margin:0 0 8px; font-size:14px; color:#666;">${data.propertyLocation}</p>` : ''}
${data.propertyBedrooms || data.propertyBathrooms ? `
<p class="property-details" style="margin:0; font-size:13px; color:#888;">
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
<td class="content" style="padding:0 40px 28px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM}; border-radius:8px;">
<tr>
<td style="padding:20px;">
<p style="margin:0 0 14px; font-size:11px; color:#888; text-transform:uppercase; letter-spacing:1px; font-weight:bold;">Your Request</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="48%" valign="top">
<p class="date-label" style="margin:0 0 4px; font-size:11px; color:#888; text-transform:uppercase;">Check-in</p>
<p class="date-value" style="margin:0; font-size:16px; color:${CHARCOAL}; font-weight:bold;">${formatDate(data.checkIn)}</p>
</td>
<td width="4%"></td>
<td width="48%" valign="top">
<p class="date-label" style="margin:0 0 4px; font-size:11px; color:#888; text-transform:uppercase;">Check-out</p>
<p class="date-value" style="margin:0; font-size:16px; color:${CHARCOAL}; font-weight:bold;">${data.checkOut ? formatDate(data.checkOut) : 'TBD'}</p>
</td>
</tr>
</table>
${nights || data.guests ? `
<p style="margin:14px 0 0; font-size:14px;">
${nights ? `<strong style="color:${GOLD};">${nights} nights</strong>` : ''}
${data.guests ? `<span style="color:#666; margin-left:14px;">${data.guests} guests</span>` : ''}
</p>
` : ''}
</td>
</tr>
</table>
</td>
</tr>
` : ''}

<!-- CTA Button -->
<tr>
<td class="content" align="center" style="padding:0 40px 32px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="background-color:${GOLD}; border-radius:6px;">
<a class="button" href="https://primeluxurystays.com/properties" style="display:block; padding:16px 28px; font-size:15px; color:#ffffff; text-decoration:none; font-family:Georgia, serif; text-align:center;">
Browse More Properties
</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td class="footer" style="padding:28px 24px; background-color:#2a2a2a; text-align:center; border-radius:0 0 8px 8px;">
<p style="margin:0 0 8px; font-size:14px; font-weight:bold; color:#ffffff;">Need immediate assistance?</p>
<p style="margin:0 0 16px; font-size:14px;">
<a href="mailto:concierge@primeluxurystays.com" style="color:${GOLD}; text-decoration:none;">concierge@primeluxurystays.com</a>
</p>
<p style="margin:0 0 8px; font-size:12px; color:#999;">Prime Luxury Stays · Exclusive Villas & Estates</p>
<p style="margin:0; font-size:12px; line-height:1.6;">
<a href="https://primeluxurystays.com/mallorca" style="color:${GOLD}; text-decoration:none;">Mallorca</a>
<span style="color:#666;"> · </span>
<a href="https://primeluxurystays.com/ibiza" style="color:${GOLD}; text-decoration:none;">Ibiza</a>
<span style="color:#666;"> · </span>
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

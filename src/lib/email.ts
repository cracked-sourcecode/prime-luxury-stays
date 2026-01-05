import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Prime Luxury Stays <info@primeluxurystays.com>'
const ADMIN_EMAIL = 'info@primeluxurystays.com'

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
  locale?: string
}

// Translation strings for emails
const emailTranslations = {
  en: {
    newInquiry: 'New Inquiry',
    inquiryFrom: 'from',
    property: 'Property',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    nights: 'nights',
    guests: 'Guests',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    contactDetails: 'Contact Details',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    viewInquiry: 'View in Admin',
    thankYou: 'Thank You for Your Inquiry',
    confirmationIntro: 'We have received your inquiry and our team will be in touch shortly.',
    yourInquiry: 'Your Inquiry',
    yourDetails: 'Your Details',
    whatNext: 'What Happens Next?',
    step1: 'Our team is reviewing your inquiry',
    step2: 'We\'ll confirm availability promptly',
    step3: 'Personalized booking confirmation',
    questions: 'Questions?',
    footer: 'Prime Luxury Stays · Mallorca · Ibiza · All Properties',
    browseMore: 'Browse More Properties',
    thankYouSubject: 'Thank you for your inquiry',
    yourSelection: 'Your Selection',
    allProperties: 'All Properties',
  },
  de: {
    newInquiry: 'Neue Anfrage',
    inquiryFrom: 'von',
    property: 'Immobilie',
    checkIn: 'Anreise',
    checkOut: 'Abreise',
    nights: 'Nächte',
    guests: 'Gäste',
    bedrooms: 'Schlafzimmer',
    bathrooms: 'Badezimmer',
    contactDetails: 'Kontaktdaten',
    name: 'Name',
    email: 'E-Mail',
    phone: 'Telefon',
    message: 'Nachricht',
    viewInquiry: 'Im Admin Ansehen',
    thankYou: 'Vielen Dank für Ihre Anfrage',
    confirmationIntro: 'Wir haben Ihre Anfrage erhalten und unser Team wird sich in Kürze bei Ihnen melden.',
    yourInquiry: 'Ihre Anfrage',
    yourDetails: 'Ihre Daten',
    whatNext: 'Wie geht es weiter?',
    step1: 'Unser Team prüft Ihre Anfrage',
    step2: 'Wir bestätigen die Verfügbarkeit zeitnah',
    step3: 'Personalisierte Buchungsbestätigung',
    questions: 'Fragen?',
    footer: 'Prime Luxury Stays · Mallorca · Ibiza · Alle Immobilien',
    browseMore: 'Weitere Immobilien entdecken',
    thankYouSubject: 'Vielen Dank für Ihre Anfrage',
    yourSelection: 'Ihre Auswahl',
    allProperties: 'Alle Immobilien',
  }
}

const getT = (locale: string = 'en') => {
  return emailTranslations[locale as keyof typeof emailTranslations] || emailTranslations.en
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
  const t = getT(data.locale)
  const isGerman = data.locale === 'de'

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(isGerman ? 'de-DE' : 'en-US', { 
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
${isGerman ? `Vielen Dank, ${firstName}` : `Thank you, ${firstName}`}
</h1>
<p class="subheading" style="margin:0 0 32px; font-size:18px; color:#666; line-height:1.5;">
${t.confirmationIntro}
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
<p style="margin:0 0 4px; font-size:11px; color:${GOLD}; text-transform:uppercase; letter-spacing:1px; font-weight:bold;">${t.yourSelection}</p>
<p class="property-title" style="margin:0 0 6px; font-size:20px; color:${CHARCOAL}; font-weight:bold; font-family:Georgia, serif;">
<a href="https://primeluxurystays.com/properties/${data.propertySlug || ''}" style="color:${CHARCOAL}; text-decoration:none;">${data.propertyName}</a>
</p>
${data.propertyLocation ? `<p class="property-details" style="margin:0 0 8px; font-size:14px; color:#666;">${data.propertyLocation}</p>` : ''}
${data.propertyBedrooms || data.propertyBathrooms ? `
<p class="property-details" style="margin:0; font-size:13px; color:#888;">
${data.propertyBedrooms ? `${data.propertyBedrooms} ${t.bedrooms}` : ''}${data.propertyBathrooms ? ` · ${data.propertyBathrooms} ${t.bathrooms}` : ''}${data.propertyMaxGuests ? ` · ${data.propertyMaxGuests} ${t.guests}` : ''}
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
<p style="margin:0 0 14px; font-size:11px; color:#888; text-transform:uppercase; letter-spacing:1px; font-weight:bold;">${t.yourInquiry}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="48%" valign="top">
<p class="date-label" style="margin:0 0 4px; font-size:11px; color:#888; text-transform:uppercase;">${t.checkIn}</p>
<p class="date-value" style="margin:0; font-size:16px; color:${CHARCOAL}; font-weight:bold;">${formatDate(data.checkIn)}</p>
</td>
<td width="4%"></td>
<td width="48%" valign="top">
<p class="date-label" style="margin:0 0 4px; font-size:11px; color:#888; text-transform:uppercase;">${t.checkOut}</p>
<p class="date-value" style="margin:0; font-size:16px; color:${CHARCOAL}; font-weight:bold;">${data.checkOut ? formatDate(data.checkOut) : 'TBD'}</p>
</td>
</tr>
</table>
${nights || data.guests ? `
<p style="margin:14px 0 0; font-size:14px;">
${nights ? `<strong style="color:${GOLD};">${nights} ${t.nights}</strong>` : ''}
${data.guests ? `<span style="color:#666; margin-left:14px;">${data.guests} ${t.guests}</span>` : ''}
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
<a class="button" href="https://primeluxurystays.com/properties${isGerman ? '?lang=de' : ''}" style="display:block; padding:16px 28px; font-size:15px; color:#ffffff; text-decoration:none; font-family:Georgia, serif; text-align:center;">
${t.browseMore}
</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td class="footer" style="padding:24px 20px; background-color:${CREAM}; text-align:center; border-top:1px solid #e0e0e0;">
<p style="margin:0 0 8px; font-size:15px; color:${CHARCOAL};">${t.questions} <a href="mailto:info@primeluxurystays.com" style="color:${GOLD}; text-decoration:none; font-weight:bold;">info@primeluxurystays.com</a></p>
<p style="margin:0; font-size:14px; color:#666;">Prime Luxury Stays · <a href="https://primeluxurystays.com/mallorca${isGerman ? '?lang=de' : ''}" style="color:${GOLD}; text-decoration:none;">Mallorca</a> · <a href="https://primeluxurystays.com/ibiza${isGerman ? '?lang=de' : ''}" style="color:${GOLD}; text-decoration:none;">Ibiza</a> · <a href="https://primeluxurystays.com/properties${isGerman ? '?lang=de' : ''}" style="color:${GOLD}; text-decoration:none;">${t.allProperties}</a></p>
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

  const t = getT(data.locale)
  
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.email],
      replyTo: ADMIN_EMAIL,
      subject: `${t.thankYouSubject}${data.propertyName ? ` · ${data.propertyName}` : ''}`,
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

import { Resend } from 'resend'

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY)

// Email addresses
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

// Admin notification email template
function getAdminEmailTemplate(data: InquiryEmailData): string {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    } catch {
      return dateStr
    }
  }

  const calculateNights = () => {
    if (!data.checkIn || !data.checkOut) return null
    try {
      const start = new Date(data.checkIn)
      const end = new Date(data.checkOut)
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : null
    } catch {
      return null
    }
  }

  const nights = calculateNights()

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F4; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF8F4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden;">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="background-color: #1A1A1A; padding: 25px 40px;">
              <img src="${LOGO_URL}" alt="Prime Luxury Stays" width="180" style="display: block;" />
            </td>
          </tr>

          <!-- Gold Banner -->
          <tr>
            <td align="center" style="background-color: #B8954C; padding: 15px 40px;">
              <p style="margin: 0; color: #FFFFFF; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
                ★ NEW LEAD RECEIVED ★
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 35px 40px;">
              
              <!-- Contact Info -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAFAFA; border: 1px solid #E5E5E5; border-radius: 6px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px 25px;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #1A1A1A;">👤 Contact Information</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Name</span><br/>
                          <span style="font-size: 15px; font-weight: bold; color: #1A1A1A;">${data.fullName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Email</span><br/>
                          <a href="mailto:${data.email}" style="font-size: 15px; color: #B8954C; text-decoration: none;">${data.email}</a>
                        </td>
                      </tr>
                      ${data.phone ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Phone</span><br/>
                          <a href="tel:${data.phone}" style="font-size: 15px; color: #B8954C; text-decoration: none;">${data.phone}</a>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              ${data.propertyName ? `
              <!-- Property Card with Image -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 2px solid #B8954C; border-radius: 8px; margin-bottom: 25px; overflow: hidden;">
                ${data.propertyImage ? `
                <tr>
                  <td>
                    <img src="${data.propertyImage}" alt="${data.propertyName}" width="100%" style="display: block; max-height: 250px; object-fit: cover;" />
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 20px 25px; background-color: #FAFAFA;">
                    <p style="margin: 0 0 5px 0; font-size: 11px; color: #B8954C; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Property Inquiry</p>
                    <p style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold; color: #1A1A1A;">${data.propertyName}</p>
                    ${data.propertyLocation ? `<p style="margin: 0; font-size: 14px; color: #666666;">📍 ${data.propertyLocation}</p>` : ''}
                    
                    ${data.propertyBedrooms || data.propertyBathrooms || data.propertyMaxGuests ? `
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 12px;">
                      <tr>
                        ${data.propertyBedrooms ? `<td style="padding-right: 20px;"><span style="font-size: 13px; color: #666666;">🛏 ${data.propertyBedrooms} Beds</span></td>` : ''}
                        ${data.propertyBathrooms ? `<td style="padding-right: 20px;"><span style="font-size: 13px; color: #666666;">🚿 ${data.propertyBathrooms} Baths</span></td>` : ''}
                        ${data.propertyMaxGuests ? `<td><span style="font-size: 13px; color: #666666;">👥 Up to ${data.propertyMaxGuests}</span></td>` : ''}
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
              ` : ''}

              ${data.checkIn || data.checkOut || data.guests ? `
              <!-- Booking Breakdown -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FBF9F5; border: 1px solid #E8D9B5; border-radius: 6px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px 25px;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #1A1A1A;">📅 Booking Request</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${data.checkIn ? `
                      <tr>
                        <td width="50%" style="padding: 10px 0; border-bottom: 1px solid #E8D9B5;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Check-in</span><br/>
                          <span style="font-size: 15px; font-weight: bold; color: #1A1A1A;">${formatDate(data.checkIn)}</span>
                        </td>
                        <td width="50%" style="padding: 10px 0; border-bottom: 1px solid #E8D9B5;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Check-out</span><br/>
                          <span style="font-size: 15px; font-weight: bold; color: #1A1A1A;">${data.checkOut ? formatDate(data.checkOut) : 'TBD'}</span>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        ${nights ? `
                        <td width="50%" style="padding: 10px 0;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Duration</span><br/>
                          <span style="font-size: 15px; font-weight: bold; color: #B8954C;">${nights} Night${nights > 1 ? 's' : ''}</span>
                        </td>
                        ` : ''}
                        ${data.guests ? `
                        <td width="50%" style="padding: 10px 0;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Guests</span><br/>
                          <span style="font-size: 15px; font-weight: bold; color: #1A1A1A;">${data.guests} Guest${data.guests > 1 ? 's' : ''}</span>
                        </td>
                        ` : ''}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              ${data.message ? `
              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #1A1A1A;">💬 Message</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAFAFA; border: 1px solid #E5E5E5; border-radius: 6px;">
                      <tr>
                        <td style="padding: 18px 20px;">
                          <p style="margin: 0; font-size: 14px; color: #444444; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 10px 0 20px 0;">
                    <a href="mailto:${data.email}?subject=Re: Your Prime Luxury Stays Inquiry${data.propertyName ? ` - ${data.propertyName}` : ''}" 
                       style="display: inline-block; background-color: #B8954C; color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 14px;">
                      Reply to ${data.fullName.split(' ')[0]}
                    </a>
                  </td>
                </tr>
              </table>

              ${data.sourceUrl ? `
              <p style="margin: 15px 0 0 0; text-align: center; color: #AAAAAA; font-size: 11px;">
                Source: ${data.sourceUrl}
              </p>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #1A1A1A; padding: 20px 40px;">
              <p style="margin: 0; color: #888888; font-size: 12px;">
                Prime Luxury Stays · Exclusive Villas &amp; Estates
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// Customer confirmation email template
function getCustomerEmailTemplate(data: InquiryEmailData): string {
  const firstName = data.fullName.split(' ')[0]

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    } catch {
      return dateStr
    }
  }

  const calculateNights = () => {
    if (!data.checkIn || !data.checkOut) return null
    try {
      const start = new Date(data.checkIn)
      const end = new Date(data.checkOut)
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : null
    } catch {
      return null
    }
  }

  const nights = calculateNights()
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F4; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF8F4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden;">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="background-color: #1A1A1A; padding: 30px 40px;">
              <img src="${LOGO_URL}" alt="Prime Luxury Stays" width="180" style="display: block;" />
              <table width="50" cellpadding="0" cellspacing="0" border="0" style="margin-top: 15px;">
                <tr><td style="height: 2px; background-color: #B8954C;"></td></tr>
              </table>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td align="center" style="background-color: #B8954C; padding: 20px 40px;">
              <table width="50" height="50" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border-radius: 50%;">
                <tr>
                  <td align="center" valign="middle" style="font-size: 24px; color: #B8954C;">✓</td>
                </tr>
              </table>
              <p style="margin: 12px 0 0 0; color: #FFFFFF; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                Inquiry Received
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <h1 style="margin: 0 0 15px 0; font-size: 28px; font-weight: 300; color: #1A1A1A; text-align: center;">
                Thank you, ${firstName}!
              </h1>

              <p style="margin: 0 0 30px 0; font-size: 16px; color: #666666; text-align: center; line-height: 1.7;">
                We've received your inquiry and are excited to help you discover your perfect luxury retreat.
              </p>

              <!-- Response Time Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FBF9F5; border: 2px solid #E8D9B5; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td align="center" style="padding: 25px;">
                    <p style="margin: 0 0 5px 0; font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 2px;">Expected Response Time</p>
                    <p style="margin: 0 0 5px 0; font-size: 32px; font-weight: bold; color: #B8954C;">Within 2 Hours</p>
                    <p style="margin: 0; font-size: 13px; color: #666666;">Our concierge team is reviewing your request</p>
                  </td>
                </tr>
              </table>

              ${data.propertyName ? `
              <!-- Property Card with Image -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E5E5E5; border-radius: 8px; margin-bottom: 25px; overflow: hidden;">
                ${data.propertyImage ? `
                <tr>
                  <td>
                    <a href="https://primeluxurystays.com/properties/${data.propertySlug || ''}" style="text-decoration: none;">
                      <img src="${data.propertyImage}" alt="${data.propertyName}" width="100%" style="display: block; max-height: 220px; object-fit: cover;" />
                    </a>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 20px 25px; background-color: #FAFAFA;">
                    <p style="margin: 0 0 5px 0; font-size: 11px; color: #B8954C; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Your Selection</p>
                    <p style="margin: 0 0 8px 0; font-size: 20px; font-weight: bold; color: #1A1A1A;">${data.propertyName}</p>
                    ${data.propertyLocation ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">📍 ${data.propertyLocation}</p>` : ''}
                    
                    ${data.propertyBedrooms || data.propertyBathrooms || data.propertyMaxGuests ? `
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        ${data.propertyBedrooms ? `<td style="padding-right: 15px;"><span style="font-size: 12px; color: #888888;">🛏 ${data.propertyBedrooms} Beds</span></td>` : ''}
                        ${data.propertyBathrooms ? `<td style="padding-right: 15px;"><span style="font-size: 12px; color: #888888;">🚿 ${data.propertyBathrooms} Baths</span></td>` : ''}
                        ${data.propertyMaxGuests ? `<td><span style="font-size: 12px; color: #888888;">👥 Up to ${data.propertyMaxGuests}</span></td>` : ''}
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
              ` : ''}

              ${data.checkIn || data.checkOut || data.guests ? `
              <!-- Your Booking Request -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAFAFA; border: 1px solid #E5E5E5; border-radius: 6px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px 25px;">
                    <p style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #1A1A1A;">📅 Your Booking Request</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${data.checkIn ? `
                      <tr>
                        <td width="50%" style="padding: 8px 0;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase;">Check-in</span><br/>
                          <span style="font-size: 14px; font-weight: bold; color: #1A1A1A;">${formatDate(data.checkIn)}</span>
                        </td>
                        <td width="50%" style="padding: 8px 0;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase;">Check-out</span><br/>
                          <span style="font-size: 14px; font-weight: bold; color: #1A1A1A;">${data.checkOut ? formatDate(data.checkOut) : 'TBD'}</span>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        ${nights ? `
                        <td width="50%" style="padding: 8px 0;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase;">Duration</span><br/>
                          <span style="font-size: 14px; font-weight: bold; color: #B8954C;">${nights} Night${nights > 1 ? 's' : ''}</span>
                        </td>
                        ` : ''}
                        ${data.guests ? `
                        <td width="50%" style="padding: 8px 0;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase;">Guests</span><br/>
                          <span style="font-size: 14px; font-weight: bold; color: #1A1A1A;">${data.guests} Guest${data.guests > 1 ? 's' : ''}</span>
                        </td>
                        ` : ''}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              <p style="margin: 0 0 25px 0; font-size: 15px; color: #666666; text-align: center; line-height: 1.7;">
                While you wait, feel free to explore more of our exclusive collection.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="https://primeluxurystays.com/properties" 
                       style="display: inline-block; background-color: #B8954C; color: #FFFFFF; padding: 16px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 14px;">
                      Browse Our Collection
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Contact Section -->
          <tr>
            <td style="padding: 0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="height: 1px; background-color: #EEEEEE;"></td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 25px 40px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #999999; text-transform: uppercase; letter-spacing: 1px;">Need immediate assistance?</p>
              <a href="mailto:concierge@primeluxurystays.com" style="color: #B8954C; text-decoration: none; font-size: 15px;">
                concierge@primeluxurystays.com
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #1A1A1A; padding: 25px 40px;">
              <p style="margin: 0 0 5px 0; font-size: 10px; letter-spacing: 2px; color: #888888; text-transform: uppercase;">Exclusive Villas &amp; Estates</p>
              <p style="margin: 0 0 15px 0; color: #666666; font-size: 12px;">
                © ${new Date().getFullYear()} Prime Luxury Stays. All rights reserved.
              </p>
              <p style="margin: 0;">
                <a href="https://primeluxurystays.com/mallorca" style="color: #B8954C; text-decoration: none; font-size: 12px; margin: 0 8px;">Mallorca</a>
                <span style="color: #444444;">·</span>
                <a href="https://primeluxurystays.com/ibiza" style="color: #B8954C; text-decoration: none; font-size: 12px; margin: 0 8px;">Ibiza</a>
                <span style="color: #444444;">·</span>
                <a href="https://primeluxurystays.com/properties" style="color: #B8954C; text-decoration: none; font-size: 12px; margin: 0 8px;">All Properties</a>
              </p>
            </td>
          </tr>

        </table>

        <!-- Footer Note -->
        <p style="margin: 20px 0 0 0; text-align: center; color: #AAAAAA; font-size: 11px;">
          You received this email because you submitted an inquiry on primeluxurystays.com
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// Send notification email to admin when new inquiry comes in
export async function sendInquiryNotification(data: InquiryEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set, skipping email notification')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `New Inquiry from ${data.fullName}${data.propertyName ? ` · ${data.propertyName}` : ''}`,
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

// Send confirmation email to the customer
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
      subject: `Thank you for your inquiry${data.propertyName ? ` about ${data.propertyName}` : ''} · Prime Luxury Stays`,
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

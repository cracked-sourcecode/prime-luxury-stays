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
  checkIn?: string | null
  checkOut?: string | null
  guests?: number | null
  sourceUrl?: string | null
}

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
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #1A1A1A; padding: 30px 40px;">
              <img src="https://storage.googleapis.com/primeluxurystays/logo-white.png" alt="Prime Luxury Stays" width="200" style="display: block;" />
              <table width="60" cellpadding="0" cellspacing="0" border="0" style="margin-top: 15px;">
                <tr><td style="height: 2px; background-color: #B8954C;"></td></tr>
              </table>
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
                    <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #1A1A1A;">Contact Information</p>
                    
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

              ${data.propertyName || (data.checkIn && data.checkOut) || data.guests ? `
              <!-- Booking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAFAFA; border: 1px solid #E5E5E5; border-radius: 6px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px 25px;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #1A1A1A;">Booking Details</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${data.propertyName ? `
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Property</span><br/>
                          <span style="font-size: 15px; font-weight: bold; color: #1A1A1A;">${data.propertyName}</span>
                        </td>
                      </tr>
                      ` : ''}
                      ${data.checkIn && data.checkOut ? `
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Dates</span><br/>
                          <span style="font-size: 15px; color: #1A1A1A;">${formatDate(data.checkIn)} → ${formatDate(data.checkOut)}</span>
                        </td>
                      </tr>
                      ` : ''}
                      ${data.guests ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Guests</span><br/>
                          <span style="font-size: 15px; color: #1A1A1A;">${data.guests} ${data.guests === 1 ? 'Guest' : 'Guests'}</span>
                        </td>
                      </tr>
                      ` : ''}
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
                    <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #1A1A1A;">Message</p>
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
                    <a href="mailto:${data.email}?subject=Re: Your Prime Luxury Stays Inquiry" 
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
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #1A1A1A; padding: 40px;">
              <table width="70" height="70" cellpadding="0" cellspacing="0" border="0" style="background-color: #B8954C; border-radius: 50%;">
                <tr>
                  <td align="center" valign="middle" style="font-size: 28px; color: #FFFFFF;">✓</td>
                </tr>
              </table>
              <p style="margin: 20px 0 0 0; font-size: 22px; font-weight: 300; letter-spacing: 3px; color: #FFFFFF;">PRIME LUXURY STAYS</p>
              <table width="50" cellpadding="0" cellspacing="0" border="0" style="margin-top: 15px;">
                <tr><td style="height: 2px; background-color: #B8954C;"></td></tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 300; color: #1A1A1A; text-align: center;">
                Thank you, ${firstName}
              </h1>

              <p style="margin: 0 0 30px 0; font-size: 16px; color: #666666; text-align: center; line-height: 1.7;">
                We've received your inquiry and are excited to help you discover your perfect luxury retreat.
              </p>

              <!-- Response Time Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FBF9F5; border: 2px solid #E8D9B5; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td align="center" style="padding: 30px;">
                    <p style="margin: 0 0 5px 0; font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 2px;">Expected Response Time</p>
                    <p style="margin: 0 0 8px 0; font-size: 36px; font-weight: bold; color: #B8954C;">Within 2 Hours</p>
                    <p style="margin: 0; font-size: 14px; color: #666666;">Our concierge team is reviewing your request</p>
                  </td>
                </tr>
              </table>

              ${data.propertyName ? `
              <!-- Property Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAFAFA; border: 1px solid #E5E5E5; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px 25px;">
                    <p style="margin: 0 0 5px 0; font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px;">You inquired about</p>
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1A1A1A;">${data.propertyName}</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <p style="margin: 0 0 30px 0; font-size: 15px; color: #666666; text-align: center; line-height: 1.7;">
                In the meantime, feel free to explore more of our exclusive collection of luxury properties.
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

        <!-- Unsubscribe -->
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

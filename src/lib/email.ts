import { Resend } from 'resend'

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY)

// Email addresses
const FROM_EMAIL = 'Prime Luxury Stays <concierge@primeluxurystays.com>'
const ADMIN_EMAIL = 'concierge@primeluxurystays.com'

// Brand colors
const COLORS = {
  gold: '#B8954C',
  goldLight: '#D4AF61',
  goldDark: '#96783D',
  cream: '#FAF8F4',
  creamLight: '#FDFCFA',
  charcoal: '#1A1A1A',
  charcoalMedium: '#666666',
  charcoalLight: '#A4A4A4',
  white: '#FFFFFF',
  border: '#E8D19E',
}

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

// Shared email styles
const baseStyles = `
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: ${COLORS.charcoal};
    background-color: ${COLORS.cream};
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: ${COLORS.white};
  }
`

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
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: ${COLORS.charcoal}; background-color: ${COLORS.cream};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.cream}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${COLORS.charcoal} 0%, #2D2D2D 100%); padding: 32px 40px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 3px; color: ${COLORS.white};">PRIME LUXURY STAYS</h1>
                    <div style="width: 60px; height: 2px; background: linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}); margin: 16px auto 0;"></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%); padding: 20px 40px; text-align: center;">
              <p style="margin: 0; color: ${COLORS.white}; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                ✨ New Lead Received
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Contact Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.creamLight}; border-radius: 12px; border: 1px solid ${COLORS.border}; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; color: ${COLORS.charcoal}; font-weight: 600;">Contact Information</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.border};">
                          <span style="color: ${COLORS.charcoalLight}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Name</span><br>
                          <span style="font-size: 16px; font-weight: 600; color: ${COLORS.charcoal};">${data.fullName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.border};">
                          <span style="color: ${COLORS.charcoalLight}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</span><br>
                          <a href="mailto:${data.email}" style="font-size: 16px; color: ${COLORS.gold}; text-decoration: none; font-weight: 500;">${data.email}</a>
                        </td>
                      </tr>
                      ${data.phone ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.border};">
                          <span style="color: ${COLORS.charcoalLight}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</span><br>
                          <a href="tel:${data.phone}" style="font-size: 16px; color: ${COLORS.gold}; text-decoration: none; font-weight: 500;">${data.phone}</a>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              ${data.propertyName || (data.checkIn && data.checkOut) || data.guests ? `
              <!-- Booking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.creamLight}; border-radius: 12px; border: 1px solid ${COLORS.border}; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; color: ${COLORS.charcoal}; font-weight: 600;">Booking Details</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${data.propertyName ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.border};">
                          <span style="color: ${COLORS.charcoalLight}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Property</span><br>
                          <span style="font-size: 16px; font-weight: 600; color: ${COLORS.charcoal};">${data.propertyName}</span>
                        </td>
                      </tr>
                      ` : ''}
                      ${data.checkIn && data.checkOut ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.border};">
                          <span style="color: ${COLORS.charcoalLight}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Dates</span><br>
                          <span style="font-size: 16px; color: ${COLORS.charcoal};">${formatDate(data.checkIn)} → ${formatDate(data.checkOut)}</span>
                        </td>
                      </tr>
                      ` : ''}
                      ${data.guests ? `
                      <tr>
                        <td style="padding: 12px 0;">
                          <span style="color: ${COLORS.charcoalLight}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Guests</span><br>
                          <span style="font-size: 16px; color: ${COLORS.charcoal};">${data.guests} ${data.guests === 1 ? 'Guest' : 'Guests'}</span>
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
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 12px 0; font-size: 18px; color: ${COLORS.charcoal}; font-weight: 600;">Message</h2>
                    <div style="background-color: ${COLORS.creamLight}; border-radius: 12px; border: 1px solid ${COLORS.border}; padding: 20px;">
                      <p style="margin: 0; font-size: 15px; color: ${COLORS.charcoalMedium}; white-space: pre-wrap; line-height: 1.7;">${data.message}</p>
                    </div>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="mailto:${data.email}?subject=Re: Your Prime Luxury Stays Inquiry" 
                       style="display: inline-block; background: linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%); color: ${COLORS.white}; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(184, 149, 76, 0.4);">
                      Reply to ${data.fullName.split(' ')[0]}
                    </a>
                  </td>
                </tr>
              </table>

              ${data.sourceUrl ? `
              <p style="margin: 24px 0 0 0; text-align: center; color: ${COLORS.charcoalLight}; font-size: 12px;">
                Source: ${data.sourceUrl}
              </p>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${COLORS.charcoal}; padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: ${COLORS.charcoalLight}; font-size: 12px;">
                Prime Luxury Stays • Exclusive Villas & Estates
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
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Inquiry</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: ${COLORS.charcoal}; background-color: ${COLORS.cream};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.cream}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, ${COLORS.charcoal} 0%, #2D2D2D 100%); padding: 48px 40px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 32px;">✓</span>
                    </div>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 3px; color: ${COLORS.white};">PRIME LUXURY STAYS</h1>
                    <div style="width: 60px; height: 2px; background: linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}); margin: 20px auto 0;"></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px;">
              
              <h2 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 300; color: ${COLORS.charcoal}; text-align: center;">
                Thank you, ${firstName}
              </h2>

              <p style="margin: 0 0 24px 0; font-size: 16px; color: ${COLORS.charcoalMedium}; text-align: center; line-height: 1.8;">
                We've received your inquiry and are excited to help you discover your perfect luxury retreat.
              </p>

              <!-- Response Time -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, ${COLORS.gold}15 0%, ${COLORS.goldLight}15 100%); border-radius: 12px; border: 1px solid ${COLORS.border}; margin: 32px 0;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: ${COLORS.charcoalLight}; text-transform: uppercase; letter-spacing: 1px;">Expected Response Time</p>
                    <p style="margin: 0; font-size: 32px; font-weight: 600; color: ${COLORS.gold};">Within 2 Hours</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: ${COLORS.charcoalMedium};">Our concierge team is reviewing your request</p>
                  </td>
                </tr>
              </table>

              ${data.propertyName ? `
              <!-- Property Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.creamLight}; border-radius: 12px; border: 1px solid ${COLORS.border}; margin: 32px 0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: ${COLORS.charcoalLight}; text-transform: uppercase; letter-spacing: 1px;">You inquired about</p>
                    <p style="margin: 0; font-size: 20px; font-weight: 600; color: ${COLORS.charcoal};">${data.propertyName}</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <p style="margin: 32px 0; font-size: 15px; color: ${COLORS.charcoalMedium}; text-align: center; line-height: 1.8;">
                In the meantime, feel free to explore more of our exclusive collection of luxury properties.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="https://primeluxurystays.com/properties" 
                       style="display: inline-block; background: linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%); color: ${COLORS.white}; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(184, 149, 76, 0.4);">
                      Browse Our Collection
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, ${COLORS.border}, transparent);"></div>
            </td>
          </tr>

          <!-- Contact Section -->
          <tr>
            <td style="padding: 32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: ${COLORS.charcoalLight}; text-transform: uppercase; letter-spacing: 1px;">Need immediate assistance?</p>
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 8px 16px;">
                          <a href="mailto:concierge@primeluxurystays.com" style="color: ${COLORS.gold}; text-decoration: none; font-size: 15px; font-weight: 500;">
                            ✉️ concierge@primeluxurystays.com
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${COLORS.charcoal}; padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 11px; letter-spacing: 2px; color: ${COLORS.charcoalLight}; text-transform: uppercase;">Exclusive Villas & Estates</p>
              <p style="margin: 0; color: ${COLORS.charcoalLight}; font-size: 12px;">
                © ${new Date().getFullYear()} Prime Luxury Stays. All rights reserved.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin: 16px auto 0;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="https://primeluxurystays.com/mallorca" style="color: ${COLORS.gold}; text-decoration: none; font-size: 12px;">Mallorca</a>
                  </td>
                  <td style="color: ${COLORS.charcoalLight};">•</td>
                  <td style="padding: 0 8px;">
                    <a href="https://primeluxurystays.com/ibiza" style="color: ${COLORS.gold}; text-decoration: none; font-size: 12px;">Ibiza</a>
                  </td>
                  <td style="color: ${COLORS.charcoalLight};">•</td>
                  <td style="padding: 0 8px;">
                    <a href="https://primeluxurystays.com/properties" style="color: ${COLORS.gold}; text-decoration: none; font-size: 12px;">All Properties</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Unsubscribe -->
        <p style="margin: 24px 0 0 0; text-align: center; color: ${COLORS.charcoalLight}; font-size: 11px;">
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
      subject: `New Inquiry from ${data.fullName}${data.propertyName ? ` • ${data.propertyName}` : ''}`,
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
      subject: `Thank you for your inquiry${data.propertyName ? ` about ${data.propertyName}` : ''} • Prime Luxury Stays`,
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

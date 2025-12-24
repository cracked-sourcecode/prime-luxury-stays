import { Resend } from 'resend'

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY)

// Email addresses
const FROM_EMAIL = 'Prime Luxury Stays <noreply@primeluxurystays.com>'
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

// Send notification email to admin when new inquiry comes in
export async function sendInquiryNotification(data: InquiryEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set, skipping email notification')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const propertyInfo = data.propertyName 
      ? `<tr><td style="padding: 8px 0; color: #666;">Property:</td><td style="padding: 8px 0; font-weight: 600;">${data.propertyName}</td></tr>`
      : ''
    
    const datesInfo = data.checkIn && data.checkOut
      ? `<tr><td style="padding: 8px 0; color: #666;">Dates:</td><td style="padding: 8px 0;">${data.checkIn} to ${data.checkOut}</td></tr>`
      : ''
    
    const guestsInfo = data.guests
      ? `<tr><td style="padding: 8px 0; color: #666;">Guests:</td><td style="padding: 8px 0;">${data.guests}</td></tr>`
      : ''

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `🏠 New Inquiry from ${data.fullName}${data.propertyName ? ` - ${data.propertyName}` : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #B8954C 0%, #D4AF61 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Inquiry Received</h1>
          </div>
          
          <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="margin-top: 0; color: #1a1a1a;">Contact Details</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 120px;">Name:</td>
                <td style="padding: 8px 0; font-weight: 600;">${data.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #B8954C;">${data.email}</a></td>
              </tr>
              ${data.phone ? `<tr><td style="padding: 8px 0; color: #666;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #B8954C;">${data.phone}</a></td></tr>` : ''}
              ${propertyInfo}
              ${datesInfo}
              ${guestsInfo}
            </table>
            
            ${data.message ? `
              <h3 style="color: #1a1a1a; margin-top: 24px;">Message</h3>
              <div style="background: #f9fafb; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${data.message}</div>
            ` : ''}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <a href="mailto:${data.email}?subject=Re: Your Prime Luxury Stays Inquiry" 
                 style="display: inline-block; background: #B8954C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Reply to ${data.fullName}
              </a>
            </div>
            
            ${data.sourceUrl ? `<p style="margin-top: 20px; color: #999; font-size: 12px;">Source: ${data.sourceUrl}</p>` : ''}
          </div>
          
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            Prime Luxury Stays • Exclusive Villas & Estates
          </p>
        </body>
        </html>
      `,
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
      subject: `Thank you for your inquiry${data.propertyName ? ` about ${data.propertyName}` : ''} - Prime Luxury Stays`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #B8954C 0%, #D4AF61 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">Prime Luxury Stays</h1>
          </div>
          
          <div style="background: #fff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="margin-top: 0; color: #1a1a1a;">Thank you, ${data.fullName.split(' ')[0]}!</h2>
            
            <p>We've received your inquiry and are excited to help you find your perfect luxury escape.</p>
            
            <p>Our concierge team will review your request and get back to you within <strong>2 hours</strong> with personalized recommendations and availability.</p>
            
            ${data.propertyName ? `
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <p style="margin: 0; color: #666;">You inquired about:</p>
                <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">${data.propertyName}</p>
              </div>
            ` : ''}
            
            <p>In the meantime, feel free to browse our other properties at <a href="https://primeluxurystays.com/properties" style="color: #B8954C;">primeluxurystays.com</a>.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #666; font-size: 14px;">Need immediate assistance?</p>
              <p style="margin: 8px 0 0 0;">
                <a href="mailto:concierge@primeluxurystays.com" style="color: #B8954C;">concierge@primeluxurystays.com</a>
              </p>
            </div>
          </div>
          
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            © ${new Date().getFullYear()} Prime Luxury Stays • Exclusive Villas & Estates
          </p>
        </body>
        </html>
      `,
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


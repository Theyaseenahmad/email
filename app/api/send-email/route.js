import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { to, subject, text } = await req.json();

  try {
    const emailResponse = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',  // Replace with your verified email address
      to: [to],  // Recipient's email (should be a valid email)
      subject: subject,  // Email subject
      text: text,  // Email body
    });

    console.log('Email sent successfully:', emailResponse); // Log response for debugging

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error sending email:', error); // Log error details
    return new Response(
      JSON.stringify({ success: false, error: error.message || error }),
      { status: 500 }
    );
  }
}

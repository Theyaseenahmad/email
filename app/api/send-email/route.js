import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, subject, text } = await req.json();

    // Setup Nodemailer with Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {
        user: process.env.BREVO_EMAIL, // Your Brevo email
        pass: process.env.BREVO_API_KEY, // Your SMTP API key
      },
    });

    // Send Email
    const info = await transporter.sendMail({
      from: `"yaseenahmad02.777@gmail.com`, // Change to your sender email
      to,
      subject,
      text,
    });

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

import fetch from 'node-fetch';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    
    // Enhanced prompt structure
    const emailPrompt = `Generate professional email based on: "${prompt}"
      Format requirements:
      - Subject line starting with "Subject: "
      - Formal salutation "Dear [Name/Team],"
      - 3-5 line body with clear request
      - Closing with "Best regards," followed by name
      - No markdown, bullets, or special formatting
      - Maximum 150 words
      
      Example:
      Subject: Project Timeline Inquiry
      Dear HR Team,
      Could you please confirm the final deadline for the ongoing project?
      We need to align our team's deliverables with the official schedule.
      Kindly advise at your earliest convenience.
      Best regards,
      John Doe
      Project Coordinator`;

    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-base', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: emailPrompt,
        parameters: {
          max_length: 200,
          temperature: 0.5,
          repetition_penalty: 1.8,
          num_return_sequences: 1
        }
      }),
    });

    const data = await response.json();
    let email = data[0]?.generated_text || '';

    // Enhanced cleaning
    email = email
      .replace(/[*_#-]/g, '') // Remove markdown special chars
      .replace(/(\r\n|\n|\r)/gm, '\n') // Standardize line breaks
      .replace(/(Subject:).*/gi, (match) => match.split('\n')[0]) // Keep first subject line
      .replace(/\s{2,}/g, ' ') // Remove extra spaces
      .trim();

    if (!email.startsWith('Subject:')) {
      email = `Subject: Formal Request\n${email}`;
    }

    return new Response(JSON.stringify({ email }), { status: 200 });

  } catch (error) {
    // Fallback template with variables removed
    return new Response(JSON.stringify({
      email: `Subject: Project Deadline Inquiry
Dear HR Team,

Could you please confirm the current deadline for the ongoing project? 
We need this information to align our team's workflow accordingly.

Best regards,
[Your Name]`
    }), { status: 200 });
  }
}
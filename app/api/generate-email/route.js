import fetch from 'node-fetch';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

export async function POST(req) {
  try {
    // Validate request payload
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Invalid content type' }),
        { status: 400 }
      );
    }

    const { prompt } = await req.json();
    
    if (!prompt || prompt.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Prompt must be at least 10 characters' }),
        { status: 400 }
      );
    }

    // Construct optimized prompt
    const cleanedPrompt = `Generate formal business email about: ${prompt.substring(0, 200)}
      - Structure: Subject line, salutation, body, closing
      - Tone: Professional
      - Format: Plain text only
      - Length: 3-5 short paragraphs
      Example:
      Subject: Project Timeline Update
      Dear HR Team,
      [Content...]
      Best regards,
      [Your Name]`;

    // API call with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-base', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: cleanedPrompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          do_sample: true
        }
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error('HF API Error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Email generation service unavailable',
          details: errorData.error || 'Model loading or API limit reached'
        }),
        { status: 503 }
      );
    }

    // Validate response format
    const data = await response.json();
    if (!Array.isArray(data) || !data[0]?.generated_text) {
      return new Response(
        JSON.stringify({ error: 'Unexpected response format' }),
        { status: 500 }
      );
    }

    // Clean and format output
    const emailContent = data[0].generated_text
      .replace(/(Subject:).*/gi, (match) => match.substring(0, 100)) // Limit subject length
      .replace(/\[Your Name\]/g, 'Project Team')
      .trim();

    return new Response(
      JSON.stringify({ emailContent }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );

  } catch (error) {
    console.error('Server Error:', error);
    const errorMessage = error.name === 'AbortError' 
      ? 'Request timed out' 
      : 'Internal server error';
      
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        solution: 'Please try a shorter/simpler prompt'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
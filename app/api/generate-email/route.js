import fetch from 'node-fetch'; // Ensure you're using node-fetch for HTTP requests

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY; // Make sure to set this in your .env.local
const MODEL = 'gpt2'; // You can change this to any model you'd like to use, like gpt-3 or others

export async function POST(req) {
  try {
    const { prompt } = await req.json(); // Get the prompt from the request body
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400 }
      );
    }
    console.log('Prompt:', prompt);

    // Send the request to the Hugging Face API
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Write an email in markdown format for:\n\n"${prompt}"`, // Pass the prompt to the Hugging Face model
      }),
    });

    const data = await response.json(); // Parse the response

    if (!response.ok) {
      // Handle failed response from Hugging Face API
      throw new Error(data?.error || 'Failed to generate response from Hugging Face API');
    }

    // Extract the generated text
    const markdown = data[0]?.generated_text || 'Failed to generate email.';
    
    return new Response(
      JSON.stringify({ markdown }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

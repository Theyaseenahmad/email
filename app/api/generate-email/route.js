import { Together } from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_AI_API_KEY, // Make sure to set this in .env.local
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const emailPrompt = `
      Write a professional business email based on this request:  
      "${prompt}"  

      Follow this format:  
      Subject: [Clear and relevant subject]  
      Dear [Recipient],  
      [Concise email body (3-5 sentences, professional tone)]  
      Best regards,  
      [Your Name]  
      [Your Position]  

      **Rules:**  
      - No placeholders like "[Your Name]".  
      - Keep it formal, short, and relevant.  
      - Make sure the subject line is specific and clear.  
    `;

    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo", // Stronger AI model
      messages: [{ role: "user", content: emailPrompt }],
      max_tokens: 200,
      temperature: 1.0, // More natural responses
    });

    let email = response.choices?.[0]?.message?.content || "Error generating email.";

    return Response.json({ email });
  } catch (error) {
    return Response.json({ email: "Error: AI model failed to generate email." });
  }
}

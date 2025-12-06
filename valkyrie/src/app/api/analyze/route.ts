import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST() {
  try {
    // For this hackathon demo, we'll use a static "suspicious" image URL 
    // because we can't easily stream the fake video feed from the client yet.
    // In a real app, we would read `req.body` for a base64 image.
    const imageUrl = 'https://media.istockphoto.com/id/172393635/photo/night-vision.jpg?s=612x612&w=0&k=20&c=0t6tqI_7QoJ_b_X4f_z_z_z_z_z_z_z_z_z_z_z_z_z';
    
    const imageResp = await fetch(imageUrl);
    const imageBuffer = await imageResp.arrayBuffer();
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this security camera footage. 
      Identify any potential threats to the user.
      Return ONLY a JSON object with this structure:
      {
        "text": "A short, military-style situation report (max 15 words)",
        "threat": <number between 1-10>
      }
      Do not include markdown formatting.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: Buffer.from(imageBuffer).toString('base64'),
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown if Gemini adds it
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback for demo if API fails (or quota exceeded)
    return NextResponse.json({ 
      text: "CONNECTION ERROR. RE-ROUTING...", 
      threat: 0 
    });
  }
}

import type { Message } from '../types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

const GEMINI_API_KEY = "AIzaSyDi-_poRLjfwcI9j2Y9g0pSrUF3U4s9xfs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function generateAIResponse(query: string): Promise<Message> {
  let content = '';
  
  try {
    const promptText = `You are an expert Study Abroad & Visa Admission Counselor AI. Please format your answer fully in Markdown. Answer the following student inquiry accurately, professionally, and concisely: "${query}"`;
    
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }]
      })
    });
    
    if (resp.ok) {
      const data = await resp.json();
      content = data.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to retrieve a valid response.";
    } else {
      const errorData = await resp.json();
      console.error("Gemini API Error:", errorData);
      content = "**System Overload:** Failed to connect to the GlobalAdmit AI network. Verify API key and network status.";
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    content = "**Connection Error:** Could not connect to Google Generative AI. Please check internet connections.";
  }

  return {
    id: generateId(),
    role: 'ai',
    content,
    timestamp: new Date()
  };
}

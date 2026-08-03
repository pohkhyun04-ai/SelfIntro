import { Router, type Request, type Response } from "express";

const router = Router();

/**
 * System prompt that gives Gemini context about the portfolio owner.
 * This turns a generic LLM into a knowledgeable FAQ assistant.
 */
const SYSTEM_PROMPT = `You are a friendly, helpful FAQ chatbot embedded on Qia Chung's personal portfolio website.

ABOUT QIA CHUNG:
- Name: Qia Chung
- Role: Software Engineer
- Location: Cheras, Kuala Lumpur, Malaysia
- Email: chungpohkhyun1234@gmail.com
- Years of experience: ~6 years in full-stack development
- Tagline: "I build fast, accessible, and delightful web experiences."
- Available for hire: Yes

SKILLS (with proficiency):
- AI-Assisted Development (90%)
- Prompt Engineering (75%)
- HTML (80%)
- PHP (75%)
- CSS (72%)
- JavaScript (60%)
- Vue.js (52%)
- Python (65%)
- Java (68%)
- C# (68%)
- C++ (65%)
- MySQL (72%)
- REST APIs (70%)

PROJECTS:
1. "FYP - Web Application" — A full-stack Laravel web app for browsing, purchasing, and managing purebred pets. Features include pet search, appointment booking, purchase management, admin dashboard, sales reports, rider management, and AI-powered pet breed recognition using ResNet50 deep learning model. Tech: Laravel, PHP, MySQL, JavaScript, Python, Chart.js.

2. "Self Intro Website" — This portfolio website itself! A personal introduction website showcasing skills and projects, built with HTML, Vue.js, JavaScript, and TypeScript.

EXPERIENCE:
- Full Stack Engineer Intern at Flexinfra AI Sdn Bhd (15 June - 29 November 2026). Led the frontend platform team and shipped a design system adopted across 8 product teams.

SOCIAL LINKS:
- GitHub: https://github.com/pohkhyun04-ai
- LinkedIn: https://www.linkedin.com/in/qiachung04/

RULES:
- Keep answers concise and friendly (2-4 sentences max unless asked for detail).
- If asked something unrelated to Qia Chung or the portfolio, politely redirect: "I'm here to help you learn about Qia Chung! Feel free to ask about his skills, projects, or experience."
- If asked about contact, point to the contact form on the page or the email address.
- Use emojis sparingly but warmly.
- Never make up information. If you don't know, say so honestly.`;

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
}

/**
 * POST /api/chat
 * Proxies the conversation to Google Gemini and returns the reply.
 * Public — no auth required.
 */
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body as ChatRequestBody;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      console.warn("[chat] GEMINI_API_KEY not configured.");
      res.status(500).json({
        error: "Chatbot is not configured yet. Please set GEMINI_API_KEY in server/.env",
      });
      return;
    }

    // Build the conversation contents (alternating user/model turns)
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    for (const msg of history) {
      contents.push({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }],
      });
    }

    // Add the current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[chat] Gemini API error:", response.status, errorText);
      res.status(502).json({ error: "AI service returned an error. Please try again later." });
      return;
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't generate a response. Please try again.";

    res.json({ reply });
  } catch (err) {
    console.error("[chat] Unexpected error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

export default router;

import { createToken, ensureSchema, hashIp, json, type Env, verifyToken, withCors } from "../_shared";

const SYSTEM_PROMPT = `You are a friendly FAQ chatbot for Qia Chung's personal portfolio. Answer questions about Qia's skills, projects, education and experience using only the portfolio information. Keep answers concise and friendly. If a question is unrelated, politely redirect to the portfolio. Never invent information.`;

function origin(request: Request) { return request.headers.get("Origin") || "*"; }

export const onRequestOptions: PagesFunction<Env> = async ({ request }) =>
  new Response(null, { status: 204, headers: {
    "Access-Control-Allow-Origin": origin(request),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  }});

export const onRequest: PagesFunction<Env> = async ({ request, env, params }) => {
  const route = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  const cors = (response: Response) => withCors(response, origin(request));
  try {
    await ensureSchema(env.DB);

    if (route === "health" && request.method === "GET") return cors(json({ status: "ok" }));

    if (route === "login" && request.method === "POST") {
      const body = await request.json() as { username?: string; password?: string };
      if (!body.username || !body.password) return cors(json({ error: "Username and password are required." }, 400));
      if (body.username !== env.ADMIN_USER || body.password !== env.ADMIN_PASSWORD) return cors(json({ error: "Invalid credentials." }, 401));
      return cors(json({ token: await createToken(body.username, env.JWT_SECRET) }));
    }

    if (route === "contact" && request.method === "POST") {
      const body = await request.json() as { name?: string; email?: string; message?: string };
      if (!body.name || !body.message) return cors(json({ error: "Name and message are required." }, 400));
      const result = await env.DB.prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)").bind(body.name, body.email ?? null, body.message).run();
      return cors(json({ success: true, id: result.meta.last_row_id }, 201));
    }

    if (route === "contacts" && request.method === "GET") {
      if (!(await verifyToken(request, env.JWT_SECRET))) return cors(json({ error: "Unauthorized." }, 401));
      const result = await env.DB.prepare("SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC").all();
      return cors(json(result.results));
    }

    if (route === "avatar" && request.method === "GET") {
      const object = await env.AVATARS.get("chatbot_avatar");
      if (!object) return cors(json({ error: "No avatar found." }, 404));
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("Cache-Control", "public, max-age=3600");
      headers.set("Access-Control-Allow-Origin", origin(request));
      return new Response(object.body, { headers });
    }

    if (route === "assets/avatar" && request.method === "POST") {
      if (!(await verifyToken(request, env.JWT_SECRET))) return cors(json({ error: "Unauthorized." }, 401));
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) return cors(json({ error: "No file uploaded." }, 400));
      if (!file.type.startsWith("image/")) return cors(json({ error: "Only image files are allowed." }, 400));
      if (file.size > 5 * 1024 * 1024) return cors(json({ error: "Maximum file size is 5MB." }, 400));
      await env.AVATARS.put("chatbot_avatar", file.stream(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=3600" } });
      return cors(json({ success: true, message: "Avatar uploaded." }));
    }

    if (route === "chat" && request.method === "POST") {
      if (!env.GEMINI_API_KEY) return cors(json({ error: "Chatbot is not configured." }, 500));
      const body = await request.json() as { message?: string; history?: Array<{ role: "user" | "model"; text: string }> };
      if (!body.message?.trim()) return cors(json({ error: "Message is required." }, 400));
      const contents = [...(body.history || []).map(m => ({ role: m.role === "model" ? "model" : "user", parts: [{ text: m.text }] })), { role: "user", parts: [{ text: body.message }] }];
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + encodeURIComponent(env.GEMINI_API_KEY), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, contents }),
      });
      if (!response.ok) return cors(json({ error: "AI service returned an error. Please try again later." }, 502));
      const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      return cors(json({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response. Please try again." }));
    }

    if (route === "like" && request.method === "POST") {
      const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
      await env.DB.prepare("INSERT OR IGNORE INTO likes (ip_hash) VALUES (?)").bind(await hashIp(ip)).run();
      const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM likes").first<{ count: number }>();
      return cors(json({ liked: true, likes: Number(count?.count || 0) }));
    }

    if (route === "visit" && request.method === "POST") {
      const body = await request.json() as { page?: string };
      await env.DB.prepare("INSERT INTO visits (page) VALUES (?)").bind(body.page || "/").run();
      const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM visits").first<{ count: number }>();
      return cors(json({ visits: Number(count?.count || 0) }));
    }

    if (route === "stats" && request.method === "GET") {
      const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
      const ipHash = await hashIp(ip);
      const [likes, visits, ownLike] = await Promise.all([
        env.DB.prepare("SELECT COUNT(*) AS count FROM likes").first<{ count: number }>(),
        env.DB.prepare("SELECT COUNT(*) AS count FROM visits").first<{ count: number }>(),
        env.DB.prepare("SELECT COUNT(*) AS count FROM likes WHERE ip_hash = ?").bind(ipHash).first<{ count: number }>(),
      ]);
      return cors(json({ likes: Number(likes?.count || 0), visits: Number(visits?.count || 0), hasLiked: Number(ownLike?.count || 0) > 0 }));
    }

    return cors(json({ error: "Not found." }, 404));
  } catch (error) {
    console.error("[cloudflare] API error", error);
    return cors(json({ error: "Internal server error." }, 500));
  }
};

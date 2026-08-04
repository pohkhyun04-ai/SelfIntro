/**
 * Translation script — uses Google Gemini API to translate en.json → zh.json.
 *
 * Usage:
 *   node scripts/translate.mjs
 *
 * Requires GEMINI_API_KEY in server/.env or as environment variable.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ---- load API key ----
let apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  // Try reading from server/.env
  const envPath = resolve(ROOT, 'server', '.env')
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8')
    const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.+)/)
    if (match) {
      apiKey = match[1].trim()
    }
  }
}

if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.error('❌ GEMINI_API_KEY not found. Set it in server/.env or as environment variable.')
  process.exit(1)
}

// ---- load English strings ----
const enPath = resolve(ROOT, 'src', 'i18n', 'en.json')
const en = JSON.parse(readFileSync(enPath, 'utf-8'))

/**
 * Recursively collect all leaf string values with their dot-notation paths.
 */
function collectStrings(obj, prefix = '') {
  const entries = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      entries.push({ path, text: value })
    } else if (typeof value === 'object' && value !== null) {
      entries.push(...collectStrings(value, path))
    }
  }
  return entries
}

const strings = collectStrings(en)
console.log(`🔤 Found ${strings.length} strings to translate.\n`)

// ---- call Gemini API ----
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(apiKey)}`

/**
 * Translate a batch of strings to Chinese.
 * We send all strings in one API call for efficiency.
 */
async function translateBatch(texts) {
  const prompt = `Translate the following English UI strings to Simplified Chinese (简体中文).
Rules:
- Keep {name}, {role}, {count}, {skill} placeholders EXACTLY as-is (do not translate them).
- Keep Vue 3, TypeScript, Express, PostgreSQL, MBTI, ENFJ, INFJ as-is.
- Use natural, modern Chinese suitable for a personal portfolio website.
- Return ONLY a JSON array of translated strings in the exact same order.

Strings to translate:
${texts.map((t, i) => `${i + 1}. ${t}`).join('\n')}`

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${errText}`)
  }

  const data = await response.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  // Extract JSON array from response (may be wrapped in markdown code block)
  const jsonMatch = raw.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    console.error('Raw response:', raw)
    throw new Error('Could not extract JSON array from Gemini response')
  }

  try {
    return JSON.parse(jsonMatch[0])
  } catch {
    // Try cleaning up common issues
    const cleaned = jsonMatch[0]
      .replace(/,(\s*[}\]])/g, '$1') // trailing commas
    return JSON.parse(cleaned)
  }
}

// ---- build zh.json ----
async function main() {
  const texts = strings.map((s) => s.text)
  console.log('📡 Calling Gemini API...')

  let translated
  try {
    translated = await translateBatch(texts)
  } catch (err) {
    console.error('Translation failed:', err.message)
    process.exit(1)
  }

  if (!Array.isArray(translated) || translated.length !== texts.length) {
    console.error(`Expected ${texts.length} translations, got ${translated?.length ?? 0}`)
    console.error('Raw:', JSON.stringify(translated))
    process.exit(1)
  }

  // Rebuild nested object
  const zh = JSON.parse(JSON.stringify(en)) // deep clone structure

  for (let i = 0; i < strings.length; i++) {
    const { path, text } = strings[i]
    const keys = path.split('.')
    let obj = zh
    for (let j = 0; j < keys.length - 1; j++) {
      obj = obj[keys[j]]
    }
    obj[keys[keys.length - 1]] = translated[i]
    console.log(`  ${text.padEnd(50)} → ${translated[i]}`)
  }

  const zhPath = resolve(ROOT, 'src', 'i18n', 'zh.json')
  writeFileSync(zhPath, JSON.stringify(zh, null, 2) + '\n', 'utf-8')
  console.log(`\n✅ Written ${strings.length} translations to src/i18n/zh.json`)
}

main()

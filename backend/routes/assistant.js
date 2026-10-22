
const express = require('express');
const router = express.Router();

const MODEL = 'gemini-3.5-flash-lite';
const MAX_MESSAGE_LENGTH = 1000;
const RATE_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 15;

const requestsByIp = new Map();

const SYSTEM_INSTRUCTIONS = `
You are the official SkillSwap website guide.

Help users understand how to use SkillSwap in simple, friendly language.
SkillSwap is a student skill-exchange platform.

Known pages:
- / : Landing page
- /login : Login
- /signup : Create account
- /dashboard : Dashboard
- /explore : Find other students and explore skills
- /matches : Skill matches
- /chat : Messages
- /schedule : Sessions and scheduling
- /profile : User profile

The dashboard, explore, matches, chat, schedule and profile pages
require the user to be logged in.

Give practical step-by-step instructions. Do not claim an action
was completed unless the user actually completed it.
Do not invent buttons or features you cannot verify.
If unsure about a feature, say so honestly.
Never request passwords, API keys or authentication tokens.
You cannot access or modify user accounts or database records.
Keep answers concise and focused on SkillSwap.
`;

function rateLimit(req, res, next) {
  const now = Date.now();
  const ip = req.ip || 'unknown';
  const record = requestsByIp.get(ip);

  if (!record || now - record.start >= RATE_WINDOW_MS) {
    requestsByIp.set(ip, { start: now, count: 1 });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a minute and try again.'
    });
  }

  record.count += 1;
  next();
}

router.post('/chat', rateLimit, async (req, res) => {
  try {
    const message =
      typeof req.body?.message === 'string'
        ? req.body.message.trim()
        : '';

    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        message: 'Enter a message between 1 and 1000 characters.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured.');
      return res.status(503).json({
        success: false,
        message: 'The AI assistant is temporarily unavailable.'
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTIONS }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500
          }
        }),
        signal: AbortSignal.timeout(20000)
      }
    );

   if (!response.ok) {
  const errorDetails = await response.text();

  console.error(
    'Gemini API returned status:',
    response.status,
    'details:',
    errorDetails.slice(0, 1000)
  );

  return res.status(502).json({
    success: false,
    message: 'The AI assistant could not respond. Please try again.'
  });
}
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || '')
      .join('')
      .trim();

    if (!reply) {
      return res.status(502).json({
        success: false,
        message: 'No response was generated. Please try again.'
      });
    }

    return res.json({
      success: true,
      reply
    });
  } catch (error) {
    console.error('Assistant request failed:', error.name || 'Error');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.'
    });
  }
});

module.exports = router;

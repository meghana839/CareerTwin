import { GoogleGenAI } from '@google/genai';

let geminiClient = null;

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_gemini_api_key_here') {
    return null;
  }
  if (!geminiClient) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
    } catch (err) {
      console.warn('[GeminiService] Failed to initialize GoogleGenAI client:', err.message);
      return null;
    }
  }
  return geminiClient;
};

/**
 * Reusable function to generate response from Gemini with intelligent retry and fallback
 * Model: gemini-3.8-flash
 */
export const generateGeminiResponse = async (prompt, options = {}) => {
  const client = getGeminiClient();

  if (!client) {
    return {
      success: false,
      isFallback: true,
      reason: 'NO_API_KEY',
      message: 'GEMINI_API_KEY is not configured in backend .env'
    };
  }

  const modelName = options.model || 'gemini-3.8-flash';
  let retries503 = 1; // Limited retry for 503 errors only

  while (retries503 >= 0) {
    try {
      let outputText = null;

      // In @google/genai SDK v2:
      if (client.models && typeof client.models.generateContent === 'function') {
        const response = await client.models.generateContent({
          model: modelName,
          contents: prompt
        });
        outputText = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text;
      } else if (client.interactions && typeof client.interactions.create === 'function') {
        const interaction = await client.interactions.create({
          model: modelName,
          input: prompt
        });
        outputText = interaction?.output_text || interaction?.text;
      }

      if (!outputText) {
        throw new Error('Empty response received from Gemini');
      }

      return {
        success: true,
        isFallback: false,
        text: outputText
      };
    } catch (err) {
      const errMsg = err?.message || String(err);
      const statusCode = err?.status || err?.statusCode || (errMsg.includes('429') ? 429 : errMsg.includes('503') ? 503 : null);

      // Handle 429 Quota Exceeded - CRITICAL: DO NOT RETRY
      if (statusCode === 429 || errMsg.includes('429') || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate limit')) {
        console.warn('[GeminiService] Quota exceeded (429). Returning graceful fallback without retry.');
        return {
          success: false,
          isFallback: true,
          reason: 'QUOTA_EXCEEDED',
          message: 'Gemini API quota currently exceeded. Using intelligent career intelligence engine.'
        };
      }

      // Handle 503 Temporary Service Unavailable - Limited 1 retry
      if ((statusCode === 503 || errMsg.includes('503')) && retries503 > 0) {
        console.warn('[GeminiService] Gemini service temporarily unavailable (503). Retrying once in 1.5s...');
        retries503--;
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }

      // Non-retryable error
      console.warn(`[GeminiService] Error calling Gemini: ${errMsg}`);
      return {
        success: false,
        isFallback: true,
        reason: 'API_ERROR',
        message: errMsg
      };
    }
  }

  return {
    success: false,
    isFallback: true,
    reason: 'RETRY_EXHAUSTED',
    message: 'Unable to connect to Gemini after retry.'
  };
};

/**
 * Safely parse JSON from LLM markdown code blocks
 */
export const extractJsonFromText = (rawText) => {
  if (!rawText) return null;
  try {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean);
  } catch (err) {
    console.warn('[GeminiService] JSON parse error:', err.message);
    return null;
  }
};

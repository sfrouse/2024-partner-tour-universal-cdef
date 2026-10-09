import 'dotenv/config';
import config from '../config.mjs';

export async function runOpenAI(
  prompt,
  conversationHistory = []
) {
  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY,
  // });

  const finalPrompt = {
    ...prompt,
    messages: [
      ...conversationHistory,
      ...prompt.messages
    ]
  }
  // const response = await openai.chat.completions.create(
  //   finalPrompt
  // );

  const start = Date.now();

  const response = await fetchOpenAI(finalPrompt.messages);
  const body = response.body;
  const headers = response.headers;

  let message;
  if (body.choices && body.choices.length >= 1) {
    message = body.choices[0].message
  }

  return {
    message,
    usage: {
      ...body.usage,
      rate_limit_limit_requests: parseInt( headers.get('x-ratelimit-limit-requests') ),
      rate_limit_remaining_requests: parseInt( headers.get('x-ratelimit-remaining-requests') ),
      ratelimit_limit_tokens: parseInt( headers.get('x-ratelimit-limit-tokens') ),
      ratelimit_remaining_tokens: parseInt( headers.get('x-ratelimit-remaining-tokens') ),
      rate_limit_reset_requests: headers.get('x-ratelimit-reset-requests'),
      rate_limit_reset_tokens: headers.get('x-ratelimit-reset-tokens'),
      time_taken: Date.now() - start,
      model: config.OPEN_AI_MODEL
    }
  };
}

async function fetchOpenAI(messages) {
  // Make the API request using fetch
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          model: config.OPEN_AI_MODEL,
          messages
      }),
  });

  // Extract JSON response data
  const body = await response.json();

  // Access headers
  const headers = response.headers;

  return {
    headers,
    body
  }
}
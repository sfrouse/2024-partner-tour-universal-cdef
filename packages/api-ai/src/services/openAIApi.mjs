import 'dotenv/config';
import OpenAI from "openai";

export async function runOpenAI(
  prompt,
  conversationHistory
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const finalPrompt = {
    ...prompt,
    messages: [
      ...conversationHistory,
      ...prompt.messages
    ]
  }
  const response = await openai.chat.completions.create(
    finalPrompt
  );

  let message;
  if (response.choices && response.choices.length >= 1) {
    message = response.choices[0].message
  }

  return message;
}
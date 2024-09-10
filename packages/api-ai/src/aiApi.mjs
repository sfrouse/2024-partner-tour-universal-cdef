import 'dotenv/config';
import OpenAI from "openai";
import writeStringToFile from './prompts/utils/writeStringToFile.mjs';

export default async function aiApi(
  action
) {
  const allPrompts = await action.prompts();
  const results = [];
  const conversationHistory = [];
  for (const prompt of allPrompts) {
    const result = await _runAi(prompt, conversationHistory);
    conversationHistory.push(result);
    console.log('result', result);
    results.push(result.content);
  }
  const outputFile = `./src/generatedCode/${action.id}.json`;
  await writeStringToFile(
    outputFile,
    JSON.stringify(results, null, 2)
  );
  return results;
}

async function _runAi(
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
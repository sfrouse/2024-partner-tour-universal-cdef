import writeStringToFile from "../prompts/utils/writeStringToFile.mjs";
import { runClaudeApi } from "./claudeApi.mjs";
import { runOpenAI } from "./openAIApi.mjs";
import 'dotenv/config';

export default async function aiApi(
    action
) {
    const allPrompts = await action.prompts();
    const results = [];
    let usage = {};
    const conversationHistory = [];
    for (const prompt of allPrompts) {
        const type = prompt.type;
        const newPrompt = {...prompt};
        delete newPrompt.type;
        if (type === "claude") {
          const result = await runClaudeApi(newPrompt);
          // make it look like OpenAI
          conversationHistory.push({
              role: 'assistant',
              content: result.text
          });
          results.push(result.text);
        }else if (type === "message") {
          results.push(prompt.message);
        }else{
          const result = await runOpenAI(newPrompt, conversationHistory);
          conversationHistory.push(
            result.message
          );
          results.push(
            result.message.content
          );
          usage = result.usage;
        }
    }
    const outputFile = `./src/generatedCode/${action.id}.json`;
    await writeStringToFile(
      outputFile,
      JSON.stringify(results, null, 2)
    );

    const usageOutputFile = `./src/generatedCode/${action.id}.usage.json`;
    await writeStringToFile(
      usageOutputFile,
      JSON.stringify(usage, null, 2)
    );

    const latestUsageOutputFile = `./src/generatedCode/latest.usage.json`;
    await writeStringToFile(
      latestUsageOutputFile,
      JSON.stringify({
        ...usage,
        timestamp: Date.now()
      }, null, 2)
    );

    return results;
  }
import 'dotenv/config';
import OpenAI from "openai";
import writeStringToFile from './prompts/utils/writeStringToFile.mjs';

export default async function aiApi(
  action
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // const action = await actionFunction();
  const response = await openai.chat.completions.create(await action.prompt());

  let content = '';
  if (response.choices && response.choices.length >= 1) {
    content = response.choices[0].message.content;
    const outputFile = `./src/generatedCode/${action.name}.mjs`;
    await writeStringToFile(
      outputFile,
      `const output = \`${content.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;\nexport default output;`
    );

    const outputFileCompiled = `./src/generatedCode/${action.name}-compiled.mjs`;
    await writeStringToFile(
      outputFileCompiled,
      action.renderTemplate ? action.renderTemplate(content) : content
    );
  }

  return {
    content
  }
}

import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import getLastUploadedImage from '../prompts/utils/getLastUploadedImage.mjs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function runClaudeApi(
  prompt
) {
  // we are here for the image processing, so check actions for last uploaded image...
  for (let message of prompt.messages) {
    for (let content of message.content) {
      if (content.type === 'LAST_UPLOADED_IMAGE') {
        content.type = 'image';
        content.source = {
          type: "base64",
          media_type: "image/png",
          data: await getLastUploadedImage()
        }
      }
    }
  }
  const response = await anthropic.messages.create(prompt);
  return response.content[0];
}

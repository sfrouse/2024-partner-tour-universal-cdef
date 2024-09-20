import { MessageRequest } from "../../shared-src/types.js";

export default function bounceBack(
  message: {promiseId: string, request: MessageRequest},
  args: {} = {}
) {
  console.log('<- SENDING MSG', {
    request: message.request,
    promiseId: message.promiseId,
    ...args,
  });
  figma.ui.postMessage({
    request: message.request,
    promiseId: message.promiseId,
    ...args,
  });
}

// send generic message to the UI from Widget
export function postPluginMessage(args: {}) {
  try {
    figma.ui.postMessage({
      ...args,
    });
  }catch(err: any) {
    // post message could be sent w/o a plugin
    console.error(err);
  };
}
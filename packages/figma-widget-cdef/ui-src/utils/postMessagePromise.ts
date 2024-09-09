import {
  MessageName,
  MessagePromiseResult,
  MessageRequest
} from "../../shared-src/types.js";

const messagePromiseCallbacks: {[key:string]:(msg:any) => void} = {};
let promiseBounceId = 0;
export default async function postMessagePromise(
  request: MessageRequest,
  args: any = {},
) : Promise<MessagePromiseResult | false> {
  if (!parent?.postMessage) return false;
  if (args['name'] !== undefined) {
    console.error('Can not send "name" to messagePromise');
    return false;
  }

  return new Promise((resolve) => {
    const promiseId = `promise_${promiseBounceId++}`;
    messagePromiseCallbacks[promiseId] = (msg) => resolve(msg);
    // cons ole.log('postMessagePromise',promiseId, Object.keys(messagePromiseCallbacks))
    setTimeout(() => {
      parent.postMessage({pluginMessage: {
        name: MessageName.promiseBounce,
        request,
        promiseId,
        ...args
      }}, "*");
    }, 0);
  });
}

const listeners: ((msg: any) => void)[] = [];
export function addMessageListener(listener: (msg: any) => void) {
  listeners.push(listener);
}

export function removeMessageListener(listener: (msg: any) => void) {
  const listenerIndex = listeners.indexOf(listener);
  if ( listenerIndex !== -1) {
    listeners.splice(listenerIndex, 1);
  }
}

onmessage = (evt: any) => {
  const msg = evt.data.pluginMessage;
  if (msg && messagePromiseCallbacks[msg.promiseId]) {
    // con sole.log('RECIEVE MSG BOUNCE BACK (SUCCESS)', msg);
    messagePromiseCallbacks[msg.promiseId](msg);
    delete messagePromiseCallbacks[msg.promiseId];
  }else{
    listeners.map(listener => listener(msg));
    // con sole.log('RECIEVE MSG BOUNCE BACK (FAIL)', msg);
  }
}

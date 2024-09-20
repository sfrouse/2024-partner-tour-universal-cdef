import { CMAClient } from "@contentful/app-sdk";
import {
  CDefInstance
} from "@contentful-demos/component-definitions";
import {
  COMPONENT_INSTANCE_PROPERTY
} from '@contentful-demos/component-definitions/dist/';

interface SaveRequest  {
  entryId: string,
  componentInstance: CDefInstance | undefined,
}
let activeSaveRequest: SaveRequest | undefined;
let deferredSaveRequest: SaveRequest | undefined;

export default async function saveEntry(
  cma: CMAClient,
  entryId: string,
  componentInstance?: CDefInstance | undefined,
) {
  console.log('SAVING ENTRY', entryId);
  const newSaveRequest: SaveRequest = {
    entryId,
    componentInstance
  };
  if (!activeSaveRequest) {
    activeSaveRequest = newSaveRequest;
    return saveRequest(cma, newSaveRequest);
  }else{
    // only need to deal with the latest one...
    deferredSaveRequest = newSaveRequest;
  }
}

async function saveRequest(
  cma: CMAClient,
  request: SaveRequest
) {
  const cmaEntry = await cma.entry.get({entryId: request.entryId});
  cmaEntry.fields[COMPONENT_INSTANCE_PROPERTY] = {'en-US': request.componentInstance};
  await cma.entry.update({entryId: request.entryId}, cmaEntry);
  activeSaveRequest = undefined;
  if (deferredSaveRequest) {
    const tmpSaveRequest = deferredSaveRequest;
    deferredSaveRequest = undefined;
    await saveEntry(
      cma,
      tmpSaveRequest.entryId,
      tmpSaveRequest.componentInstance
    );
  }
}

import { CMAClient } from "@contentful/app-sdk";
import {
  CDefInstance,
  CDefDefinition,
  CDefManifestDefinition,
  CDefTokens,
} from "@contentful-demos/component-definitions";
import { COMPONENT_INSTANCE_PROPERTY } from "@contentful-demos/component-definitions/dist/";
import { EntryProps, KeyValueMap } from "contentful-management";
import getComponentDefinition, {
  getCDefTokens,
} from "./getComponentDefinition";
import saveEntry from "./saveEntry";
import isDeepEqual from "./deepCompare";
import getLatestInstance from "./getLatestInstance";

export default async function initializeField(
  cma: CMAClient,
  componentDefinitionManifestURL: string,
  entryId: string,
  setEntry?: (val: EntryProps<KeyValueMap>) => void,
  setComponentDefinition?: (val: CDefDefinition | undefined) => void,
  setComponentInstance?: (val: CDefInstance | undefined) => void,
  setManifestDefinition?: (val: CDefManifestDefinition | undefined) => void,
  setCdefTokens?: (val: CDefTokens | undefined) => void,
) {
  // ========= CTFL ENTRY =======================
  const entry = await cma.entry.get({ entryId });
  if (!entry) {
    console.error("NO ENTRY or ENTRY WITH WCConfig");
    return;
  }
  if (setEntry) setEntry(entry);

  // ========= FIELD EDITOR INFO  =====================
  // figuring out what component is associated with this Content Type
  const editorInterface = await cma.editorInterface.get({
    environmentId: entry.sys.environment.sys.id,
    contentTypeId: entry.sys.contentType.sys.id,
  });
  if (!editorInterface) {
    console.error("NO editorInterface");
    return;
  }
  console.log("editorInterface", editorInterface);
  // TODO: change to COMPONENT_INSTANCE_PROPERTY
  const editorField = editorInterface.controls?.find(
    (field) => field.fieldId === COMPONENT_INSTANCE_PROPERTY,
  );
  if (!editorField) {
    console.error("NO editorField");
    return;
  }
  console.log("editorField", editorField);
  // ========= COMPONENT DEFINITION TOKENS =====================
  if (setCdefTokens) {
    const cDefTokens = await getCDefTokens(componentDefinitionManifestURL);
    setCdefTokens(cDefTokens);
  }

  console.log("componentDefinitionManifestURL", componentDefinitionManifestURL);
  // ========= COMPONENT DEFINITION =====================
  const componentDefinitionInfo = await getComponentDefinition(
    componentDefinitionManifestURL,
    String(editorField.settings?.webComponent), // TODO: change name to singular or 'componentDefintion'
  );

  if (!componentDefinitionInfo) {
    console.error(
      "NO Component Definition",
      componentDefinitionManifestURL,
      String(editorField.settings?.webComponent),
    );
    return;
  }
  const componentDefinition = componentDefinitionInfo.componentDefinition;
  const manifestDefinition = componentDefinitionInfo.manifestDefinition;
  if (setComponentDefinition) setComponentDefinition(componentDefinition);
  if (setManifestDefinition) setManifestDefinition(manifestDefinition);

  // ========= ENTRY INSTANCE =====================
  const entryInstance: CDefInstance | undefined =
    entry.fields && entry.fields[COMPONENT_INSTANCE_PROPERTY]
      ? (entry.fields[COMPONENT_INSTANCE_PROPERTY]["en-US"] as CDefInstance)
      : undefined;

  if (
    !entryInstance &&
    manifestDefinition.examples &&
    manifestDefinition.examples.length !== 0
  ) {
    if (setComponentInstance) setComponentInstance(undefined);
    // going to show list of examples
    return false;
  }

  // create a new instance based on definition which could be different
  let finalEntryInst: CDefInstance = getLatestInstance(
    componentDefinition,
    entryInstance,
    entryId,
  );
  if (setComponentInstance) setComponentInstance(finalEntryInst);

  if (!isDeepEqual(entryInstance, finalEntryInst)) {
    console.log("Saving (Different)", entryInstance, finalEntryInst);
    saveEntry(cma, entry.sys.id, finalEntryInst);
  } else {
    console.log("Not Saving (Same)");
  }
}

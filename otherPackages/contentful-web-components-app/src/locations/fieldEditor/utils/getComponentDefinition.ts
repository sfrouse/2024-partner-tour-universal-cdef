import {
  CDefManifest,
  CDefDefinition,
  CDefManifestDefinition,
  CDefExample,
  CDefInstance,
  CDefTokens,
} from "@contentful-demos/component-definitions";

type ComponentDefinitionInfo = {
  componentDefinition: CDefDefinition;
  manifestDefinition: CDefManifestDefinition;
};
const CompDefCache: { [tag: string]: ComponentDefinitionInfo | false } = {};

export default async function getComponentDefinition(
  manifestUrl: string,
  componentTag: string,
): Promise<
  | {
      componentDefinition: CDefDefinition;
      manifestDefinition: CDefManifestDefinition;
    }
  | undefined
> {
  if (CompDefCache[componentTag] !== undefined) {
    if (CompDefCache[componentTag] === false) {
      return undefined;
    } else {
      return CompDefCache[componentTag] as ComponentDefinitionInfo;
    }
  }
  const manifest: CDefManifest = await fetchJson(manifestUrl);
  console.log("componentTag", componentTag);
  console.log("manifest", manifest);
  if (manifest && manifest.definitions[componentTag]) {
    // get the root of all definitions from the manifest url
    const manifestDef = manifest.definitions[componentTag];
    const compDefFile = manifestDef.id;
    const cdefRoot = getCDefPathRoot(manifestUrl);
    const url = `${cdefRoot}/${compDefFile}`;
    // load just that definition
    const compDef: CDefDefinition = await fetchJson(url);
    const compInfo: ComponentDefinitionInfo = {
      componentDefinition: compDef,
      manifestDefinition: manifestDef,
    };
    CompDefCache[componentTag] = compInfo;
    return compInfo;
  }
  CompDefCache[componentTag] = false;
  return undefined;
}

export async function getComponentExample(
  manifestUrl: string,
  example: CDefExample,
): Promise<CDefInstance> {
  const cdefRoot = getCDefPathRoot(manifestUrl);
  const url = `${cdefRoot}/${example.$id}`;
  // load just that definition
  const compExample: CDefInstance = await fetchJson(url);
  return compExample;
}

export async function getCDefTokens(
  manifestUrl: string,
): Promise<CDefTokens | undefined> {
  const manifest: CDefManifest = await fetchJson(manifestUrl);
  if (manifest && manifest.tokens?.tokens) {
    const cdefRoot = getCDefPathRoot(manifestUrl);
    const url = `${cdefRoot}/${manifest.tokens?.tokens}`;
    const tokens: CDefTokens = await fetchJson(url);
    return tokens;
  }
}

function getCDefPathRoot(manifestUrl: string) {
  const cdefRootArr = manifestUrl.split("/");
  cdefRootArr.pop();
  const cdefRoot = cdefRootArr.join("/");
  return cdefRoot;
}

async function fetchJson(url: string): Promise<any | false> {
  const response = await fetch(`${url}?${Math.floor(Math.random() * 100000)}`);
  if (!response.ok) {
    console.log(`error loading ${url}: ${response.status}`);
    return false;
  }
  let json;
  try {
    json = await response.json();
  } catch (jsonError: any) {
    console.log(`Error parsing JSON: ${jsonError.message || "Unknown error"}`);
    return false;
  }
  return json;
}

import { CDefManifest, CDefTokenLookup } from "../../types";
import { fetchJson } from "./getComponentDefinition";

export default async function getComponentDefinitionTokenLookup(
    cDefPath: string,
  ) : Promise<CDefTokenLookup | undefined> {
    const manifest: CDefManifest = await fetchJson(`${cDefPath}/manifest.json`);
    if (manifest) {
      if (manifest.tokenLookup) {
        const tokenLookup: CDefTokenLookup = await fetchJson(`${cDefPath}/${manifest.tokenLookup}`);
        return tokenLookup;
      }
    }
    return undefined;
}
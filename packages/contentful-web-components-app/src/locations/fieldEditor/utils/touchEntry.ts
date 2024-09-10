import { CMAClient } from "@contentful/app-sdk";

export default async function touchEntry(
  cma: CMAClient,
  entryId: string
) {
  const cmaEntry = await cma.entry.get({entryId});
  await cma.entry.update({entryId}, cmaEntry);
}
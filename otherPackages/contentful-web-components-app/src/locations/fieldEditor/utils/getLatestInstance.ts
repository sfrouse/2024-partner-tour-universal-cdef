import { CDefDefinition, CDefInstance } from "@contentful-demos/component-definitions";

export default function getLatestInstance(
    componentDefinition: CDefDefinition,
    entryInstance?: CDefInstance,
    entryId?: string
) {
    // make sure there is a full instance relative to comp definition
  let finalEntryInst: CDefInstance = {};
  if (componentDefinition && componentDefinition.properties) {
    // use the comp definition as the backbone
    // this will naturally prune the existing entry instance
    const properties = Object.entries(componentDefinition.properties);
    finalEntryInst['$schema'] = componentDefinition.$id;
    finalEntryInst['$identifier'] = {contentful: entryId};
    properties.map((propertyInfo) => {
      const name = propertyInfo[0];
      const property = propertyInfo[1] as CDefDefinition;

      // if there is no metadata, kick out
      if (!property["x-cdef"]) return true;

      const input = property["x-cdef"].input;

      // start with the entry value
      // a CTFL Instance is a dynamic mix of content props overlaid on comp instance props
      const hasEntryValue = (entryInstance && entryInstance[name] !== undefined);
      if (hasEntryValue) {
        finalEntryInst[name] = entryInstance[name];
      }else if (input?.defaultValue !== undefined) {
        // otherwise it is the default defined in the definition (if there is one)
        finalEntryInst[name] = input.defaultValue;
      }
      return true;
    });
  }
  return finalEntryInst;
}
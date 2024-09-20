
export default function isEntryOrEntryArray(value: any) {
  if (value) {
    if (value['sys'] !== undefined) {
      return true;
    }
    if (Array.isArray(value)) {
      // just takes one...
      const hasEntry = value.find(val => val['sys'] !== undefined);
      if (hasEntry) {
        return true;
      }
    }
  }
  return false;
}
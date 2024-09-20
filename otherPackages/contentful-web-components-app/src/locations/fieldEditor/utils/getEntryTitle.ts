import { EntryProps, KeyValueMap } from "contentful-management";


export default function getEntryTitle(entry: EntryProps<KeyValueMap> | undefined) {
  if (!entry) return '';
  if (entry.fields.title) {
    return entry.fields.title['en-US'];
  }
  if (entry.fields.label) {
    return entry.fields.label['en-US'];
  }
  return entry.sys.id;
}
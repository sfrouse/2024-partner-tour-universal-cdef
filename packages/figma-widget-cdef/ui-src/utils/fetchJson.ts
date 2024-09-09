export default async function fetchJson(url: string): Promise<any | false> {
    try {
      const response = await fetch(`${url}?${Math.floor(Math.random()*100000)}`);
      if (!response.ok) {
        console.log(`error loading ${url}: ${response.status}`);
        return false;
      }
      const json = await response.json();
      return json;
    } catch (jsonError: any) {
      console.log(`Error parsing JSON: ${jsonError.message || 'Unknown error'}`);
      return false;
    }
  }
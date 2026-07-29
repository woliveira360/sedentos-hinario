import hymnsData from "@/data/hymns.json";
import type { Hymn, ParsedHymn } from "@/types/hymn";

export function parseHymns(): ParsedHymn[] {
  return (hymnsData as Hymn[])
    .map((hymn) => {
      // Extract number from filename like "HCCCon 613.pdf"
      const match = hymn.Hino.match(/HCCCon\s+(\d+)\.pdf/i);
      const number = match ? parseInt(match[1], 10) : 0;
      
      return {
        id: hymn.Hino,
        number,
        name: `Hino ${number}`,
        previewUrl: hymn["Link de Visualização"],
      };
    })
    .filter((h) => h.number > 0)
    .sort((a, b) => a.number - b.number);
}

export function searchHymns(hymns: ParsedHymn[], query: string): ParsedHymn[] {
  if (!query.trim()) return hymns;
  
  const lowerQuery = query.toLowerCase().trim();
  const numericQuery = parseInt(query, 10);
  
  return hymns.filter((hymn) => {
    // Search by number
    if (!isNaN(numericQuery)) {
      return hymn.number.toString().includes(query);
    }
    // Search by name
    return hymn.name.toLowerCase().includes(lowerQuery);
  });
}

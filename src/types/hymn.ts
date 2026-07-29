export interface Hymn {
  Hino: string;
  "Link de Visualização": string;
}

export interface ParsedHymn {
  id: string;
  number: number;
  name: string;
  previewUrl: string;
}

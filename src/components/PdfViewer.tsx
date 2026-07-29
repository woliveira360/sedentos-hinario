import type { ParsedHymn } from "@/types/hymn";
import { X, ExternalLink, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfViewerProps {
  hymn: ParsedHymn;
  onClose: () => void;
}

// Convert Google Drive preview URL to download URL
function getDownloadUrl(previewUrl: string): string {
  // Extract file ID from various Google Drive URL formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = previewUrl.match(pattern);
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  
  return previewUrl;
}

export function PdfViewer({ hymn, onClose }: PdfViewerProps) {
  const downloadUrl = getDownloadUrl(hymn.previewUrl);
  
  return (
    <div className="pdf-viewer-container h-full flex flex-col animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-burgundy flex items-center justify-center">
            <span className="text-primary-foreground font-display font-semibold text-sm">
              {hymn.number}
            </span>
          </div>
          <div>
            <h3 className="font-display text-lg text-foreground">
              Hino {hymn.number}
            </h3>
            <p className="text-sm text-muted-foreground">Hinário para o Culto Cristão</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <a href={downloadUrl} download={`Hino-${hymn.number}.pdf`}>
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Baixar</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(hymn.previewUrl, '_blank')?.print()}
            className="text-muted-foreground hover:text-foreground"
          >
            <Printer className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <a href={hymn.previewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Abrir no Drive</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Fechar</span>
          </Button>
        </div>
      </div>
      
      {/* PDF iframe */}
      <div className="flex-1 bg-muted/30">
        <iframe
          src={hymn.previewUrl}
          className="w-full h-full border-0"
          title={`Hino ${hymn.number}`}
          allow="autoplay"
        />
      </div>
    </div>
  );
}

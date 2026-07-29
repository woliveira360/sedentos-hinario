import { useState, useMemo } from "react";
import { HymnCombobox } from "@/components/HymnCombobox";
import { PdfViewer } from "@/components/PdfViewer";
import { EmptyState } from "@/components/EmptyState";
import { parseHymns } from "@/lib/hymns";
import type { ParsedHymn } from "@/types/hymn";
import { BookOpen } from "lucide-react";

const Index = () => {
  const [selectedHymn, setSelectedHymn] = useState<ParsedHymn | null>(null);
  
  const hymns = useMemo(() => parseHymns(), []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 md:py-5">
          {/* Logo and title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl gradient-burgundy flex items-center justify-center shadow-warm">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl text-foreground">
                HCC Online
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {hymns.length} hinos disponíveis
              </p>
            </div>
          </div>
          
          {/* Search */}
          <HymnCombobox
            hymns={hymns}
            selectedHymn={selectedHymn}
            onSelect={setSelectedHymn}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-4 md:py-6">
        <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-220px)] min-h-[400px]">
          {selectedHymn ? (
            <PdfViewer 
              hymn={selectedHymn} 
              onClose={() => setSelectedHymn(null)} 
            />
          ) : (
            <div className="hymn-card h-full flex items-center justify-center">
              <EmptyState />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-border bg-card/50 py-3">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Hinário para o Culto Cristão • Para uso em cultos e estudos
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

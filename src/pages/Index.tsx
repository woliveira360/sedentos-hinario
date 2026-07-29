import { useState, useMemo } from "react";
import { HymnCombobox } from "@/components/HymnCombobox";
import { PdfViewer } from "@/components/PdfViewer";
import { EmptyState } from "@/components/EmptyState";
import { ServiceDayMenu } from "@/components/ServiceDayMenu";
import { OnboardingTour } from "@/components/OnboardingTour";
import { parseHymns } from "@/lib/hymns";
import type { ParsedHymn } from "@/types/hymn";

const Index = () => {
  const [selectedHymn, setSelectedHymn] = useState<ParsedHymn | null>(null);

  const hymns = useMemo(() => parseHymns(), []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingTour />

      <header className="shrink-0 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-2 md:py-2.5">
          <div className="flex items-center gap-2 md:gap-3">
            <a href="/" className="shrink-0 flex items-center min-w-0" aria-label="HCC Online">
              <img
                src="/logo-hcc.png"
                alt="HCC — Hinário para o Culto Cristão"
                className="h-9 md:h-11 w-auto max-w-[min(52vw,280px)] object-contain object-left"
              />
            </a>
            <span className="hidden lg:inline text-xs text-muted-foreground shrink-0">
              {hymns.length} hinos
            </span>

            <div className="flex flex-1 min-w-0 items-center gap-2 max-w-md ml-auto">
              <div data-tour="search" className="min-w-0 flex-1">
                <HymnCombobox
                  hymns={hymns}
                  selectedHymn={selectedHymn}
                  onSelect={setSelectedHymn}
                />
              </div>
              <div data-tour="culto" className="shrink-0">
                <ServiceDayMenu hymns={hymns} onOpenHymn={setSelectedHymn} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main
        className={
          selectedHymn
            ? "flex-1 min-h-0"
            : "flex-1 container max-w-6xl mx-auto px-4 py-4 md:py-6"
        }
      >
        {selectedHymn ? (
          <div className="h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-4rem)]">
            <PdfViewer
              hymn={selectedHymn}
              onClose={() => setSelectedHymn(null)}
            />
          </div>
        ) : (
          <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-150px)] min-h-[400px]">
            <div className="hymn-card h-full flex items-center justify-center">
              <EmptyState />
            </div>
          </div>
        )}
      </main>

      {!selectedHymn && (
        <footer className="shrink-0 border-t border-border bg-card/50 py-3">
          <div className="container max-w-6xl mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Hinário para o Culto Cristão • Para uso em cultos e estudos
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;

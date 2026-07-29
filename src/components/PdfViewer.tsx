import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ParsedHymn } from "@/types/hymn";
import {
  X,
  ExternalLink,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PdfViewerProps {
  hymn: ParsedHymn;
  onClose: () => void;
}

function extractDriveId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getDownloadUrl(previewUrl: string): string {
  const id = extractDriveId(previewUrl);
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
  return previewUrl;
}

function getEmbedUrl(previewUrl: string): string {
  const id = extractDriveId(previewUrl);
  if (id) return `https://drive.google.com/file/d/${id}/preview`;
  return previewUrl;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

export function PdfViewer({ hymn, onClose }: PdfViewerProps) {
  const [immersive, setImmersive] = useState(true);
  const [zoom, setZoom] = useState(1.15);
  /** Immersive: header starts collapsed */
  const [chromeVisible, setChromeVisible] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const downloadUrl = getDownloadUrl(hymn.previewUrl);
  const embedUrl = getEmbedUrl(hymn.previewUrl);

  const clearHideTimer = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const showChrome = useCallback(() => {
    setChromeVisible(true);
    clearHideTimer();
    hideTimer.current = window.setTimeout(() => setChromeVisible(false), 2500);
  }, []);

  const hideChrome = useCallback(() => {
    clearHideTimer();
    setChromeVisible(false);
  }, []);

  useEffect(() => {
    if (!immersive) {
      setChromeVisible(true);
      clearHideTimer();
      return;
    }
    // Immersive: brief flash then collapse
    setChromeVisible(true);
    hideTimer.current = window.setTimeout(() => setChromeVisible(false), 1800);
    return clearHideTimer;
  }, [immersive]);

  useEffect(() => {
    if (!immersive) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (chromeVisible) {
          hideChrome();
          return;
        }
        setImmersive(false);
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        }
      }
      if (e.key === "+" || e.key === "=") {
        setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
      }
      if (e.key === "-" || e.key === "_") {
        setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [immersive, chromeVisible, hideChrome]);

  const enterImmersive = async () => {
    setZoom(1.15);
    setImmersive(true);
    try {
      await stageRef.current?.requestFullscreen?.();
    } catch {
      /* iOS: CSS immersive only */
    }
  };

  const exitImmersive = async () => {
    setImmersive(false);
    setZoom(1);
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        /* ignore */
      }
    }
  };

  const zoomIn = () =>
    setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
  const zoomOut = () =>
    setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
  const resetZoom = () => setZoom(immersive ? 1.15 : 1);

  const toolbarInner = (
    <>
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-lg gradient-burgundy flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-display font-semibold text-xs">
            {hymn.number}
          </span>
        </div>
        <div className="min-w-0 hidden sm:block">
          <h3 className="font-display text-base text-foreground leading-tight truncate">
            Hino {hymn.number}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {immersive && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Diminuir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <button
              type="button"
              onClick={resetZoom}
              className="px-1.5 text-xs tabular-nums text-muted-foreground hover:text-foreground min-w-[3rem]"
            >
              {Math.round(zoom * 100)}%
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground hidden md:inline-flex"
        >
          <a href={downloadUrl} download={`Hino-${hymn.number}.pdf`}>
            <Download className="w-4 h-4 mr-1.5" />
            Baixar
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(hymn.previewUrl, "_blank")?.print()}
          className="text-muted-foreground hover:text-foreground hidden lg:inline-flex"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Imprimir
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
        >
          <a href={hymn.previewUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-1.5" />
            Drive
          </a>
        </Button>

        <Button
          variant={immersive ? "secondary" : "default"}
          size="sm"
          onClick={() => (immersive ? exitImmersive() : enterImmersive())}
          className={cn(
            "h-8 gap-1.5",
            !immersive && "gradient-burgundy text-primary-foreground hover:opacity-90",
          )}
          aria-label={immersive ? "Sair da tela cheia" : "Tela cheia"}
        >
          {immersive ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {immersive ? "Sair" : "Tela cheia"}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            void exitImmersive();
            onClose();
          }}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Fechar</span>
        </Button>
      </div>
    </>
  );

  const stage = (
    <div
      ref={stageRef}
      className={cn(
        "bg-neutral-950",
        immersive
          ? "fixed inset-0 z-[200] w-screen h-[100dvh]"
          : "relative flex h-full flex-col pdf-viewer-container animate-scale-in",
      )}
    >
      {/* Non-immersive: normal in-flow header */}
      {!immersive && (
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3 py-2 md:px-4">
          {toolbarInner}
        </div>
      )}

      {/* Immersive: overlay header that slides away (no layout space) */}
      {immersive && (
        <>
          {/*
            iframe swallows clicks — when header hidden, full-screen
            catcher above iframe so any tap/click reveals controls.
          */}
          {!chromeVisible && (
            <button
              type="button"
              aria-label="Mostrar menu"
              className="absolute inset-0 z-[210] cursor-default touch-manipulation bg-transparent"
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                showChrome();
              }}
            />
          )}

          <div
            className={cn(
              "absolute inset-x-0 top-0 z-[220] flex items-center justify-between gap-2 border-b border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-out md:px-4",
              chromeVisible ? "translate-y-0" : "-translate-y-full pointer-events-none",
            )}
            onPointerDown={(e) => {
              e.stopPropagation();
              showChrome();
            }}
          >
            {toolbarInner}
          </div>
        </>
      )}

      <div
        className={cn(
          "overflow-auto bg-neutral-950 touch-pan-x touch-pan-y",
          immersive ? "absolute inset-0" : "relative min-h-0 flex-1",
        )}
      >
        <div
          className="origin-top-left transition-[width,height] duration-150"
          style={{
            width: `${zoom * 100}%`,
            height: `${zoom * 100}%`,
            minWidth: "100%",
            minHeight: "100%",
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <iframe
              src={embedUrl}
              className="absolute border-0 bg-neutral-950"
              style={{
                top: 0,
                left: immersive ? "-1%" : 0,
                width: immersive ? "102%" : "100%",
                height: immersive ? "104%" : "100%",
              }}
              title={`Hino ${hymn.number}`}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (immersive) {
    return createPortal(stage, document.body);
  }

  return stage;
}

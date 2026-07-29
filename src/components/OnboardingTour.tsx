import { useCallback, useEffect, useLayoutEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  Download,
  ListMusic,
  Maximize2,
  Search,
  Touchpad,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  hasCompletedOnboarding,
  markOnboardingDone,
} from "@/lib/onboarding";

type Step = {
  id: string;
  title: string;
  body: string;
  /** CSS selector for spotlight target */
  target?: string;
  icon: typeof Search;
};

const STEPS: Step[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao HCC Online",
    body: "Tour rápido das funções principais. Leva menos de um minuto — aparece só esta primeira vez.",
    icon: Search,
  },
  {
    id: "search",
    title: "Buscar um hino",
    body: "Toque em “Buscar hino…” e digite o número. O PDF da partitura abre na hora.",
    target: "[data-tour='search']",
    icon: Search,
  },
  {
    id: "fullscreen",
    title: "Tela cheia da partitura",
    body: "Ao abrir um hino, a partitura já entra em tela cheia — ideal para tablet e iPad no culto.",
    icon: Maximize2,
  },
  {
    id: "toolbar",
    title: "Menu na partitura",
    body: "Na tela cheia o menu some sozinho. Toque em qualquer lugar da tela para ele voltar (zoom, baixar, sair).",
    icon: Touchpad,
  },
  {
    id: "download",
    title: "Baixar o PDF",
    body: "Com o menu aberto, use “Baixar” para salvar a partitura no aparelho e usar offline.",
    icon: Download,
  },
  {
    id: "culto",
    title: "Hinos do culto",
    body: "Neste ícone você monta a lista do culto: toque em +, pesquise o número e adicione. Dá para reordenar e abrir cada hino.",
    target: "[data-tour='culto']",
    icon: ListMusic,
  },
  {
    id: "expiry",
    title: "Validade da lista",
    body: "Escolha a data do culto ao gravar. Depois desse dia a lista some sozinha — sem limpar na mão.",
    target: "[data-tour='culto']",
    icon: CalendarDays,
  },
];

const PAD = 8;
const CARD_GAP = 14;

type Rect = { top: number; left: number; width: number; height: number };

function measure(selector: string): Rect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 2 && r.height < 2) return null;
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  };
}

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [placeAbove, setPlaceAbove] = useState(false);

  useEffect(() => {
    if (hasCompletedOnboarding()) return;
    const t = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(t);
  }, []);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const finish = useCallback(() => {
    markOnboardingDone();
    setOpen(false);
  }, []);

  const refresh = useCallback(() => {
    if (!current?.target) {
      setRect(null);
      return;
    }
    const next = measure(current.target);
    setRect(next);
    if (next) {
      const spaceBelow = window.innerHeight - (next.top + next.height);
      setPlaceAbove(spaceBelow < 220 && next.top > 220);
    }
  }, [current]);

  useLayoutEffect(() => {
    if (!open) return;
    refresh();
  }, [open, step, refresh]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => refresh();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, refresh]);

  if (!open || !current) return null;

  const Icon = current.icon;
  const spotlight = Boolean(current.target && rect);

  const cardStyle: CSSProperties = spotlight && rect
    ? placeAbove
      ? {
          position: "fixed",
          left: Math.min(
            Math.max(16, rect.left + rect.width / 2 - 160),
            window.innerWidth - 336,
          ),
          bottom: window.innerHeight - rect.top + CARD_GAP,
          width: "min(320px, calc(100vw - 32px))",
        }
      : {
          position: "fixed",
          left: Math.min(
            Math.max(16, rect.left + rect.width / 2 - 160),
            window.innerWidth - 336,
          ),
          top: rect.top + rect.height + CARD_GAP,
          width: "min(320px, calc(100vw - 32px))",
        }
    : {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(360px, calc(100vw - 32px))",
      };

  return createPortal(
    <div className="fixed inset-0 z-[300]" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      {spotlight && rect ? (
        <div
          className="pointer-events-none absolute rounded-xl ring-2 ring-[#732633]/80 transition-all duration-300"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
          }}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 bg-black/55" aria-hidden />
      )}

      {/* Block interaction with app under tour */}
      <div className="absolute inset-0" aria-hidden />

      <div
        className="relative z-[301] rounded-2xl border border-border bg-card p-4 shadow-warm-lg"
        style={cardStyle}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-burgundy">
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
          <button
            type="button"
            onClick={finish}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Fechar tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-1 text-xs font-medium text-muted-foreground">
          {step + 1} de {STEPS.length}
        </p>
        <h2 id="tour-title" className="mb-2 font-display text-lg text-foreground">
          {current.title}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {current.body}
        </p>

        <div className="mb-4 flex gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={finish}
          >
            Pular
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
              >
                Voltar
              </Button>
            )}
            <Button
              size="sm"
              className="gradient-burgundy text-primary-foreground hover:opacity-90"
              onClick={() => {
                if (isLast) finish();
                else setStep((s) => s + 1);
              }}
            >
              {isLast ? "Começar" : "Próximo"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

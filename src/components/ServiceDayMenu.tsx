import * as React from "react";
import { useCallback } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  ListMusic,
  Music,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useServiceDay } from "@/hooks/use-service-day";
import { todayISO } from "@/lib/service-day";
import type { ParsedHymn } from "@/types/hymn";

interface ServiceDayMenuProps {
  hymns: ParsedHymn[];
  onOpenHymn: (hymn: ParsedHymn) => void;
}

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function ServiceDayMenu({ hymns, onOpenHymn }: ServiceDayMenuProps) {
  const { plan, ready, setDate, addHymn, removeHymn, moveHymn, clear } =
    useServiceDay();
  const [open, setOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const date = plan?.date ?? todayISO();
  const hymnNumbers = plan?.hymnNumbers ?? [];
  const count = hymnNumbers.length;

  const hymnByNumber = React.useMemo(() => {
    const map = new Map<number, ParsedHymn>();
    for (const h of hymns) map.set(h.number, h);
    return map;
  }, [hymns]);

  const availableHymns = React.useMemo(
    () => hymns.filter((h) => !hymnNumbers.includes(h.number)),
    [hymns, hymnNumbers],
  );

  const handleAdd = useCallback(
    (hymn: ParsedHymn) => {
      addHymn(hymn.number);
      setAddOpen(false);
    },
    [addHymn],
  );

  if (!ready) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative h-9 w-9 shrink-0 rounded-lg border-border"
        aria-label="Hinos do culto"
        disabled
      >
        <ListMusic className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 shrink-0 rounded-lg border-border"
          aria-label="Hinos do culto"
          title="Hinos do culto"
        >
          <ListMusic className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full gradient-burgundy px-1 text-[10px] font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-display text-xl">Hinos do culto</SheetTitle>
          <SheetDescription>
            Monte a lista do culto. Expira após a data escolhida.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => {
              if (e.target.value) setDate(e.target.value);
            }}
            className="h-9 flex-1"
          />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {formatDisplayDate(date)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 px-5 py-3">
          <p className="text-sm text-muted-foreground">
            {count === 0
              ? "Nenhum hino ainda"
              : `${count} hino${count > 1 ? "s" : ""}`}
          </p>

          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <PopoverTrigger asChild>
              <Button size="sm" className="h-8 gap-1.5 rounded-lg gradient-burgundy text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[min(100vw-2rem,320px)] p-0 rounded-xl border border-border shadow-warm-lg"
              align="end"
              sideOffset={8}
            >
              <Command className="rounded-xl">
                <CommandInput
                  placeholder="Número do hino..."
                  className="h-10 text-sm"
                />
                <CommandList className="max-h-[280px]">
                  <CommandEmpty className="py-6 text-center">
                    <Search className="mx-auto mb-2 h-7 w-7 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum hino encontrado.
                    </p>
                  </CommandEmpty>
                  <CommandGroup>
                    {availableHymns.map((hymn) => (
                      <CommandItem
                        key={hymn.id}
                        value={hymn.number.toString()}
                        onSelect={() => handleAdd(hymn)}
                        className="cursor-pointer px-3 py-2"
                      >
                        <div className="flex flex-1 items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-display font-semibold text-muted-foreground">
                            {hymn.number}
                          </div>
                          <span className="text-sm">Hino {hymn.number}</span>
                        </div>
                        <Plus className="ml-auto h-4 w-4 text-primary" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Music className="h-7 w-7 text-muted-foreground/60" />
              </div>
              <p className="mb-1 font-display text-lg text-foreground">
                Lista vazia
              </p>
              <p className="text-sm text-muted-foreground">
                Toque em + para pesquisar e gravar hinos do culto.
              </p>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {hymnNumbers.map((number, index) => {
                const hymn = hymnByNumber.get(number);
                return (
                  <li
                    key={number}
                    className="flex items-center gap-1 rounded-xl border border-border bg-card px-2 py-1.5"
                  >
                    <span className="w-5 shrink-0 text-center text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1 py-1 text-left hover:bg-muted/60"
                      onClick={() => {
                        if (hymn) {
                          onOpenHymn(hymn);
                          setOpen(false);
                        }
                      }}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-burgundy text-xs font-display font-semibold text-primary-foreground">
                        {number}
                      </div>
                      <span className="truncate text-sm font-medium">
                        Hino {number}
                      </span>
                      {hymn && (
                        <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary/50" />
                      )}
                    </button>

                    <div className="flex shrink-0 flex-col">
                      <button
                        type="button"
                        className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                        disabled={index === 0}
                        onClick={() => moveHymn(number, -1)}
                        aria-label="Subir"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                        disabled={index === hymnNumbers.length - 1}
                        onClick={() => moveHymn(number, 1)}
                        aria-label="Descer"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeHymn(number)}
                      aria-label={`Remover hino ${number}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {count > 0 && (
          <div className="border-t border-border px-5 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-muted-foreground hover:text-destructive"
              onClick={clear}
            >
              <Trash2 className="h-4 w-4" />
              Limpar lista
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

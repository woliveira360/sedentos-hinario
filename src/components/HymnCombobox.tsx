import * as React from "react";
import { Check, ChevronsUpDown, Search, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import type { ParsedHymn } from "@/types/hymn";

interface HymnComboboxProps {
  hymns: ParsedHymn[];
  selectedHymn: ParsedHymn | null;
  onSelect: (hymn: ParsedHymn | null) => void;
}

export function HymnCombobox({ hymns, selectedHymn, onSelect }: HymnComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 md:h-10 px-2.5 md:px-3 bg-card border border-border hover:border-primary/50 hover:bg-card text-left font-normal rounded-lg shadow-sm transition-all duration-200"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn(
              "w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors",
              selectedHymn ? "gradient-burgundy" : "bg-muted"
            )}>
              {selectedHymn ? (
                <span className="text-primary-foreground font-display font-semibold text-[10px]">
                  {selectedHymn.number}
                </span>
              ) : (
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
            <span className={cn(
              "text-sm truncate",
              selectedHymn ? "text-foreground" : "text-muted-foreground"
            )}>
              {selectedHymn ? `Hino ${selectedHymn.number}` : "Buscar hino..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[min(100vw-2rem,var(--radix-popover-trigger-width))] min-w-[240px] p-0 rounded-xl shadow-warm-lg border border-border"
        align="end"
      >
        <Command className="rounded-xl">
          <CommandInput 
            placeholder="Número do hino..." 
            className="h-10 text-sm"
          />
          <CommandList className="max-h-[280px] md:max-h-[360px]">
            <CommandEmpty className="py-6 text-center">
              <Music className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Nenhum hino encontrado.</p>
            </CommandEmpty>
            <CommandGroup>
              {hymns.map((hymn) => (
                <CommandItem
                  key={hymn.id}
                  value={hymn.number.toString()}
                  onSelect={() => {
                    onSelect(hymn.id === selectedHymn?.id ? null : hymn);
                    setOpen(false);
                  }}
                  className="py-2 px-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 flex-1">
                    <div className={cn(
                      "w-7 h-7 rounded-md flex items-center justify-center text-xs font-display font-semibold transition-colors",
                      selectedHymn?.id === hymn.id 
                        ? "gradient-burgundy text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {hymn.number}
                    </div>
                    <span className="text-sm">Hino {hymn.number}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-primary",
                      selectedHymn?.id === hymn.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

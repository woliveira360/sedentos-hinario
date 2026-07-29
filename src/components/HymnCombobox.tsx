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
          className="w-full justify-between h-14 md:h-16 px-4 md:px-6 bg-card border-2 border-border hover:border-primary/50 hover:bg-card text-left font-normal rounded-xl shadow-warm transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              selectedHymn ? "gradient-burgundy" : "bg-muted"
            )}>
              {selectedHymn ? (
                <span className="text-primary-foreground font-display font-semibold text-sm">
                  {selectedHymn.number}
                </span>
              ) : (
                <Search className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <span className={cn(
              "text-base md:text-lg",
              selectedHymn ? "text-foreground" : "text-muted-foreground"
            )}>
              {selectedHymn ? `Hino ${selectedHymn.number}` : "Pesquisar hino por número..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl shadow-warm-lg border-2 border-border"
        align="start"
      >
        <Command className="rounded-xl">
          <CommandInput 
            placeholder="Digite o número do hino..." 
            className="h-12 text-base"
          />
          <CommandList className="max-h-[300px] md:max-h-[400px]">
            <CommandEmpty className="py-8 text-center">
              <Music className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">Nenhum hino encontrado.</p>
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
                  className="py-3 px-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-display font-semibold transition-colors",
                      selectedHymn?.id === hymn.id 
                        ? "gradient-burgundy text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {hymn.number}
                    </div>
                    <span className="text-base">Hino {hymn.number}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-5 w-5 text-primary",
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

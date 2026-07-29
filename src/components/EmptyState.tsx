import { Music, BookOpen } from "lucide-react";

export function EmptyState() {
  return (
    <div className="empty-state-container h-full min-h-[400px] animate-fade-in">
      <div className="relative mb-8">
        {/* Decorative background circle */}
        <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-muted -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-60" />
        
        {/* Icon container */}
        <div className="relative w-24 h-24 rounded-2xl gradient-burgundy flex items-center justify-center shadow-warm animate-float">
          <BookOpen className="w-12 h-12 text-primary-foreground" strokeWidth={1.5} />
        </div>
        
        {/* Small decorative music note */}
        <div className="absolute -right-2 -top-2 w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-warm">
          <Music className="w-5 h-5 text-accent-foreground" strokeWidth={2} />
        </div>
      </div>
      
      <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">
        Hinário Digital
      </h2>
      
      <p className="text-muted-foreground text-lg max-w-sm mb-6">
        Pesquise um hino pelo número ou nome para visualizar a partitura
      </p>
      
      {/* Decorative divider */}
      <div className="flex items-center gap-3 text-muted-foreground/40">
        <div className="w-12 h-px bg-border" />
        <Music className="w-4 h-4" />
        <div className="w-12 h-px bg-border" />
      </div>
    </div>
  );
}

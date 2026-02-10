import { formatDateFr } from "@/lib/genealogy-utils"
import { Calendar, MapPin, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface LifeEvent {
    id: string
    type: string
    title: string
    description: string | null
    date: Date
    place: string | null
}

interface LifeEventTimelineProps {
    events: LifeEvent[]
}

export function LifeEventTimeline({ events }: LifeEventTimelineProps) {
    return (
        <div className="space-y-16 relative before:absolute before:inset-0 before:left-[-1px] before:h-full before:w-px before:bg-linear-to-b before:from-primary before:via-accent before:to-transparent">
            {events.map((event, index) => (
                <div key={event.id} className="relative pl-12 group animate-reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Decorative Dot */}
                    <div className="absolute -left-[10px] top-0 h-5 w-5 rounded-full border-4 border-background bg-primary shadow-lg ring-4 ring-primary/5 transition-all duration-500 group-hover:scale-125 group-hover:bg-accent z-10" />

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest shadow-inner">
                                {formatDateFr(event.date)}
                            </div>
                            <h3 className="text-2xl font-serif font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                                {event.title}
                            </h3>
                        </div>

                        <div className="premium-card rounded-2xl p-6 bg-background/50 backdrop-blur-sm border-border group-hover:border-primary/20 transition-all">
                            {event.place && (
                                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-accent/10 flex items-center justify-center">
                                        <MapPin className="h-3.5 w-3.5 text-accent" />
                                    </div>
                                    {event.place}
                                </div>
                            )}

                            {event.description ? (
                                <p className="text-foreground/80 leading-relaxed text-lg font-serif italic text-pretty">
                                    &ldquo;{event.description}&rdquo;
                                </p>
                            ) : (
                                <div className="flex items-center gap-3 text-muted-foreground/50 italic text-sm py-2">
                                    <div className="h-1 w-8 bg-border/50 rounded-full" />
                                    Postérité en attente de récit
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

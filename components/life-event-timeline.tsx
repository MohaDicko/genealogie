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
        <div className="space-y-12 relative before:absolute before:inset-0 before:left-[15px] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/20 before:to-transparent">
            {events.map((event, index) => (
                <div key={event.id} className="relative pl-10 group">
                    {/* Dot */}
                    <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full border-4 border-background bg-primary group-hover:scale-110 transition-transform flex items-center justify-center shadow-sm z-10">
                        <div className="h-2 w-2 rounded-full bg-background" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded">
                                {formatDateFr(event.date)}
                            </span>
                            <h3 className="text-xl font-serif font-bold text-foreground">{event.title}</h3>
                        </div>

                        <div className="bg-muted/30 rounded-xl p-4 mt-2 border border-border/50 group-hover:bg-muted/50 transition-colors">
                            {event.place && (
                                <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <MapPin className="h-4 w-4 text-primary/60" />
                                    {event.place}
                                </p>
                            )}

                            {event.description ? (
                                <p className="text-foreground/80 leading-relaxed italic">
                                    &ldquo;{event.description}&rdquo;
                                </p>
                            ) : (
                                <p className="text-muted-foreground text-sm flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Aucune description supplémentaire.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

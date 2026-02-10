import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { calculateAge, formatDateFr } from "@/lib/genealogy-utils"
import type { Person } from "@/lib/types"
import { Calendar, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"

interface PersonCardProps {
  person: Person
  variant?: "default" | "compact" | "detailed"
  className?: string
  showLink?: boolean
}

export function PersonCard({ person, variant = "default", className, showLink = true }: PersonCardProps) {
  const age = calculateAge(person.birthDate, person.deathDate)
  const isDeceased = !!person.deathDate
  const initials = `${person.firstName[0]}${person.lastName[0]}`

  const content = (
    <Card
      className={cn(
        "premium-card group relative overflow-hidden animate-reveal border-none bg-card/50 backdrop-blur-sm",
        isDeceased && "opacity-95",
        className,
      )}
    >
      {/* Premium Glass Overlay on Hover */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 h-24 w-24 bg-linear-to-bl from-primary/20 via-primary/5 to-transparent transition-all duration-700 group-hover:scale-150 rotate-12 opacity-40 group-hover:opacity-100 pointer-events-none" />

      <CardContent className={cn("flex gap-6 relative z-10", variant === "compact" ? "p-4" : "p-8")}>
        <div className="relative shrink-0">
          <Avatar
            className={cn(
              "border-4 border-white/50 dark:border-white/5 shadow-2xl ring-4 ring-primary/10 transition-all duration-700 group-hover:ring-primary/40 group-hover:scale-105 group-hover:-rotate-3",
              variant === "compact" ? "h-16 w-16 rounded-2xl" : "h-28 w-28 rounded-3xl",
            )}
          >
            <AvatarImage src={person.photoUrl || undefined} alt={`${person.firstName} ${person.lastName}`} className="object-cover" />
            <AvatarFallback className="text-3xl font-serif font-black bg-linear-to-br from-primary/10 to-accent/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          {isDeceased && (
            <div className="absolute -bottom-2 -right-2 bg-background/90 backdrop-blur border border-border/50 rounded-xl px-2 py-1 shadow-premium group-hover:scale-110 transition-transform">
              <span className="text-xs grayscale opacity-70">🕊️</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-3">
          <div className="space-y-1.5">
            <h3
              className={cn(
                "font-serif font-black text-foreground tracking-tight leading-tight transition-colors group-hover:text-primary",
                variant === "compact" ? "text-xl" : "text-3xl",
              )}
            >
              {person.firstName} <span className="opacity-80 group-hover:opacity-100">{person.lastName}</span>
            </h3>
            {person.birthName && person.birthName !== person.lastName && (
              <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] italic">
                Nom de naissance : {person.birthName}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {person.birthDate && (
              <Badge variant="secondary" className="gap-2 py-1.5 px-3 bg-primary/5 hover:bg-primary/10 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-primary/80 transition-colors">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateFr(person.birthDate)}
              </Badge>
            )}
            {age !== null && (
              <Badge variant="outline" className="py-1.5 px-3 border-border/50 bg-background/30 backdrop-blur rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm">
                {isDeceased ? `Longévité : ${age} ans` : `${age} ans`}
              </Badge>
            )}
          </div>

          {variant === "detailed" && (
            <div className="pt-4 space-y-3 border-t border-border/20 mt-2 animate-reveal delay-100">
              {person.birthPlace && (
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-accent" />
                  </div>
                  <span className="truncate">{person.birthPlace}</span>
                </div>
              )}
              {person.occupation && (
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <span className="truncate font-bold italic">{person.occupation}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (showLink) {
    return (
      <Link href={`/person/${person.id}`} className="block">
        {content}
      </Link>
    )
  }

  return content
}

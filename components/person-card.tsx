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
        "group transition-all duration-200 hover:shadow-lg cursor-pointer",
        isDeceased && "opacity-90",
        className,
      )}
    >
      <CardContent className={cn("flex gap-4", variant === "compact" ? "p-3" : "p-5")}>
        <Avatar
          className={cn(
            "border-2 border-border transition-transform group-hover:scale-105",
            variant === "compact" ? "h-12 w-12" : "h-20 w-20",
          )}
        >
          <AvatarImage src={person.photoUrl || undefined} alt={`${person.firstName} ${person.lastName}`} />
          <AvatarFallback className="text-xl font-serif bg-secondary text-secondary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h3
              className={cn(
                "font-serif font-semibold text-foreground group-hover:text-primary transition-colors",
                variant === "compact" ? "text-base" : "text-xl",
              )}
            >
              {person.firstName} {person.lastName}
            </h3>
            {person.birthName && person.birthName !== person.lastName && (
              <p className="text-sm text-muted-foreground">née {person.birthName}</p>
            )}
          </div>

          {variant !== "compact" && (
            <div className="flex flex-wrap gap-2">
              {person.birthDate && (
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateFr(person.birthDate)}
                </Badge>
              )}
              {age !== null && <Badge variant="outline">{isDeceased ? `† ${age} ans` : `${age} ans`}</Badge>}
            </div>
          )}

          {variant === "detailed" && (
            <div className="space-y-1 text-sm text-muted-foreground">
              {person.birthPlace && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {person.birthPlace}
                </p>
              )}
              {person.occupation && (
                <p className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {person.occupation}
                </p>
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

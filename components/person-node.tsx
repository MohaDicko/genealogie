"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { calculateAge, formatDateFr } from "@/lib/genealogy-utils"
import type { Person } from "@/lib/types"

interface PersonNodeData {
  person: Person
  generation: number
  isRoot?: boolean
  isDirectLineage?: boolean
}

function PersonNodeComponent({ data, selected }: NodeProps<PersonNodeData>) {
  const { person, isRoot, isDirectLineage } = data
  const age = calculateAge(person.birthDate, person.deathDate)
  const isDeceased = !!person.deathDate

  const initials = `${person.firstName[0]}${person.lastName[0]}`

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3" />

      <Card
        className={cn(
          "w-56 cursor-pointer transition-all duration-200 hover:shadow-lg",
          isRoot && "ring-2 ring-primary ring-offset-2",
          isDirectLineage && "ring-2 ring-accent ring-offset-2",
          selected && "ring-2 ring-ring ring-offset-2",
          isDeceased && "opacity-85",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-border">
              <AvatarImage src={person.photoUrl || undefined} alt={`${person.firstName} ${person.lastName}`} />
              <AvatarFallback className="text-lg font-serif bg-secondary text-secondary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-semibold text-base text-foreground truncate">{person.firstName}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {person.lastName}
                {person.birthName && person.birthName !== person.lastName && (
                  <span className="text-xs"> (née {person.birthName})</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {person.birthDate && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="text-primary">°</span>
                {formatDateFr(person.birthDate)}
              </p>
            )}
            {person.deathDate && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="text-destructive">†</span>
                {formatDateFr(person.deathDate)}
              </p>
            )}
            {age !== null && (
              <p className="text-xs text-muted-foreground">{isDeceased ? `Décédé(e) à ${age} ans` : `${age} ans`}</p>
            )}
            {person.birthPlace && <p className="text-xs text-muted-foreground truncate">📍 {person.birthPlace}</p>}
          </div>
        </CardContent>
      </Card>

      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3" />
    </>
  )
}

export const PersonNode = memo(PersonNodeComponent)

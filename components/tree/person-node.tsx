"use client"

import { memo } from "react"
import { useRouter } from "next/navigation"
import { Handle, Position, NodeProps, Node } from "@xyflow/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Person } from "@/lib/types"
import { cn } from "@/lib/utils"
import { formatDateFr } from "@/lib/genealogy-utils"
import { ExternalLink, Plus } from "lucide-react"

// Définition des types de données pour notre nœud
type PersonNodeData = {
    person: Person
    generation: number
    isRoot?: boolean
    isDirectLineage?: boolean
}

type PersonNodeProps = Node<PersonNodeData>

const PersonNode = ({ data }: NodeProps<PersonNodeProps>) => {
    const { person, isRoot, isDirectLineage } = data as PersonNodeData
    const router = useRouter()
    const initials = `${person.firstName[0]}${person.lastName[0]}`

    return (
        <div
            className="relative group"
            onClick={() => router.push(`/person/${person.id}`)}
        >
            {/* Handle du haut (Target) - Connexion depuis les parents */}
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-muted-foreground !w-3 !h-3 -mt-2"
                isConnectable={false}
            />

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Card
                            className={cn(
                                "w-[240px] border-2 shadow-sm transition-all hover:shadow-md cursor-pointer",
                                isRoot ? "border-primary bg-primary/5" : "border-border",
                                isDirectLineage ? "border-accent bg-accent/5" : "",
                            )}
                        >
                            <CardContent className="p-3 flex items-center gap-3">
                                <Avatar className={cn("h-12 w-12 border-2", isRoot ? "border-primary" : "border-muted")}>
                                    <AvatarImage src={person.photoUrl || undefined} alt={person.firstName} className="object-cover" />
                                    <AvatarFallback className={cn("text-sm", isRoot ? "bg-primary text-primary-foreground" : "")}>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate font-serif">
                                        {person.firstName} {person.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {person.birthDate ? new Date(person.birthDate).getFullYear() : "?"}
                                        {" - "}
                                        {person.deathDate ? new Date(person.deathDate).getFullYear() : (person.birthDate ? "Présent" : "?")}
                                    </p>
                                    {person.occupation && (
                                        <p className="text-[10px] text-muted-foreground truncate italic mt-0.5">
                                            {person.occupation}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[300px] text-sm p-4">
                        <div className="space-y-2">
                            <h4 className="font-bold text-base font-serif">{person.firstName} {person.lastName}</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="font-semibold text-muted-foreground">Naissance:</span><br />
                                    {formatDateFr(person.birthDate)} {person.birthPlace ? `à ${person.birthPlace}` : ""}
                                </div>
                                {person.deathDate && (
                                    <div>
                                        <span className="font-semibold text-muted-foreground">Décès:</span><br />
                                        {formatDateFr(person.deathDate)} {person.deathPlace ? `à ${person.deathPlace}` : ""}
                                    </div>
                                )}
                            </div>
                            {person.biography && (
                                <div className="pt-2 border-t border-border mt-2">
                                    <p className="italic text-muted-foreground line-clamp-3">
                                        &ldquo;{person.biography}&rdquo;
                                    </p>
                                </div>
                            )}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* Handle du bas (Source) - Connexion vers les enfants */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-muted-foreground !w-3 !h-3 -mb-2"
                isConnectable={false}
            />
        </div>
    )
}

export default memo(PersonNode)

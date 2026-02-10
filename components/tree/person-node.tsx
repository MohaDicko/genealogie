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
            className="relative group outline-none"
            onClick={() => router.push(`/person/${person.id}`)}
        >
            {/* Handle du haut (Target) - Connexion depuis les parents */}
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-primary/40 !w-2 !h-2 -mt-1 border-none transition-all group-hover:!bg-primary group-hover:!scale-150"
                isConnectable={false}
            />

            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        <Card
                            className={cn(
                                "w-[260px] border-none shadow-premium transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 overflow-hidden",
                                isRoot ? "bg-primary/10 ring-2 ring-primary/30" : "bg-card/90 backdrop-blur-sm",
                                isDirectLineage ? "ring-2 ring-accent/30" : "",
                            )}
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <Avatar className={cn(
                                    "h-14 w-14 rounded-2xl border-2 transition-transform duration-500 group-hover:scale-105",
                                    isRoot ? "border-primary shadow-lg shadow-primary/20" : "border-background shadow-md"
                                )}>
                                    <AvatarImage src={person.photoUrl || undefined} alt={person.firstName} className="object-cover" />
                                    <AvatarFallback className={cn("text-lg font-serif", isRoot ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "font-serif font-black text-base truncate transition-colors",
                                        isRoot ? "text-primary" : "text-foreground group-hover:text-primary"
                                    )}>
                                        {person.firstName} {person.lastName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                                            {person.birthDate ? new Date(person.birthDate).getFullYear() : "?"}
                                            {" — "}
                                            {person.deathDate ? new Date(person.deathDate).getFullYear() : (person.birthDate ? "Présent" : "?")}
                                        </p>
                                    </div>
                                    {person.occupation && (
                                        <p className="text-[11px] text-muted-foreground truncate font-medium mt-1 italic group-hover:text-foreground/70 transition-colors">
                                            {person.occupation}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[320px] p-0 overflow-hidden border-none shadow-glass rounded-2xl">
                        <div className="bg-linear-to-br from-primary/5 to-accent/5 p-5">
                            <h4 className="font-serif font-black text-xl text-gradient mb-3">{person.firstName} {person.lastName}</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="font-black text-[10px] uppercase tracking-widest text-primary/60 mt-0.5">Né(e) :</span>
                                    <span className="font-medium">{formatDateFr(person.birthDate)} {person.birthPlace ? `à ${person.birthPlace}` : ""}</span>
                                </div>
                                {person.deathDate && (
                                    <div className="flex items-start gap-2">
                                        <span className="font-black text-[10px] uppercase tracking-widest text-destructive/60 mt-0.5">Décès :</span>
                                        <span className="font-medium">{formatDateFr(person.deathDate)} {person.deathPlace ? `à ${person.deathPlace}` : ""}</span>
                                    </div>
                                )}
                            </div>
                            {person.biography && (
                                <div className="pt-4 border-t border-border/50 mt-4">
                                    <p className="italic text-muted-foreground text-xs leading-relaxed line-clamp-4">
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
                className="!bg-primary/40 !w-2 !h-2 -mb-1 border-none transition-all group-hover:!bg-primary group-hover:!scale-150"
                isConnectable={false}
            />
        </div>
    )
}

export default memo(PersonNode)

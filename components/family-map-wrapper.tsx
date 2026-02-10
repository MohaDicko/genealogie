"use client"

import dynamic from 'next/dynamic'
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const FamilyMapBase = dynamic(
    () => import('./family-map').then((mod) => mod.FamilyMap),
    {
        ssr: false,
        loading: () => (
            <Card className="h-[400px] flex items-center justify-center bg-muted/20 animate-pulse">
                <div className="flex flex-col items-center gap-4 text-muted-foreground/50">
                    <Loader2 className="h-10 w-10 animate-spin" />
                    <p className="text-sm font-medium tracking-widest uppercase">Chargement de la carte...</p>
                </div>
            </Card>
        )
    }
)

export function FamilyMapWrapper({ persons }: { persons: any[] }) {
    return <FamilyMapBase persons={persons} />
}

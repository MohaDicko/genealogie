"use client"

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PrintButton() {
    return (
        <Button
            variant="outline"
            onClick={() => window.print()}
            className="gap-2 print:hidden"
            title="Imprimer la fiche (PDF)"
        >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimer Fiche</span>
        </Button>
    )
}

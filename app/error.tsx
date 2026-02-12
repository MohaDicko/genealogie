"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-destructive/10 blur-[120px] rounded-full animate-pulse-soft" />
            </div>

            <div className="relative z-10 text-center space-y-8 animate-reveal max-w-md mx-auto">
                <div className="h-24 w-24 rounded-[2rem] bg-destructive/5 border border-destructive/20 flex items-center justify-center mx-auto shadow-premium group">
                    <AlertCircle className="h-10 w-10 text-destructive group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="space-y-4">
                    <h1 className="font-serif text-3xl font-black text-foreground">Une erreur est survenue</h1>
                    <p className="text-muted-foreground font-medium italic">
                        Nos registres ont rencontré un problème inattendu.
                    </p>
                    {process.env.NODE_ENV === "development" && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-xl text-left text-xs font-mono text-muted-foreground overflow-auto max-h-32 border border-border/50">
                            {error.message}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="rounded-xl h-12 px-6 shadow-sm hover:bg-muted/50"
                    >
                        Recharger
                    </Button>
                    <Button
                        onClick={() => reset()}
                        className="rounded-xl h-12 px-6 shadow-xl hover:scale-105 transition-transform gap-2 font-bold bg-primary text-primary-foreground"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Réessayer
                    </Button>
                </div>
            </div>
        </div>
    )
}

import { TreePine } from "lucide-react"

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
            <div className="relative">
                {/* Animated Rings */}
                <div className="absolute inset-0 -m-4 rounded-full border-4 border-primary/20 animate-ping" />
                <div className="absolute inset-0 -m-8 rounded-full border-2 border-accent/10 animate-ping [animation-delay:0.5s]" />

                {/* Logo Container */}
                <div className="relative h-20 w-20 rounded-3xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl animate-reveal">
                    <TreePine className="h-10 w-10 text-primary-foreground animate-pulse" />
                </div>
            </div>

            {/* Text Reveal */}
            <div className="mt-10 text-center space-y-2 animate-reveal [animation-delay:0.2s]">
                <h2 className="font-serif text-2xl font-black text-gradient">Famille TOURE</h2>
                <div className="flex items-center gap-2 justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-4">Chargement de votre héritage...</p>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32" />
        </div>
    )
}

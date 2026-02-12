import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TreePine, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-float [animation-delay:2s]" />
            </div>

            <div className="relative z-10 text-center space-y-8 animate-reveal max-w-md mx-auto">
                <div className="h-24 w-24 rounded-[2rem] bg-linear-to-br from-muted/50 via-muted/30 to-background border border-border/40 flex items-center justify-center mx-auto shadow-premium group">
                    <TreePine className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
                </div>

                <div className="space-y-4">
                    <h1 className="font-serif text-8xl font-black text-foreground/10 tracking-tighter select-none">404</h1>
                    <h2 className="text-3xl font-serif font-black text-foreground">Branche Introuvable</h2>
                    <p className="text-muted-foreground font-medium italic">
                        Il semble que cette page ne fasse pas partie de notre histoire connue.
                    </p>
                </div>

                <Link href="/">
                    <Button size="lg" className="rounded-2xl h-14 px-8 shadow-xl hover:scale-105 transition-transform gap-2 font-bold">
                        <ArrowLeft className="h-5 w-5" />
                        Retour aux Racines
                    </Button>
                </Link>
            </div>
        </div>
    )
}

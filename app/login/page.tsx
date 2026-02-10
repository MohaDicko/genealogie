"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Lock, Mail, Users, TreePine } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Header } from "@/components/header"

const loginSchema = z.object({
    email: z.string().email({
        message: "Veuillez entrer une adresse email valide.",
    }),
    code: z.string().min(1, {
        message: "Le code d'invitation est requis.",
    }),
})

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            code: "",
        },
    })

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                email: values.email,
                code: values.code,
                redirect: false,
            })

            setIsLoading(false)

            if (result?.error) {
                toast.error("Code d'invitation invalide ou erreur de connexion.")
            } else if (result?.ok) {
                toast.success("Connexion réussie !")
                router.push("/") // Redirection vers le dashboard
                router.refresh()
            }
        } catch (error) {
            setIsLoading(false)
            toast.error("Une erreur inattendue est survenue.")
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse-soft" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full [animation-delay:2s] animate-pulse-soft" />
            </div>

            <Header />

            <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 transition-all duration-1000">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 lg:min-h-[700px] shadow-2xl rounded-[2.5rem] overflow-hidden border border-white/20 dark:border-white/5 relative glass">

                    {/* Visual Section - The "Heritage" Side */}
                    <div className="hidden lg:flex flex-col justify-between p-16 bg-linear-to-br from-primary via-primary/90 to-accent text-primary-foreground relative overflow-hidden group">
                        {/* Interactive Background Pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-overlay" />

                        {/* Decorative Floating Circles */}
                        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
                        <div className="absolute bottom-40 left-10 w-48 h-48 bg-accent/30 rounded-full blur-3xl animate-float [animation-delay:2s]" />

                        <div className="relative z-10 space-y-10 animate-reveal">
                            <div className="inline-flex items-center gap-4 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                <TreePine className="h-8 w-8 text-white drop-shadow-md" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Héritage Certifié</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="font-serif text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight">
                                    L&apos;histoire de la <br />
                                    <span className="text-accent underline decoration-white/20 underline-offset-8 decoration-4">Famille TOURE</span>
                                </h2>
                                <p className="text-xl text-white/90 leading-relaxed font-medium max-w-lg italic">
                                    &ldquo;Chaque nom est un pont tendu entre le passé glorieux de nos aînés et l&apos;avenir radieux de nos enfants.&rdquo;
                                </p>
                            </div>
                        </div>

                        {/* Social/Status Proof with Premium Icons */}
                        <div className="relative z-10 pt-16 flex items-center gap-8 animate-reveal [animation-delay:0.3s]">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-12 w-12 rounded-full border-4 border-primary bg-linear-to-br from-white/20 to-white/5 backdrop-blur-md shadow-lg flex items-center justify-center text-[10px] font-black group-hover:translate-x-1 transition-transform">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                                <div className="h-12 w-12 rounded-full border-4 border-primary bg-accent/80 backdrop-blur-md shadow-lg flex items-center justify-center text-[10px] font-black">
                                    +100
                                </div>
                            </div>
                            <div className="h-12 w-px bg-white/20 hidden xl:block" />
                            <div>
                                <p className="text-sm font-black tracking-widest uppercase text-white/70">
                                    Généalogie Vivante
                                </p>
                                <p className="text-xs font-bold text-accent">Mise à jour aujourd&apos;hui</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section - Clean & High End */}
                    <div className="p-8 md:p-16 flex flex-col justify-center bg-card/30 dark:bg-card/20 backdrop-blur-3xl">
                        <div className="mb-12 text-center lg:text-left space-y-4 animate-reveal">
                            <div className="h-1 w-12 bg-primary mx-auto lg:mx-0 rounded-full" />
                            <h1 className="text-5xl font-serif font-black text-foreground tracking-tight text-gradient">
                                Sanctuaire
                            </h1>
                            <p className="text-muted-foreground font-semibold text-lg max-w-xs">Identifiez-vous pour consulter les registres familiaux.</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-reveal [animation-delay:0.2s]">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">E-mail Officiel</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <div className="absolute inset-0 bg-primary/5 rounded-2xl scale-95 group-focus-within:scale-100 opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
                                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110" />
                                                    <Input
                                                        placeholder="pere.toure@famille.sn"
                                                        className="h-16 pl-14 pr-6 rounded-2xl border-border/50 bg-background/50 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium shadow-inner"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="font-bold text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Sceau de Sécurité</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <div className="absolute inset-0 bg-accent/5 rounded-2xl scale-95 group-focus-within:scale-100 opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
                                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-accent group-focus-within:scale-110" />
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="h-16 pl-14 pr-6 rounded-2xl border-border/50 bg-background/50 focus:bg-background focus:ring-4 focus:ring-accent/10 transition-all text-lg font-medium shadow-inner"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="font-bold text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-16 rounded-2xl text-xl font-black shadow-premium active:scale-95 transition-all overflow-hidden relative group/btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="relative z-10">Ouvrir les Registres</span>
                                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-14 p-8 rounded-3xl bg-linear-to-br from-muted/50 via-muted/30 to-background border border-border/40 text-center relative group overflow-hidden animate-reveal [animation-delay:0.4s]">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-3 opacity-60">Visiteur Temporel</p>
                            <p className="text-sm font-bold flex items-center justify-center gap-3">
                                <span className="text-muted-foreground">Code Démo :</span>
                                <code className="bg-primary/5 px-4 py-2 rounded-xl border border-primary/20 text-primary font-black shadow-sm group-hover:bg-primary group-hover:text-white transition-all cursor-copy">
                                    DEMO123
                                </code>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright/Footer info */}
                <div className="absolute bottom-8 text-center w-full animate-reveal [animation-delay:1s] opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">&copy; MMXXVI Sahel Généalogie — TOURE Heritage</p>
                </div>
            </main>
        </div>
    )
}

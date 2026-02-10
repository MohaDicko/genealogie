import { Header } from "@/components/header"
import { PersonCard } from "@/components/person-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { calculateAge, getAncestors } from "@/lib/genealogy-utils"
import { Users, TreePine, Calendar, Clock, ArrowRight, Sparkles, History, Plus } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Person } from "@/lib/types" // Utilisation de nos types frontend qui sont alignés avec Prisma
import { cn, serialize } from "@/lib/utils"
// Helper pour convertir le type Prisma en type frontend si besoin (si Date vs string)
// Prisma retourne des objets Date, nos types acceptent Date | string, donc c'est compatible.
import { DashboardCharts } from "@/components/dashboard-charts"
import { FamilyMapWrapper } from "@/components/family-map-wrapper"

export default async function DashboardPage() {
  // 1. Stats globales - Execution en parallèle pour plus de rapidité
  const [totalMembers, rootPersonData, recentlyAddedData, allPersonsSummary, familyData] = await Promise.all([
    prisma.person.count(),
    prisma.person.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { id: true, firstName: true, lastName: true, birthDate: true, deathDate: true }
    }),
    prisma.person.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.person.findMany({
      select: {
        id: true, firstName: true, lastName: true, birthDate: true, deathDate: true,
        fatherId: true, motherId: true, spouseId: true, gender: true
      }
    }),
    prisma.family.findFirst()
  ])

  if (totalMembers === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold mb-4">Bienvenue sur Sahel Généalogie</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Votre arbre généalogique est encore vide. Commencez par ajouter le premier membre de votre famille.
          </p>
          <Link href="/person/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Ajouter le premier membre
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  const persons = allPersonsSummary as unknown as Person[]
  const recentlyAdded = recentlyAddedData as unknown as Person[]
  const rootPerson = (rootPersonData || persons[0]) as unknown as Person
  const family = familyData

  const personsMap = new Map(persons.map((p) => [p.id, p]))
  const ancestorsByGen = rootPerson ? getAncestors(rootPerson, personsMap, 7) : new Map()
  const totalGenerations = ancestorsByGen.size

  // Find oldest and youngest
  const livingMembers = persons.filter((p) => !p.deathDate && p.birthDate)
  const sortedByAge = [...livingMembers].sort((a, b) => {
    const ageA = calculateAge(a.birthDate, null) || 0
    const ageB = calculateAge(b.birthDate, null) || 0
    return ageB - ageA
  })
  const oldestLiving = sortedByAge[0]

  // Upcoming birthdays
  const today = new Date()
  const upcomingBirthdays = persons
    .filter((p) => p.birthDate && !p.deathDate)
    .map((p) => {
      const birth = new Date(p.birthDate!)
      const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1)
      }
      const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { person: p, daysUntil }
    })
    .filter(({ daysUntil }) => daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-background transition-colors duration-1000">
      <Header />

      <main className="container mx-auto px-4 py-12 space-y-20 relative z-10">
        {/* Background Decorative Blurs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-soft" />
        <div className="absolute bottom-1/2 left-0 w-[300px] h-[300px] bg-accent/5 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse-soft [animation-delay:2s]" />

        {/* Hero Section - The Masterpiece */}
        <section className="relative rounded-[3rem] overflow-hidden bg-linear-to-br from-primary/10 via-card to-background border border-white/20 dark:border-white/5 p-10 md:p-24 shadow-premium group animate-reveal">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[120%] bg-[radial-gradient(circle_at_center,oklch(var(--primary)/0.08)_0%,transparent_70%)] animate-float" />

          <div className="relative z-10 max-w-3xl space-y-10">
            <div className="flex items-center gap-4 animate-reveal">
              <div className="px-5 py-2 rounded-2xl bg-primary/10 backdrop-blur-md border border-primary/20 shadow-xl">
                <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Archives de la Lignée</span>
              </div>
              <div className="h-px w-20 bg-primary/20" />
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-linear-to-br from-muted-foreground/30 to-muted-foreground/10 backdrop-blur-lg flex items-center justify-center text-[10px] font-black shadow-lg">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-6xl md:text-8xl font-black text-foreground leading-[1] tracking-tight text-gradient">
                L&apos;Héritage <br />
                <span className="text-primary italic">Réinventé</span>
              </h1>
              <p className="text-2xl text-muted-foreground/80 font-medium max-w-2xl leading-relaxed italic">
                Bienvenue dans le sanctuaire numérique de la famille {family?.name || "TOURE"}. Un voyage intemporel à travers nos racines et notre futur.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link href="/tree">
                <Button size="lg" className="gap-4 h-20 px-12 rounded-[2rem] text-xl font-black shadow-2xl hover:scale-105 transition-all bg-primary group/btn relative overflow-hidden">
                  <TreePine className="h-7 w-7 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">Ouvrir l&apos;Arbre</span>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                </Button>
              </Link>
              <Link href="/members">
                <Button size="lg" variant="outline" className="gap-4 h-20 px-12 rounded-[2rem] text-xl font-black bg-background/50 backdrop-blur-2xl hover:bg-background/80 hover:scale-105 transition-all border-border shadow-xl">
                  <Users className="h-7 w-7" />
                  Répertoire
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Dynamic Multi-Color Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-reveal [animation-delay:0.2s]">
          {[
            { label: "Membres", value: totalMembers, Icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/10" },
            { label: "Générations", value: totalGenerations, Icon: History, color: "text-accent", bg: "bg-accent/10", border: "border-accent/10" },
            { label: "Doyen", value: oldestLiving ? calculateAge(oldestLiving.birthDate, null) + " ans" : "-", Icon: Sparkles, color: "text-chart-3", bg: "bg-chart-3/10", border: "border-chart-3/10" },
            { label: "Alertes", value: upcomingBirthdays.length, Icon: Clock, color: "text-chart-4", bg: "bg-chart-4/10", border: "border-chart-4/10" }
          ].map((stat, i) => (
            <Card key={i} className={cn("glass group border-none relative overflow-hidden rounded-[2.5rem]", stat.border)}>
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">{stat.label}</p>
                    <p className="text-5xl font-serif font-black text-foreground tracking-tighter">{stat.value}</p>
                  </div>
                  <div className={cn("h-20 w-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110", stat.bg)}>
                    <stat.Icon className={cn("h-10 w-10 animate-float", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Content & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recently Added - Ultra Clean */}
          <Card className="lg:col-span-2 glass border-none rounded-[3rem] overflow-hidden shadow-premium animate-reveal [animation-delay:0.4s]">
            <CardHeader className="p-10 border-b border-border/20 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="font-serif text-3xl font-black tracking-tight text-gradient">
                    Nouveaux Visages
                  </CardTitle>
                  <CardDescription className="text-sm font-bold uppercase tracking-widest text-muted-foreground">La mémoire s&apos;agrandit</CardDescription>
                </div>
                <Link href="/members">
                  <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-background shadow-sm hover:scale-110 transition-transform">
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-10 bg-background/30 backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {recentlyAdded.map((person, idx) => (
                  <div key={person.id} className="animate-reveal" style={{ animationDelay: `${0.5 + idx * 0.1}s` }}>
                    <PersonCard person={person} variant="compact" className="border-none bg-background/40 hover:bg-background/80 shadow-none ring-1 ring-border/50" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Celebrations - Animated Side Card */}
          <Card className="glass border-none rounded-[3rem] shadow-premium relative overflow-hidden animate-reveal [animation-delay:0.6s]">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[80px] rounded-full animate-float" />

            <CardHeader className="p-10 text-center relative z-10">
              <div className="mx-auto h-20 w-20 rounded-3xl bg-accent/20 flex items-center justify-center mb-6 shadow-xl animate-float">
                <Calendar className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="font-serif text-4xl font-black text-gradient leading-none">Célébrations</CardTitle>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-3">Moments de Joie</p>
            </CardHeader>

            <CardContent className="px-8 pb-10 relative z-10">
              {upcomingBirthdays.length > 0 ? (
                <div className="space-y-6">
                  {upcomingBirthdays.map(({ person, daysUntil }, idx) => (
                    <Link
                      key={person.id}
                      href={`/person/${person.id}`}
                      className="flex items-center gap-6 p-5 rounded-[2rem] bg-background/50 hover:bg-white dark:hover:bg-primary/5 transition-all duration-500 group border border-transparent hover:border-primary/20 shadow-sm hover:shadow-xl animate-reveal"
                      style={{ animationDelay: `${0.7 + idx * 0.1}s` }}
                    >
                      <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-primary via-primary/80 to-accent flex items-center justify-center font-serif font-black text-2xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        {person.firstName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                          {person.firstName}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 font-bold uppercase tracking-widest mt-1">
                          <span className={cn(
                            "h-2 w-2 rounded-full",
                            daysUntil === 0 ? "bg-red-500 animate-pulse" : "bg-primary/40"
                          )} />
                          {daysUntil === 0 ? "Aujourd'hui !" : `Dans ${daysUntil} j`}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-muted/10 rounded-[2rem] border border-dashed border-border/50">
                  <p className="text-muted-foreground italic font-semibold text-lg">Patience... la fête arrive.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Featured Ancestor - Immersive Banner */}
        {oldestLiving && (
          <section className="relative rounded-[4rem] overflow-hidden glass border-none group animate-reveal [animation-delay:0.8s] shadow-premium">
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent z-10" />
            <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
              <div className="lg:col-span-3 p-10 md:p-24 relative z-20 flex flex-col justify-center space-y-10">
                <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-accent/20 text-accent font-black text-xs uppercase tracking-[0.3em] shadow-xl w-fit">
                  <Sparkles className="h-5 w-5 animate-pulse-soft" />
                  Gardien du Temps
                </div>
                <h2 className="font-serif text-6xl md:text-9xl font-black text-foreground leading-[0.9] tracking-tighter text-gradient">
                  {oldestLiving.firstName} <br />
                  <span className="text-accent italic">{oldestLiving.lastName}</span>
                </h2>
                <div className="max-w-2xl">
                  <p className="text-2xl md:text-3xl text-muted-foreground/90 leading-relaxed italic font-serif text-pretty">
                    &ldquo;{oldestLiving.biography || `${oldestLiving.firstName} est le phare de notre famille, éclairant le chemin depuis plus d&apos;un siècle de sagesse.`}&rdquo;
                  </p>
                </div>
                <Link href={`/person/${oldestLiving.id}`}>
                  <Button size="lg" className="gap-4 h-20 px-12 rounded-[2rem] text-xl font-black shadow-2xl hover:scale-105 transition-all bg-accent text-accent-foreground group/btn2 overflow-hidden relative">
                    <span className="relative z-10">Explorer sa vie</span>
                    <ArrowRight className="h-6 w-6 relative z-10 group-hover/btn2:translate-x-2 transition-transform" />
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn2:translate-x-full transition-transform duration-1000" />
                  </Button>
                </Link>
              </div>
              <div
                className="lg:col-span-2 relative h-[400px] lg:h-auto grayscale group-hover:grayscale-0 transition-all duration-[2000ms] scale-110 group-hover:scale-100"
                style={{
                  backgroundImage: `url(${oldestLiving.photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000"})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 20%',
                }}
              >
                <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-l from-background via-transparent to-transparent" />
              </div>
            </div>
          </section>
        )}


        {/* Geographic Origins Map */}
        <section className="relative z-10 animate-reveal [animation-delay:0.9s]">
          <div className="flex items-center gap-4 mb-8 pl-4 border-l-4 border-accent">
            <h2 className="font-serif text-4xl font-black text-foreground tracking-tight">Terres d&apos;Origine</h2>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="glass rounded-[2.5rem] p-2 md:p-6 shadow-premium overflow-hidden">
            <FamilyMapWrapper persons={serialize(persons) as any[]} />
          </div>
        </section>

        {/* Global Analytic View */}
        <section className="pt-20 pb-32 animate-reveal [animation-delay:1s]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <div className="h-1.5 w-24 bg-primary rounded-full" />
              <h2 className="font-serif text-5xl font-black text-foreground tracking-tight">
                Analyse & Structure
              </h2>
              <p className="text-xl text-muted-foreground font-medium italic">Une vision mathématique de notre héritage biologique.</p>
            </div>
          </div>
          <div className="glass rounded-[3rem] p-4 md:p-12 shadow-premium">
            <DashboardCharts persons={serialize(persons) as any} />
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-border/20 bg-muted/10 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -mr-48 -mb-48" />
        <div className="container mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TreePine className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.5em]">Sahel Généalogie — TOURE Heritage System</p>
          <div className="flex justify-center gap-10">
            {["Mémoire", "Lignée", "Transmission"].map(word => (
              <span key={word} className="text-[10px] font-black uppercase tracking-widest text-primary/40">{word}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

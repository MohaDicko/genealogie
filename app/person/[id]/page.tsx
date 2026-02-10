import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Heart, Baby, Users, MapPin, Briefcase, Calendar as CalendarIcon, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PersonCard } from "@/components/person-card"
import { formatDateFr, calculateRelationshipPath, calculateAge } from "@/lib/genealogy-utils"
import { LifeEventTimeline } from "@/components/life-event-timeline"
import { AddLifeEventDialog } from "@/components/add-life-event-dialog"
import { EditPersonDialog } from "@/components/edit-person-dialog"
import { MediaGallery } from "@/components/media-gallery"
import { AddMediaDialog } from "@/components/add-media-dialog"
import { Badge } from "@/components/ui/badge"
import { serialize } from "@/lib/utils"
import { PrintButton } from "@/components/print-button"
import { Person } from "@/lib/types"

export default async function PersonPage({ params }: { params: { id: string } }) {
  // Fetch real data with relations - Optimized fetching
  const [allPersonsSummary, person] = await Promise.all([
    prisma.person.findMany({
      select: { id: true, firstName: true, lastName: true, fatherId: true, motherId: true, spouseId: true, gender: true }
    }),
    prisma.person.findUnique({
      where: { id: params.id },
      include: {
        father: true,
        mother: true,
        spouse: true,
        spouseOf: true,
        fatherOf: true,
        motherOf: true,
        media: { orderBy: { createdAt: 'desc' } },
        lifeEvents: { orderBy: { date: 'asc' } }
      }
    })
  ])

  if (!person) {
    notFound()
  }

  // Calculate relationship with root (Marie TOURE by default for demo)
  const personsMap = new Map(allPersonsSummary.map(p => [p.id, p as unknown as Person]))
  const rootPerson = allPersonsSummary.find(p => p.firstName === "Marie" && p.lastName === "TOURE") || allPersonsSummary[0]
  const relationship = calculateRelationshipPath(rootPerson as unknown as Person, person as unknown as Person, personsMap)

  const children = [...person.fatherOf, ...person.motherOf]
  const spouses = person.spouse ? [person.spouse, ...person.spouseOf] : person.spouseOf

  const serializedPerson = serialize(person)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Immersive Profile Header */}
      <div className="relative border-b border-border/50 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_30%,oklch(var(--primary)/0.08)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[radial-gradient(circle_at_20%_80%,oklch(var(--accent)/0.05)_0%,transparent_70%)]" />
        </div>

        <div className="container mx-auto px-4 pt-12 pb-24 relative z-10">
          <div className="flex w-full items-center justify-between mb-10 print:hidden">
            <Link href="/members">
              <Button variant="ghost" className="-ml-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group">
                <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Retour à la galerie
              </Button>
            </Link>
            <PrintButton />
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 text-center lg:text-left">
            {/* Portrait Section */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-linear-to-br from-primary/20 to-accent/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-64 w-64 lg:h-80 lg:w-80 rounded-[2rem] overflow-hidden border-4 border-background shadow-premium bg-muted ring-1 ring-border/50">
                {person.photoUrl ? (
                  <img
                    src={person.photoUrl}
                    alt={person.firstName}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-secondary to-muted text-7xl text-muted-foreground font-serif">
                    {person.firstName[0]}
                  </div>
                )}
              </div>

              <div className="absolute -bottom-4 -right-4 h-12 w-12 rounded-2xl bg-primary shadow-xl flex items-center justify-center text-white ring-4 ring-background animate-reveal [animation-delay:0.4s]">
                {person.deathDate ? <div className="text-xl">🕊️</div> : <Heart className="h-6 w-6 fill-current" />}
              </div>
            </div>

            {/* Title & Key Stats */}
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {relationship && rootPerson.id !== person.id && (
                    <Badge className="bg-primary/10 text-primary border-none py-1 px-4 rounded-full font-black text-[10px] uppercase tracking-widest">
                      {relationship.relationship} de {rootPerson.firstName}
                    </Badge>
                  )}
                  {person.deathDate && (
                    <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground/60 py-1 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest">
                      Dans nos mémoires
                    </Badge>
                  )}
                </div>

                <h1 className="text-5xl lg:text-7xl font-serif font-black tracking-tight text-foreground text-gradient leading-tight">
                  {person.firstName} {person.lastName}
                </h1>

                {person.birthName && person.birthName !== person.lastName && (
                  <p className="text-xl text-muted-foreground italic font-medium">nom de naissance : {person.birthName}</p>
                )}
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vocation</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    {person.occupation || "Non renseigné"}
                  </p>
                </div>
                <div className="h-12 w-px bg-border/50 hidden sm:block" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Origine</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    {person.birthPlace || "Non renseigné"}
                  </p>
                </div>
                <div className="h-12 w-px bg-border/50 hidden sm:block" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lieu de vie</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-chart-3" />
                    {person.deathPlace || "Vivant"}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <EditPersonDialog person={serializedPerson as any} variant="outline" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Biography Section */}
            <section className="premium-card rounded-3xl overflow-hidden bg-background/50 backdrop-blur border-none shadow-premium">
              <div className="p-8 lg:p-14">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-serif font-black flex items-center gap-4">
                    <span className="h-10 w-1.5 bg-primary rounded-full"></span>
                    Le Récit de Vie
                  </h2>
                </div>

                <div className="prose prose-stone dark:prose-invert max-w-none">
                  {person.biography ? (
                    <p className="text-xl leading-[1.8] text-foreground/80 font-serif italic whitespace-pre-line first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-4 first-letter:mt-1">
                      {person.biography}
                    </p>
                  ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-[2rem] border-2 border-dashed border-border/50 group">
                      <p className="italic text-muted-foreground text-lg mb-6">Ajoutez les chapitres marquants de l&apos;histoire de {person.firstName}.</p>
                      <EditPersonDialog person={serializedPerson as any} />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Timeline Section */}
            <section className="premium-card rounded-3xl bg-background/50 backdrop-blur border-none p-8 lg:p-14 shadow-premium">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-serif font-black flex items-center gap-4">
                  <span className="h-10 w-1.5 bg-accent rounded-full"></span>
                  Chronologie du Chemin
                </h2>
                <AddLifeEventDialog personId={person.id} personName={person.firstName} />
              </div>
              {person.lifeEvents.length > 0 ? (
                <div className="relative pl-4">
                  <LifeEventTimeline events={person.lifeEvents} />
                </div>
              ) : (
                <p className="italic text-muted-foreground text-center py-12 text-lg">Le grand livre du temps attend ses premiers événements.</p>
              )}
            </section>

            {/* Gallery Section */}
            <section className="premium-card rounded-3xl bg-background/50 backdrop-blur border-none p-8 lg:p-14 shadow-premium">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-serif font-black flex items-center gap-4">
                  <span className="h-10 w-1.5 bg-chart-3 rounded-full"></span>
                  Galerie & Souvenirs
                </h2>
                <AddMediaDialog personId={person.id} personName={person.firstName} />
              </div>
              <MediaGallery media={serialize(person.media) as any} personId={person.id} />
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            {/* Key Life Dates Card */}
            <div className="premium-card rounded-3xl p-8 bg-linear-to-br from-primary/5 to-accent/5 border-none shadow-premium">
              <h3 className="font-serif text-xl font-bold mb-8 uppercase tracking-widest text-primary/60">Éphéméride</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white dark:bg-card shadow-md flex items-center justify-center shrink-0">
                    <Baby className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Naissance</p>
                    <p className="text-lg font-bold">{person.birthDate ? formatDateFr(person.birthDate) : "Inconnu"}</p>
                    <p className="text-sm text-muted-foreground font-medium">{person.birthPlace}</p>
                  </div>
                </div>

                {person.deathDate && (
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-card shadow-md flex items-center justify-center shrink-0">
                      <div className="text-2xl font-serif">🕊️</div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Départ</p>
                      <p className="text-lg font-bold">{formatDateFr(person.deathDate)}</p>
                      <p className="text-sm text-muted-foreground font-medium">{person.deathPlace}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white dark:bg-card shadow-md flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Temps de Vie</p>
                    <p className="text-lg font-bold">
                      {person.birthDate ? (
                        <>
                          {calculateAge(person.birthDate, person.deathDate)} <span className="text-sm font-medium">ans d&apos;héritage</span>
                        </>
                      ) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Network Section */}
            <div className="space-y-8">
              <h3 className="font-serif text-2xl font-black flex items-center gap-3">
                <span className="h-6 w-1 bg-primary/40 rounded-full"></span>
                Lignage Direct
              </h3>

              {/* Ascendants */}
              {(person.father || person.mother) && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Ascendance</p>
                  <div className="grid gap-4">
                    {person.father && <PersonCard person={person.father as any} variant="compact" />}
                    {person.mother && <PersonCard person={person.mother as any} variant="compact" />}
                  </div>
                </div>
              )}

              {/* Spouses */}
              {spouses.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Alliances</p>
                  <div className="grid gap-4">
                    {spouses.map(spouse => (
                      <PersonCard key={spouse.id} person={spouse as any} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

              {/* Descendants */}
              {children.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Descendance</p>
                  <div className="grid gap-4">
                    {children.map(child => (
                      <PersonCard key={child.id} person={child as any} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

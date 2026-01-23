import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Heart, Baby, Users, MapPin, Briefcase, Calendar as CalendarIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PersonCard } from "@/components/person-card"
import { formatDateFr, calculateRelationshipPath } from "@/lib/genealogy-utils"
import { LifeEventTimeline } from "@/components/life-event-timeline"
import { AddLifeEventDialog } from "@/components/add-life-event-dialog"
import { EditPersonDialog } from "@/components/edit-person-dialog"
import { MediaGallery } from "@/components/media-gallery"
import { AddMediaDialog } from "@/components/add-media-dialog"
import { Badge } from "@/components/ui/badge"
import { Image as ImageIcon } from "lucide-react"
import { Person } from "@/lib/types"

export default async function PersonPage({ params }: { params: { id: string } }) {
  // Fetch real data with relations
  const allPersonsData = await prisma.person.findMany()
  const person = await prisma.person.findUnique({
    where: { id: params.id },
    include: {
      father: true,
      mother: true,
      spouse: true,
      spouseOf: true,
      fatherOf: true,
      motherOf: true,
      media: {
        orderBy: {
          createdAt: 'desc'
        }
      },
      lifeEvents: {
        orderBy: {
          date: 'asc'
        }
      }
    }
  })

  if (!person) {
    notFound()
  }

  // Calculate relationship with root
  const personsMap = new Map(allPersonsData.map(p => [p.id, p as unknown as Person]))
  const rootPerson = allPersonsData[0] as unknown as Person
  const relationship = calculateRelationshipPath(rootPerson, person as unknown as Person, personsMap)

  const children = [...person.fatherOf, ...person.motherOf]
  const spouses = person.spouse ? [person.spouse, ...person.spouseOf] : person.spouseOf

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary transition-colors">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne gauche : Photo et infos clés */}
          <div className="md:col-span-1 space-y-6">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted shadow-inner border border-border">
              {person.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={person.photoUrl}
                  alt={person.firstName}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-5xl text-muted-foreground font-serif">
                  {person.firstName[0]}
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                {relationship && rootPerson.id !== person.id && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                    {relationship.relationship} de {rootPerson.firstName}
                  </Badge>
                )}
                {rootPerson.id === person.id && (
                  <Badge variant="outline" className="text-chart-2 border-chart-2/20 bg-chart-2/5">
                    Membre Pivot (Racine)
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold font-serif mb-2 tracking-tight">{person.firstName} {person.lastName}</h1>
              {person.birthName && person.birthName !== person.lastName && (
                <p className="text-muted-foreground mb-1 italic">née {person.birthName}</p>
              )}
              <p className="text-primary font-medium mb-6 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {person.occupation || "Activité inconnue"}
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold block text-foreground">Naissance</span>
                    <span className="text-muted-foreground italic">
                      {person.birthDate ? formatDateFr(person.birthDate) : "?"}
                      {person.birthPlace && ` à ${person.birthPlace}`}
                    </span>
                  </div>
                </div>

                {person.deathDate && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <div className="text-destructive font-bold text-lg leading-none">†</div>
                    </div>
                    <div>
                      <span className="font-semibold block text-foreground">Décès</span>
                      <span className="text-muted-foreground italic">
                        {formatDateFr(person.deathDate)}
                        {person.deathPlace && ` à ${person.deathPlace}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Relations rapides */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-2">Famille Proche</h2>

              {/* Parents */}
              {(person.father || person.mother) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2 text-primary">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Parents</span>
                  </div>
                  <div className="space-y-2">
                    {person.father && <PersonCard person={person.father as any} variant="compact" />}
                    {person.mother && <PersonCard person={person.mother as any} variant="compact" />}
                  </div>
                </div>
              )}

              {/* Conjoint */}
              {spouses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2 text-chart-5">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">Conjoint(e)</span>
                  </div>
                  <div className="space-y-2">
                    {spouses.map(spouse => (
                      <PersonCard key={spouse.id} person={spouse as any} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

              {/* Enfants */}
              {children.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2 text-chart-2">
                    <Baby className="h-4 w-4" />
                    <span className="text-sm font-medium">Enfants</span>
                  </div>
                  <div className="space-y-2">
                    {children.map(child => (
                      <PersonCard key={child.id} person={child as any} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>



          {/* Colonne centrale/droite : Bio et Timeline */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                  <span className="h-8 w-1 bg-primary rounded-full"></span>
                  Biographie
                </h2>
                <EditPersonDialog person={person} />
              </div>
              <div className="prose prose-stone dark:prose-invert max-w-none leading-relaxed text-lg">
                {person.biography ? (
                  <p className="whitespace-pre-line text-foreground/90">{person.biography}</p>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
                    <p className="italic text-muted-foreground mb-4">Aucune biographie disponible pour le moment.</p>
                    <EditPersonDialog person={person} />
                  </div>
                )}
              </div>
            </section>





            <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                  <span className="h-8 w-1 bg-chart-4 rounded-full"></span>
                  Chronologie
                </h2>
                <AddLifeEventDialog personId={person.id} personName={person.firstName} />
              </div>
              {person.lifeEvents.length > 0 ? (
                <LifeEventTimeline events={person.lifeEvents} />
              ) : (
                <p className="italic text-muted-foreground text-center py-8">Aucun événement répertorié.</p>
              )}
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                  <span className="h-8 w-1 bg-accent rounded-full"></span>
                  Documents & Photos
                </h2>
                <AddMediaDialog personId={person.id} personName={person.firstName} />
              </div>
              <MediaGallery media={person.media as any} personId={person.id} />
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

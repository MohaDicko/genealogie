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

// Helper pour convertir le type Prisma en type frontend si besoin (si Date vs string)
// Prisma retourne des objets Date, nos types acceptent Date | string, donc c'est compatible.
import { DashboardCharts } from "@/components/dashboard-charts"

export default async function DashboardPage() {
  // 1. Stats globales
  const totalMembers = await prisma.person.count()

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

  // Find a suitable root (oldest or first added)
  const rootPersonData = await prisma.person.findFirst({
    orderBy: { createdAt: 'asc' }
  })

  // 2. Derniers ajouts
  const recentlyAddedData = await prisma.person.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  // 3. Tous les membres
  const allPersonsData = await prisma.person.findMany()
  const familyData = await prisma.family.findFirst()

  const persons = allPersonsData as unknown as Person[]
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                  Famille {family?.name || "Sahel"}
                </Badge>
                {family?.inviteCode && (
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    CODE: {family.inviteCode}
                  </Badge>
                )}
              </div>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Bienvenue{rootPerson ? `, ${rootPerson.firstName}` : ""}</h1>
              <p className="text-lg text-muted-foreground readable-text">
                Explorez et préservez l&apos;histoire de votre famille
              </p>
            </div>
            <Link href="/tree">
              <Button size="lg" className="gap-2 touch-target text-lg">
                <TreePine className="h-5 w-5" />
                Voir l&apos;arbre généalogique
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-serif font-bold text-foreground">{totalMembers}</p>
                  <p className="text-sm text-muted-foreground">Membres enregistrés</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <History className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-serif font-bold text-foreground">{totalGenerations}</p>
                  <p className="text-sm text-muted-foreground">Générations documentées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-chart-2/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-3xl font-serif font-bold text-foreground">
                    {oldestLiving ? calculateAge(oldestLiving.birthDate, null) : "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">Âge du doyen vivant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-chart-4/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-3xl font-serif font-bold text-foreground">{upcomingBirthdays.length}</p>
                  <p className="text-sm text-muted-foreground">Anniversaires ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recently Added */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Membres récemment ajoutés
              </CardTitle>
              <CardDescription>Les dernières personnes ajoutées à votre arbre généalogique</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentlyAdded.map((person) => (
                  <PersonCard key={person.id} person={person} variant="compact" />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link href="/members">
                  <Button variant="outline" className="w-full gap-2 touch-target bg-transparent">
                    Voir tous les membres
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Birthdays */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Anniversaires à venir
              </CardTitle>
              <CardDescription>Dans les 30 prochains jours</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBirthdays.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingBirthdays.map(({ person, daysUntil }) => (
                    <li key={person.id}>
                      <Link
                        href={`/person/${person.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center font-serif font-bold text-accent-foreground">
                          {person.firstName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {person.firstName} {person.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {daysUntil === 0 ? "Aujourd'hui !" : daysUntil === 1 ? "Demain" : `Dans ${daysUntil} jours`}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-8">Aucun anniversaire dans les 30 prochains jours</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Featured Ancestor */}
        {oldestLiving && (
          <section className="mt-10">
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div
                  className="h-48 md:h-auto bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${oldestLiving.photoUrl || "/elderly-african-person-portrait-sepia.jpg"})`,
                  }}
                />
                <div className="md:col-span-2 p-6 md:p-8">
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <Sparkles className="h-4 w-4" />
                    Doyen de la famille
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
                    {oldestLiving.firstName} {oldestLiving.lastName}
                  </h2>
                  <p className="text-muted-foreground readable-text mb-4">
                    {oldestLiving.biography ||
                      `${oldestLiving.firstName} est né(e) le ${oldestLiving.birthDate ? new Date(oldestLiving.birthDate).toLocaleDateString() : ""} à ${oldestLiving.birthPlace || "lieu inconnu"}.`}
                  </p>
                  <Link href={`/person/${oldestLiving.id}`}>
                    <Button variant="outline" className="gap-2 touch-target bg-transparent">
                      Découvrir son histoire
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Analytic Charts */}
        <section className="mt-10 mb-20">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="font-serif text-2xl font-bold flex items-center gap-3">
              <span className="h-8 w-1 bg-primary rounded-full"></span>
              Analytique de la Famille
            </h2>
          </div>
          <DashboardCharts persons={persons} />
        </section>
      </main>
    </div>
  )
}

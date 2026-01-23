import { Header } from "@/components/header"
import { PersonCard } from "@/components/person-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { prisma } from "@/lib/prisma"
import { Person } from "@/lib/types"
import { Search, Filter, Users, Plus } from "lucide-react"
import Link from "next/link"

export default async function MembersPage() {
  const allPersonsData = await prisma.person.findMany({
    orderBy: { lastName: 'asc' }
  })

  const persons = allPersonsData as unknown as Person[]

  // Group by status
  const livingMembers = persons.filter((p) => !p.deathDate)
  const deceasedMembers = persons.filter((p) => p.deathDate)

  if (persons.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold mb-4">Aucun membre trouvé</h2>
          <p className="text-muted-foreground mb-8">Commencez par ajouter des membres à votre famille.</p>
          <Link href="/person/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un membre
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Membres de la famille</h1>
            <p className="text-muted-foreground readable-text">
              {persons.length} personnes enregistrées dans votre arbre généalogique
            </p>
          </div>
          <Link href="/person/new">
            <Button size="lg" className="gap-2 touch-target">
              <Plus className="h-5 w-5" />
              Ajouter un membre
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher par nom, prénom ou lieu..." className="pl-10 touch-target" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48 touch-target">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les membres</SelectItem>
              <SelectItem value="living">Membres vivants</SelectItem>
              <SelectItem value="deceased">Membres décédés</SelectItem>
              <SelectItem value="male">Hommes</SelectItem>
              <SelectItem value="female">Femmes</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="name">
            <SelectTrigger className="w-full sm:w-48 touch-target">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
              <SelectItem value="birth">Date de naissance</SelectItem>
              <SelectItem value="recent">Récemment ajouté</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Living Members */}
        <section className="mb-10">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Membres vivants ({livingMembers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {livingMembers.map((person) => (
              <PersonCard key={person.id} person={person} variant="detailed" />
            ))}
          </div>
        </section>

        {/* Deceased Members */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Membres décédés ({deceasedMembers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deceasedMembers.map((person) => (
              <PersonCard key={person.id} person={person} variant="detailed" />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

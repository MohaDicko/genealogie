import { Header } from "@/components/header"
export const dynamic = "force-dynamic"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Person } from "@/lib/types"
import { Users, Plus } from "lucide-react"
import Link from "next/link"
import { MembersList } from "@/components/members-list"
import { serialize } from "@/lib/utils"

export default async function MembersPage() {
  const allPersonsData = await prisma.person.findMany({
    orderBy: { lastName: 'asc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      birthDate: true,
      deathDate: true,
      photoUrl: true,
      gender: true,
      occupation: true,
      birthPlace: true,
      birthName: true
    }
  })

  const persons = allPersonsData as unknown as Person[]

  // Group by status
  const livingMembers = persons.filter((p) => !p.deathDate)
  const deceasedMembers = persons.filter((p) => p.deathDate)

  if (persons.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-32 text-center animate-reveal">
          <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-4xl font-serif font-black mb-4 text-gradient">Aucun membre trouvé</h2>
          <p className="text-muted-foreground mb-10 max-w-sm mx-auto text-lg italic">
            Votre héritage attend d&apos;être documenté. Commencez par ajouter les piliers de votre famille.
          </p>
          <Link href="/person/new">
            <Button size="lg" className="gap-3 rounded-xl h-14 px-8 shadow-xl hover:scale-105 transition-transform">
              <Plus className="h-5 w-5" />
              Ajouter le premier membre
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Immersive Sub-Header */}
      <div className="relative pt-16 pb-24 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_70%_30%,oklch(var(--primary)/0.05)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-1/4 h-full bg-[radial-gradient(circle_at_20%_80%,oklch(var(--accent)/0.03)_0%,transparent_70%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest animate-reveal">
                Répertoire Familial
              </div>
              <h1 className="font-serif text-5xl lg:text-7xl font-black text-foreground tracking-tight text-gradient leading-tight animate-reveal [animation-delay:0.1s]">
                Les Visages de l&apos;Histoire
              </h1>
              <p className="text-xl text-muted-foreground font-medium animate-reveal [animation-delay:0.2s] italic">
                {persons.length} âmes documentées au travers de {new Set(persons.map(p => p.lastName)).size} branches familiales.
              </p>
            </div>
            <Link href="/person/new" className="animate-reveal [animation-delay:0.3s]">
              <Button size="lg" className="gap-3 rounded-2xl h-16 px-10 shadow-2xl hover:scale-105 transition-all text-lg font-bold">
                <Plus className="h-6 w-6" />
                Nouveau Membre
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-10 pb-24 relative z-20">

        {/* Interactive List Component */}
        <MembersList initialMembers={serialize(persons)} />
      </main>
    </div>
  )
}

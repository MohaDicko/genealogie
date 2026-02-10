import { FamilyTree } from "@/components/tree/family-tree"
import { Header } from "@/components/header"
import { prisma } from "@/lib/prisma"
import { Person } from "@/lib/types"
import { TreePine } from "lucide-react"
import { serialize } from "@/lib/utils"

export default async function TreePage() {
  // Récupération des données réelles
  // Récupération des données réelles en parallèle
  const [allPersonsData, initialRootData] = await Promise.all([
    prisma.person.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        deathDate: true,
        photoUrl: true,
        gender: true,
        fatherId: true,
        motherId: true,
        spouseId: true
      }
    }),
    prisma.person.findFirst({
      where: { firstName: "Marie", lastName: "TOURE" }
    })
  ])

  let rootPersonData = initialRootData

  // Fallback si Marie n'est pas trouvée, prendre le premier venu
  if (!rootPersonData && allPersonsData.length > 0) {
    rootPersonData = allPersonsData[0] as any
  }

  // Casting pour compatibilité Types
  const persons = allPersonsData as unknown as Person[]
  const rootPerson = rootPersonData as unknown as Person

  // Serialization for Client Components
  const serializedRoot = serialize(rootPerson)
  const serializedPersons = serialize(persons)
  const personsMap = new Map(serializedPersons.map((p) => [p.id, p]))

  if (!serializedRoot) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-muted-foreground">Aucune donnée généalogique trouvée. Veuillez ajouter des membres.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[150px] rounded-full animate-float [animation-delay:3s]" />
      </div>

      <Header />

      <main className="flex-1 overflow-hidden relative z-10 transition-all duration-1000">
        {/* Modern Glass Info Panel */}
        <div className="absolute top-8 left-8 z-20 glass rounded-[2.5rem] p-8 max-w-sm border-white/20 shadow-2xl animate-reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <TreePine className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-black tracking-tight text-foreground leading-none">Archives</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mt-1">Lignage de Marie</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed italic">
              Naviguez à travers les siècles de notre lignée. Chaque nœud est un chapitre de notre mémoire commune.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Zoom</p>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Molette
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Naviguer</p>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent" /> Glisser
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Le wrapper Client Component FamilyTree s'occupera d'afficher le graphe */}
        <FamilyTree
          rootPerson={serializedRoot}
          allPersons={personsMap}
          initialGenerations={4}
        />
      </main>
    </div>
  )
}

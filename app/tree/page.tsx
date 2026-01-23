import { FamilyTree } from "@/components/tree/family-tree"
import { Header } from "@/components/header"
import { prisma } from "@/lib/prisma"
import { Person } from "@/lib/types"

export default async function TreePage() {
  // Récupération des données réelles
  // 1. Récupérer toutes les personnes pour construire le graphe
  const allPersonsData = await prisma.person.findMany()

  // 2. Trouver la racine (l'utilisateur courant ou une racine par défaut)
  // Pour la démo, on cherche Marie Diallo
  let rootPersonData = await prisma.person.findFirst({
    where: { firstName: "Marie", lastName: "Diallo" }
  })

  // Fallback si Marie n'est pas trouvée, prendre le premier venu
  if (!rootPersonData && allPersonsData.length > 0) {
    rootPersonData = allPersonsData[0]
  }

  // Casting pour compatibilité Types
  const persons = allPersonsData as unknown as Person[]
  const rootPerson = rootPersonData as unknown as Person
  const personsMap = new Map(persons.map((p) => [p.id, p]))

  if (!rootPerson) {
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
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur p-4 rounded-lg border border-border max-w-md pointer-events-none">
          <h1 className="text-2xl font-serif font-bold mb-2">Arbre Généalogique</h1>
          <p className="text-sm text-muted-foreground">
            Visualisez vos ancêtres et explorez les connexions familiales.
            Utilisez la molette pour zoomer et cliquez-glissez pour vous déplacer dans le graphe.
          </p>
        </div>

        {/* Le wrapper Client Component FamilyTree s'occupera d'afficher le graphe */}
        <FamilyTree
          rootPerson={rootPerson}
          allPersons={personsMap}
          initialGenerations={4}
        />
      </main>
    </div>
  )
}

import { Header } from "@/components/header"
import { NewPersonForm } from "@/components/new-person-form"
import { prisma } from "@/lib/prisma"
import { Person } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default async function NewPersonPage() {
    const allPersons = await prisma.person.findMany({
        orderBy: { lastName: "asc" },
    })

    // Conversion simple pour le composant client
    const persons = allPersons as unknown as Person[]

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-foreground">Ajouter un nouveau membre</h1>
                            <p className="text-muted-foreground">Enrichissez votre arbre généalogique avec un nouveau membre.</p>
                        </div>
                    </div>

                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif">Informations Personnelles</CardTitle>
                            <CardDescription>
                                Remplissez les détails essentiels de la personne pour l&apos;ajouter au registre familial.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <NewPersonForm existingPeople={persons} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

"use client"

import type React from "react"

import { useState, useMemo, useTransition, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PersonCard } from "@/components/person-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { searchPeopleAction } from "@/app/actions/search"
import { Person } from "@/lib/types"
import { Search, Users, MapPin, Calendar, Loader2 } from "lucide-react"

export function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [results, setResults] = useState<Person[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (searchTerm) {
      startTransition(async () => {
        const data = await searchPeopleAction(searchTerm)
        setResults(data)
      })
    } else {
      setResults([])
    }
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(query)
  }

  // Group results by category
  const groupedResults = useMemo(() => {
    const byPlace = new Map<string, typeof results>()
    const byDecade = new Map<string, typeof results>()

    results.forEach((person) => {
      // Group by birthplace
      if (person.birthPlace) {
        const place = person.birthPlace.split(",")[0].trim()
        if (!byPlace.has(place)) byPlace.set(place, [])
        byPlace.get(place)!.push(person)
      }

      // Group by birth decade
      if (person.birthDate) {
        const year = new Date(person.birthDate).getFullYear()
        const decade = `${Math.floor(year / 10) * 10}s`
        if (!byDecade.has(decade)) byDecade.set(decade, [])
        byDecade.get(decade)!.push(person)
      }
    })

    return { byPlace, byDecade }
  }, [results])

  return (
    <>
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="font-serif text-3xl font-bold text-foreground text-center mb-2">Rechercher un membre</h1>
        <p className="text-muted-foreground text-center readable-text mb-6">
          Trouvez un membre de votre famille par nom, lieu de naissance ou profession
        </p>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par nom, lieu, profession..."
              className="pl-12 h-14 text-lg touch-target"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <Button type="submit" size="lg" className="h-14 px-8 touch-target" disabled={isPending}>
            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Rechercher"}
          </Button>
        </form>
      </div>

      {/* Results */}
      {searchTerm && (
        <div className="space-y-8">
          {/* Results Count */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span className="text-lg">
              {results.length} résultat{results.length !== 1 ? "s" : ""} pour &quot;{searchTerm}&quot;
            </span>
          </div>

          {results.length > 0 ? (
            <>
              {/* All Results */}
              <section>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Tous les résultats</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((person) => (
                    <PersonCard key={person.id} person={person} variant="detailed" />
                  ))}
                </div>
              </section>

              {/* By Place */}
              {groupedResults.byPlace.size > 1 && (
                <section>
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Par lieu de naissance
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from(groupedResults.byPlace.entries()).map(([place, persons]) => (
                      <Card key={place}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground mb-2">{place}</h3>
                          <p className="text-sm text-muted-foreground">
                            {persons.length} personne{persons.length !== 1 ? "s" : ""}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {persons.slice(0, 3).map((p) => (
                              <li key={p.id} className="text-sm">
                                {p.firstName} {p.lastName}
                              </li>
                            ))}
                            {persons.length > 3 && (
                              <li className="text-sm text-muted-foreground">+{persons.length - 3} autres</li>
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* By Decade */}
              {groupedResults.byDecade.size > 1 && (
                <section>
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Par décennie de naissance
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {Array.from(groupedResults.byDecade.entries())
                      .sort((a, b) => a[0].localeCompare(b[0]))
                      .map(([decade, persons]) => (
                        <Card key={decade} className="flex-shrink-0">
                          <CardContent className="p-4 text-center">
                            <p className="font-serif text-2xl font-bold text-foreground">{decade}</p>
                            <p className="text-sm text-muted-foreground">
                              {persons.length} personne{persons.length !== 1 ? "s" : ""}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-10 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground readable-text">
                  Essayez avec d&apos;autres termes de recherche ou vérifiez l&apos;orthographe
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchTerm && (
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-10 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Commencez votre recherche</h3>
            <p className="text-muted-foreground readable-text">
              Entrez un nom, un lieu de naissance ou une profession pour trouver un membre de votre famille
            </p>
          </CardContent>
        </Card>
      )}
    </>
  )
}

"use client"

import { useState, useMemo } from "react"
import { Person } from "@/lib/types"
import { PersonCard } from "@/components/person-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowUpDown } from "lucide-react"

interface MembersListProps {
    initialMembers: Person[]
}

export function MembersList({ initialMembers }: MembersListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [sortOrder, setSortOrder] = useState("name")

    const filteredMembers = useMemo(() => {
        let result = [...initialMembers]

        // 1. Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.firstName.toLowerCase().includes(q) ||
                p.lastName.toLowerCase().includes(q) ||
                (p.birthPlace && p.birthPlace.toLowerCase().includes(q)) ||
                (p.occupation && p.occupation.toLowerCase().includes(q))
            )
        }

        // 2. Filter
        if (filterCategory !== "all") {
            switch (filterCategory) {
                case "living":
                    result = result.filter(p => !p.deathDate)
                    break
                case "deceased":
                    result = result.filter(p => !!p.deathDate)
                    break
                case "male":
                    result = result.filter(p => p.gender === "MALE")
                    break
                case "female":
                    result = result.filter(p => p.gender === "FEMALE")
                    break
            }
        }

        // 3. Sort
        result.sort((a, b) => {
            switch (sortOrder) {
                case "name":
                    return a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)
                case "name-desc":
                    return b.lastName.localeCompare(a.lastName) || b.firstName.localeCompare(a.firstName)
                case "birth":
                    // Handle potentially null dates properly
                    const dateA = a.birthDate ? new Date(a.birthDate).getTime() : 0
                    const dateB = b.birthDate ? new Date(b.birthDate).getTime() : 0
                    return dateA - dateB
                case "recent":
                    const createdA = new Date(a.createdAt).getTime()
                    const createdB = new Date(b.createdAt).getTime()
                    return createdB - createdA // Most recent first
                default:
                    return 0
            }
        })

        return result
    }, [initialMembers, searchQuery, filterCategory, sortOrder])

    // Group by status for display (if filtered results allow)
    const living = filteredMembers.filter(p => !p.deathDate)
    const deceased = filteredMembers.filter(p => !!p.deathDate)

    // Determine if we should show sections or flat list based on filter
    const showSections = filterCategory === "all" || filterCategory === "male" || filterCategory === "female"

    return (
        <div className="space-y-10">
            {/* Glassmorphic Filters */}
            <div className="glass rounded-[2rem] p-4 lg:p-6 mb-8 flex flex-col lg:flex-row gap-4 shadow-premium border-white/40 dark:border-white/5 sticky top-24 z-30 transition-all duration-300">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="search"
                        placeholder="Rechercher par nom, métier, lieu..."
                        className="pl-12 h-14 rounded-xl bg-background/50 border-border focus:ring-primary/20 text-lg transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full sm:w-56 h-14 rounded-xl bg-background/50 border-border text-lg font-medium">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <SelectValue placeholder="Catégorie" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border">
                            <SelectItem value="all">Tous les membres</SelectItem>
                            <SelectItem value="living">Membres vivants</SelectItem>
                            <SelectItem value="deceased">Membres décédés</SelectItem>
                            <SelectItem value="male">Hommes</SelectItem>
                            <SelectItem value="female">Femmes</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-full sm:w-56 h-14 rounded-xl bg-background/50 border-border text-lg font-medium">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-4 w-4" />
                                <SelectValue placeholder="Trier par" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border">
                            <SelectItem value="name">Nom (A-Z)</SelectItem>
                            <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
                            <SelectItem value="birth">Date de naissance</SelectItem>
                            <SelectItem value="recent">Récemment ajouté</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-24">
                {filteredMembers.length === 0 && (
                    <div className="text-center py-20 animate-fade-in">
                        <p className="text-xl text-muted-foreground font-serif italic">Aucun membre ne correspond à votre recherche.</p>
                    </div>
                )}

                {/* Living Members Section */}
                {living.length > 0 && (showSections || filterCategory === "living") && (
                    <section className="animate-reveal [animation-delay:0.1s]">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="font-serif text-3xl font-black text-foreground flex items-center gap-4">
                                <span className="h-10 w-1.5 bg-primary rounded-full"></span>
                                {filterCategory === "living" ? "Résultats (Vivants)" : "Membres Actuels"}
                                <span className="text-xl font-medium text-muted-foreground font-sans ml-2">({living.length})</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {living.map((person) => (
                                <PersonCard key={person.id} person={person} variant="detailed" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Deceased Members Section */}
                {deceased.length > 0 && (showSections || filterCategory === "deceased") && (
                    <section className="animate-reveal [animation-delay:0.2s]">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="font-serif text-3xl font-black text-foreground flex items-center gap-4">
                                <span className="h-10 w-1.5 bg-muted-foreground/30 rounded-full"></span>
                                {filterCategory === "deceased" ? "Résultats (Décédés)" : "Nos Illustres Ancêtres"}
                                <span className="text-xl font-medium text-muted-foreground font-sans ml-2">({deceased.length})</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {deceased.map((person) => (
                                <PersonCard key={person.id} person={person} variant="detailed" />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}

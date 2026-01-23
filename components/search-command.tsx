"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Calculator, Calendar, CreditCard, Settings, Smile, User, Search } from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { searchPeopleAction } from "@/app/actions/search"
import { Person } from "@/lib/types"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchCommand() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [data, setData] = React.useState<Person[]>([])
    const [isPending, startTransition] = React.useTransition()

    const router = useRouter()

    // Toggle avec raccourci clavier Ctrl+K / Cmd+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    // Recherche avec debounce
    React.useEffect(() => {
        if (query.length < 2) {
            setData([])
            return
        }

        const timer = setTimeout(async () => {
            startTransition(async () => {
                const results = await searchPeopleAction(query)
                setData(results)
            })
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const handleSelect = (id: string) => {
        setOpen(false)
        router.push(`/person/${id}`)
    }

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">Rechercher...</span>
                <span className="inline-flex lg:hidden">Rechercher...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Rechercher un membre de la famille..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

                    {query.length < 2 && (
                        <p className="p-4 text-sm text-muted-foreground text-center">
                            Tapez au moins 2 caractères pour rechercher
                        </p>
                    )}

                    {data.length > 0 && (
                        <CommandGroup heading="Personnes">
                            {data.map((person) => (
                                <CommandItem
                                    key={person.id}
                                    value={`${person.firstName} ${person.lastName}`}
                                    onSelect={() => handleSelect(person.id)}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>{person.firstName} {person.lastName}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        {person.birthDate ? new Date(person.birthDate).getFullYear() : "?"}
                                        {" - "}
                                        {person.deathDate ? new Date(person.deathDate).getFullYear() : (person.birthDate ? "Présent" : "?")}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}

"use client"

import * as React from "react"
import { Edit2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updatePersonAction } from "@/app/actions/update-person"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface EditPersonDialogProps {
    person: {
        id: string
        firstName: string
        lastName: string
        birthName: string | null
        occupation: string | null
        biography: string | null
        birthDate: Date | string | null
        birthPlace: string | null
        deathDate: Date | string | null
        deathPlace: string | null
    }
}

export function EditPersonDialog({ person }: EditPersonDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [isPending, setIsPending] = React.useState(false)
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsPending(true)

        const formData = new FormData(event.currentTarget)

        const birthDateVal = formData.get("birthDate") as string
        const deathDateVal = formData.get("deathDate") as string

        const data = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            birthName: formData.get("birthName") as string || null,
            occupation: formData.get("occupation") as string || null,
            biography: formData.get("biography") as string || null,
            birthPlace: formData.get("birthPlace") as string || null,
            deathPlace: formData.get("deathPlace") as string || null,
            birthDate: birthDateVal ? new Date(birthDateVal) : null,
            deathDate: deathDateVal ? new Date(deathDateVal) : null,
        }

        const result = await updatePersonAction(person.id, data as any)

        setIsPending(false)

        if (result.success) {
            toast.success("Informations mises à jour")
            setOpen(false)
            router.refresh()
        } else {
            toast.error(result.error || "Une erreur est survenue")
        }
    }

    // Format date for input type="date"
    const formatDate = (date: Date | string | null) => {
        if (!date) return ""
        const d = new Date(date)
        return d.toISOString().split('T')[0]
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    Modifier le profil
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Modifier le profil</DialogTitle>
                        <DialogDescription>
                            Mettez à jour les informations de {person.firstName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" name="firstName" defaultValue={person.firstName} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input id="lastName" name="lastName" defaultValue={person.lastName} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="birthName">Nom de naissance (si différent)</Label>
                                <Input id="birthName" name="birthName" defaultValue={person.birthName || ""} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="occupation">Activité / Profession</Label>
                                <Input id="occupation" name="occupation" defaultValue={person.occupation || ""} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="birthDate">Date de naissance</Label>
                                <Input id="birthDate" name="birthDate" type="date" defaultValue={formatDate(person.birthDate)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="birthPlace">Lieu de naissance</Label>
                                <Input id="birthPlace" name="birthPlace" defaultValue={person.birthPlace || ""} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="deathDate">Date de décès (optionnel)</Label>
                                <Input id="deathDate" name="deathDate" type="date" defaultValue={formatDate(person.deathDate)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deathPlace">Lieu de décès</Label>
                                <Input id="deathPlace" name="deathPlace" defaultValue={person.deathPlace || ""} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="biography">Biographie</Label>
                            <Textarea
                                id="biography"
                                name="biography"
                                defaultValue={person.biography || ""}
                                className="min-h-[150px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enregistrer les modifications
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

"use client"

import * as React from "react"
import { Plus, Calendar as CalendarIcon, Loader2 } from "lucide-react"
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
import { addLifeEventAction } from "@/app/actions/life-events"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AddLifeEventDialogProps {
    personId: string
    personName: string
}

export function AddLifeEventDialog({ personId, personName }: AddLifeEventDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [isPending, setIsPending] = React.useState(false)
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsPending(true)

        const formData = new FormData(event.currentTarget)
        const data = {
            title: formData.get("title") as string,
            type: formData.get("type") as string,
            date: new Date(formData.get("date") as string),
            place: formData.get("place") as string,
            description: formData.get("description") as string,
        }

        const result = await addLifeEventAction(personId, data)

        setIsPending(false)

        if (result.success) {
            toast.success("Événement ajouté avec succès")
            setOpen(false)
            router.refresh()
        } else {
            toast.error(result.error || "Une erreur est survenue")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un événement
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Ajouter un événement</DialogTitle>
                        <DialogDescription>
                            Ajoutez un moment important dans la vie de {personName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Titre de l'événement</Label>
                            <Input id="title" name="title" placeholder="Ex: Mariage, Diplôme, Voyage..." required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Input id="type" name="type" placeholder="Ex: Social" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" name="date" type="date" required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="place">Lieu (Optionnel)</Label>
                            <Input id="place" name="place" placeholder="Ville, Pays..." />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optionnel)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Racontez l'histoire de cet événement..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

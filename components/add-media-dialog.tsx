"use client"

import * as React from "react"
import { Plus, Image as ImageIcon, Loader2 } from "lucide-react"
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
import { addMediaAction } from "@/app/actions/media"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface AddMediaDialogProps {
    personId: string
    personName: string
}

export function AddMediaDialog({ personId, personName }: AddMediaDialogProps) {
    const { data: session } = useSession()
    const role = (session?.user as any)?.role || "VIEWER"
    const canEdit = role === "ADMIN" || role === "MEMBER"

    const [open, setOpen] = React.useState(false)
    const [isPending, setIsPending] = React.useState(false)

    if (!canEdit) return null

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsPending(true)

        const formData = new FormData(event.currentTarget)
        const dateVal = formData.get("date") as string

        const data = {
            url: formData.get("url") as string,
            title: formData.get("title") as string,
            type: "image/jpeg", // Simplified for demo
            description: formData.get("description") as string || undefined,
            date: dateVal ? new Date(dateVal) : undefined,
        }

        const result = await addMediaAction(personId, data)

        setIsPending(false)

        if (result.success) {
            toast.success("Document ajouté")
            setOpen(false)
        } else {
            toast.error(result.error || "Une erreur est survenue")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un document
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Ajouter un document</DialogTitle>
                        <DialogDescription>
                            Ajoutez une photo ou un document d&apos;archive pour {personName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="url">URL de l&apos;image</Label>
                            <Input id="url" name="url" placeholder="https://..." required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Titre du document</Label>
                            <Input id="title" name="title" placeholder="Ex: Photo de mariage" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date du document (optionnel)</Label>
                            <Input id="date" name="date" type="date" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Légende / Description</Label>
                            <Input id="description" name="description" placeholder="Optionnel" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ajouter
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

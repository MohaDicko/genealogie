"use client"

import * as React from "react"
import { Plus, Image as ImageIcon, Loader2, UploadCloud } from "lucide-react"
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
import { supabase } from "@/lib/supabase"

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
    const [uploadMode, setUploadMode] = React.useState<"url" | "file">("file")
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

    if (!canEdit) return null

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsPending(true)

        try {
            const formData = new FormData(event.currentTarget)
            let finalUrl = formData.get("url") as string

            // Handle File Upload if in file mode
            if (uploadMode === "file" && selectedFile) {
                const fileExt = selectedFile.name.split('.').pop()
                const fileName = `${personId}/${Date.now()}.${fileExt}`
                const bucketName = "media" // Ensure this bucket exists in Supabase

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(fileName, selectedFile)

                if (uploadError) {
                    throw new Error(`Erreur d'upload: ${uploadError.message}`)
                }

                // Get Public URL
                const { data: publicUrlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(fileName)

                finalUrl = publicUrlData.publicUrl
            } else if (uploadMode === "file" && !selectedFile) {
                throw new Error("Veuillez sélectionner un fichier.")
            }

            const dateVal = formData.get("date") as string

            const data = {
                url: finalUrl,
                title: formData.get("title") as string,
                type: selectedFile?.type || "image/jpeg",
                description: formData.get("description") as string || undefined,
                date: dateVal ? new Date(dateVal) : undefined,
            }

            const result = await addMediaAction(personId, data)

            if (result.success) {
                toast.success("Média ajouté avec succès")
                setOpen(false)
                setSelectedFile(null)
            } else {
                toast.error(result.error || "Une erreur est survenue")
            }
        } catch (error: any) {
            // Error handling managed by toast below
            console.error("Erreur détaillée upload:", error);
            toast.error(error.message || "Erreur inattendue")
        } finally {
            setIsPending(false)
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

                    <div className="flex gap-2 mb-4 p-1 bg-muted rounded-lg">
                        <Button
                            type="button"
                            variant={uploadMode === "file" ? "secondary" : "ghost"}
                            className="flex-1 text-xs"
                            onClick={() => setUploadMode("file")}
                        >
                            <UploadCloud className="mr-2 h-3 w-3" /> Fichier
                        </Button>
                        <Button
                            type="button"
                            variant={uploadMode === "url" ? "secondary" : "ghost"}
                            className="flex-1 text-xs"
                            onClick={() => setUploadMode("url")}
                        >
                            <ImageIcon className="mr-2 h-3 w-3" /> URL Externe
                        </Button>
                    </div>

                    <div className="grid gap-4 py-4">
                        {uploadMode === "url" ? (
                            <div className="grid gap-2">
                                <Label htmlFor="url">URL de l&apos;image</Label>
                                <Input id="url" name="url" placeholder="https://..." required={uploadMode === "url"} />
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <Label htmlFor="file">Fichier (Image/PDF)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="file"
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        className="cursor-pointer"
                                    />
                                </div>
                                {selectedFile && (
                                    <p className="text-xs text-muted-foreground truncate">
                                        Sélectionné : {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>
                        )}

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
                            {uploadMode === "file" ? "Téléverser & Ajouter" : "Ajouter"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

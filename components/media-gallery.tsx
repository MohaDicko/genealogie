"use client"

import { useState } from "react"
import { Media } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, FileText, Trash2, ExternalLink, Maximize2 } from "lucide-react"
import { formatDateFr } from "@/lib/genealogy-utils"
import { deleteMediaAction } from "@/app/actions/media"
import { toast } from "sonner"

interface MediaGalleryProps {
    media: Media[]
    personId: string
}

export function MediaGallery({ media, personId }: MediaGalleryProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const handleDelete = async (mediaId: string) => {
        setIsDeleting(mediaId)
        const result = await deleteMediaAction(mediaId, personId)
        setIsDeleting(null)

        if (result.success) {
            toast.success("Média supprimé")
        } else {
            toast.error(result.error)
        }
    }

    if (media.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
                <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground italic">Aucun document ou photo pour le moment.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => {
                const isImage = item.type.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp"].some(ext => item.url.toLowerCase().endsWith(ext))

                return (
                    <Card key={item.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
                        <div className="relative aspect-square bg-muted">
                            {isImage ? (
                                <img
                                    src={item.url}
                                    alt={item.title || "Média"}
                                    className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FileText className="h-12 w-12 text-muted-foreground" />
                                </div>
                            )}

                            {/* Overlay actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="h-8 w-8"
                                    onClick={() => handleDelete(item.id)}
                                    disabled={isDeleting === item.id}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-3">
                            <h4 className="font-semibold text-sm truncate">{item.title || "Sans titre"}</h4>
                            {item.date && (
                                <p className="text-[10px] text-muted-foreground">{formatDateFr(item.date)}</p>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

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
        if (!confirm("Voulez-vous vraiment supprimer ce média ?")) return
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
            <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-border/50">
                <div className="h-16 w-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground italic font-medium">L&apos;album de souvenirs est encore vierge.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {media.map((item, index) => {
                const isImage = item.type.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp"].some(ext => item.url.toLowerCase().endsWith(ext))

                return (
                    <Card key={item.id} className="group overflow-hidden premium-card border-none animate-reveal" style={{ animationDelay: `${index * 0.05}s` }}>
                        <div className="relative aspect-[4/5] bg-muted">
                            {isImage ? (
                                <img
                                    src={item.url}
                                    alt={item.title || "Média"}
                                    className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-linear-to-br from-secondary to-muted">
                                    <FileText className="h-12 w-12 text-primary/40" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Document</span>
                                </div>
                            )}

                            {/* Premium Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" className="flex-1 gap-2 rounded-xl h-10 font-bold" asChild>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                            <Maximize2 className="h-4 w-4" />
                                            Ouvrir
                                        </a>
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="h-10 w-10 rounded-xl"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={isDeleting === item.id}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-background/50 backdrop-blur-sm">
                            <h4 className="font-serif font-black text-sm truncate text-foreground leading-tight group-hover:text-primary transition-colors">
                                {item.title || "Fragment d&apos;histoire"}
                            </h4>
                            {item.date && (
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest italic">{formatDateFr(item.date)}</p>
                            )}
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}

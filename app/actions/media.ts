"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function addMediaAction(personId: string, data: {
    url: string
    type: string
    title?: string
    description?: string
    date?: Date
}) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || (session as any).user.role === "VIEWER") {
        return { success: false, error: "Vous n'avez pas les droits nécessaires pour ajouter des médias." }
    }

    try {
        const media = await prisma.media.create({
            data: {
                ...data,
                personId
            }
        })
        revalidatePath(`/person/${personId}`)
        return { success: true, media }
    } catch (error) {
        console.error("Error adding media:", error)
        return { success: false, error: "Erreur lors de l'ajout du média" }
    }
}

export async function deleteMediaAction(mediaId: string, personId: string) {
    const session = await getServerSession(authOptions)
    // Only contributors or admins can delete media. Let's say only ADMIN for deletion to be safe, or just contributors.
    // Let's go with Admin/Member for media delete too.
    if (!session || !session.user || (session as any).user.role === "VIEWER") {
        return { success: false, error: "Non autorisé" }
    }

    try {
        await prisma.media.delete({
            where: { id: mediaId }
        })
        revalidatePath(`/person/${personId}`)
        return { success: true }
    } catch (error) {
        console.error("Error deleting media:", error)
        return { success: false, error: "Erreur lors de la suppression du média" }
    }
}

"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addMediaAction(personId: string, data: {
    url: string
    type: string
    title?: string
    description?: string
    date?: Date
}) {
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

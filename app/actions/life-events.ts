"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function addLifeEventAction(personId: string, data: {
    type: string
    title: string
    description?: string
    date: Date
    place?: string
}) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || (session as any).user.role === "VIEWER") {
        return { success: false, error: "Vous n'avez pas les droits nécessaires pour ajouter des événements." }
    }

    try {
        const event = await prisma.lifeEvent.create({
            data: {
                ...data,
                personId
            }
        })
        revalidatePath(`/person/${personId}`)
        return { success: true, event }
    } catch (error) {
        console.error("Error adding life event:", error)
        return { success: false, error: "Erreur lors de l'ajout de l'événement" }
    }
}

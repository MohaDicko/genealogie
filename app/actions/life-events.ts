"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addLifeEventAction(personId: string, data: {
    type: string
    title: string
    description?: string
    date: Date
    place?: string
}) {
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

"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updatePersonAction(id: string, data: {
    firstName?: string
    lastName?: string
    birthName?: string
    occupation?: string
    biography?: string
    birthDate?: Date
    birthPlace?: string
    deathDate?: Date
    deathPlace?: string
}) {
    try {
        const person = await prisma.person.update({
            where: { id },
            data
        })
        revalidatePath(`/person/${id}`)
        revalidatePath('/')
        return { success: true, person }
    } catch (error) {
        console.error("Error updating person:", error)
        return { success: false, error: "Erreur lors de la mise à jour des informations" }
    }
}

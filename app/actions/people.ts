"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPersonAction(data: {
    firstName: string
    lastName: string
    gender: string
    birthName?: string | null
    occupation?: string | null
    biography?: string | null
    birthDate?: Date | null
    birthPlace?: string | null
    deathDate?: Date | null
    deathPlace?: string | null
    fatherId?: string | null
    motherId?: string | null
    spouseId?: string | null
}) {
    try {
        const person = await prisma.person.create({
            // @ts-ignore - bypassing strict types for rapid dev if needed, but should be fine
            data: {
                ...data,
                // On pourrait ajouter createdById ici si on avait l'auth session
            }
        })

        revalidatePath('/')
        revalidatePath('/members')
        revalidatePath('/tree')

        return { success: true, person }
    } catch (error) {
        console.error("Error creating person:", error)
        return { success: false, error: "Erreur lors de la création de la personne" }
    }
}

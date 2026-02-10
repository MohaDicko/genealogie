"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { personSchema } from "@/lib/validations/person"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// Schéma partiel pour la mise à jour
const updatePersonSchema = personSchema.partial()

export async function updatePersonAction(id: string, data: z.infer<typeof updatePersonSchema>) {
    // 1. Validation de session
    const session = await getServerSession(authOptions)

    if (!session || !session.user || (session as any).user.role === "VIEWER") {
        return {
            success: false,
            error: "Vous n'avez pas les droits nécessaires pour modifier les membres."
        }
    }

    // 2. Validation des données
    const result = updatePersonSchema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            error: "Données invalides : " + result.error.issues.map(i => i.message).join(", ")
        }
    }

    const validData = result.data;

    try {
        const person = await prisma.person.update({
            where: { id },
            data: validData
        })
        revalidatePath(`/person/${id}`)
        revalidatePath('/')
        return { success: true, person }
    } catch (error) {
        console.error("Error updating person:", error)
        return { success: false, error: "Erreur lors de la mise à jour des informations" }
    }
}

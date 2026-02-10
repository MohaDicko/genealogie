"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { personSchema } from "@/lib/validations/person"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// fs usage removed for Vercel edge/serverless compatibility
export async function createPersonAction(data: z.infer<typeof personSchema>) {
    console.log(`--- Action started at ${new Date().toISOString()} ---`);
    console.log(`Input data: ${JSON.stringify(data)}`);

    try {
        // 1. Validation de session
        const session = await getServerSession(authOptions)

        if (!session || !session.user || (session as any).user.role === "VIEWER") {
            console.log(`Error: No permission (VIEWER)`);
            return {
                success: false,
                error: "Vous n'avez pas les droits nécessaires pour ajouter des membres."
            }
        }

        console.log(`User ID: ${session.user.id}`);

        // 2. Validation des données
        const result = personSchema.safeParse(data);

        if (!result.success) {
            console.log(`Error: Validation failed: ${JSON.stringify(result.error.format())}`);
            return {
                success: false,
                error: "Données invalides : " + result.error.issues.map(i => i.message).join(", ")
            }
        }

        const validData = result.data;
        console.log(`Data validated: ${JSON.stringify(validData)}`);

        // 3. Création
        const person = await prisma.person.create({
            data: {
                firstName: validData.firstName,
                lastName: validData.lastName,
                gender: validData.gender,
                birthName: validData.birthName,
                birthDate: validData.birthDate,
                birthPlace: validData.birthPlace,
                occupation: validData.occupation,
                biography: validData.biography,
                deathDate: (validData as any).deathDate,
                deathPlace: (validData as any).deathPlace,
                fatherId: validData.fatherId,
                motherId: validData.motherId,
                spouseId: validData.spouseId,
                createdById: session.user.id,
            },
        });

        console.log(`Success: Created person ${person.id}`);

        // 4. Revalidation
        revalidatePath('/')
        revalidatePath('/members')
        revalidatePath('/tree')

        if (validData.fatherId) revalidatePath(`/person/${validData.fatherId}`)
        if (validData.motherId) revalidatePath(`/person/${validData.motherId}`)
        if (validData.spouseId) revalidatePath(`/person/${validData.spouseId}`)

        return { success: true, person }

    } catch (error: any) {
        console.log(`CRITICAL ERROR: ${error.message}`);
        console.error("Error in createPersonAction:", error)
        return {
            success: false,
            error: "Une erreur interne est survenue lors de la création."
        }
    }
}

export async function deletePersonAction(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user || (session as any).user.role !== "ADMIN") {
            return { success: false, error: "Action réservée aux administrateurs." }
        }

        console.log(`Delete action for ID: ${id} by user: ${session.user.id}`);

        // Nullify relations where this person is a father, mother or spouse
        await prisma.$transaction([
            prisma.person.updateMany({
                where: { fatherId: id },
                data: { fatherId: null }
            }),
            prisma.person.updateMany({
                where: { motherId: id },
                data: { motherId: null }
            }),
            prisma.person.updateMany({
                where: { spouseId: id },
                data: { spouseId: null }
            }),
            prisma.person.delete({
                where: { id }
            })
        ]);

        revalidatePath('/')
        revalidatePath('/members')
        revalidatePath('/tree')

        return { success: true }
    } catch (error: any) {
        console.log(`Delete FAILED for ID ${id}: ${error.message}`);
        console.error("Error deleting person:", error)
        return { success: false, error: "Impossible de supprimer cette personne. Vérifiez qu'elle n'a pas de liens familiaux actifs (enfants ou conjoint)." }
    }
}


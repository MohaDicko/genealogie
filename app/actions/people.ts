"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { personSchema } from "@/lib/validations/person"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import fs from 'fs'

export async function createPersonAction(data: z.infer<typeof personSchema>) {
    const logFile = 'action-log.txt';
    try {
        fs.appendFileSync(logFile, `\n--- Action started at ${new Date().toISOString()} ---\n`);
        fs.appendFileSync(logFile, `Input data: ${JSON.stringify(data)}\n`);

        // 1. Validation de session
        const session = await getServerSession(authOptions)

        if (!session || !session.user || (session as any).user.role === "VIEWER") {
            fs.appendFileSync(logFile, `Error: No permission (VIEWER)\n`);
            return {
                success: false,
                error: "Vous n'avez pas les droits nécessaires pour ajouter des membres."
            }
        }

        fs.appendFileSync(logFile, `User ID: ${session.user.id}\n`);

        // 2. Validation des données
        const result = personSchema.safeParse(data);

        if (!result.success) {
            fs.appendFileSync(logFile, `Error: Validation failed: ${JSON.stringify(result.error.format())}\n`);
            return {
                success: false,
                error: "Données invalides : " + result.error.issues.map(i => i.message).join(", ")
            }
        }

        const validData = result.data;
        fs.appendFileSync(logFile, `Data validated: ${JSON.stringify(validData)}\n`);

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

        fs.appendFileSync(logFile, `Success: Created person ${person.id}\n`);

        // 4. Revalidation
        revalidatePath('/')
        revalidatePath('/members')
        revalidatePath('/tree')

        if (validData.fatherId) revalidatePath(`/person/${validData.fatherId}`)
        if (validData.motherId) revalidatePath(`/person/${validData.motherId}`)
        if (validData.spouseId) revalidatePath(`/person/${validData.spouseId}`)

        return { success: true, person }

    } catch (error: any) {
        fs.appendFileSync(logFile, `CRITICAL ERROR: ${error.message}\n`);
        console.error("Error in createPersonAction:", error)
        return {
            success: false,
            error: "Une erreur interne est survenue lors de la création."
        }
    }
}

export async function deletePersonAction(id: string) {
    const logFile = 'action-log.txt';
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user || (session as any).user.role !== "ADMIN") {
            return { success: false, error: "Action réservée aux administrateurs." }
        }

        fs.appendFileSync(logFile, `Delete action for ID: ${id} by user: ${session.user.id}\n`);

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
        fs.appendFileSync(logFile, `Delete FAILED for ID ${id}: ${error.message}\n`);
        console.error("Error deleting person:", error)
        return { success: false, error: "Impossible de supprimer cette personne. Vérifiez qu'elle n'a pas de liens familiaux actifs (enfants ou conjoint)." }
    }
}


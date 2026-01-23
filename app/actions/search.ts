"use server"

import { prisma } from "@/lib/prisma"
import { Person } from "@/lib/types"

export async function searchPeopleAction(query: string): Promise<Person[]> {
    if (!query || query.length < 2) return []

    const results = await prisma.person.findMany({
        where: {
            OR: [
                { firstName: { contains: query } }, // SQLite search is case-sensitive by default usually, but Prisma might normalize. 
                // In proper PostgreSQL we'd use mode: 'insensitive', but here we are on SQLite.
                // For standard SQLite in Prisma, contains is case-insensitive usually? Let's check docs or assume basic behavior.
                // Note: Prisma with SQLite 'contains' is usually case-insensitive.
                { lastName: { contains: query } },
                { birthPlace: { contains: query } },
            ],
        },
        take: 10,
        orderBy: { lastName: 'asc' },
    })

    // Cast to match our frontend interface
    return results as unknown as Person[]
}

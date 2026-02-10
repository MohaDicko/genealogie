"use server"

import { prisma } from "@/lib/prisma"
import { Person } from "@/lib/types"

export async function searchPeopleAction(query: string): Promise<Person[]> {
    if (!query || query.length < 2) return []

    const results = await prisma.person.findMany({
        where: {
            OR: [
                { firstName: { contains: query } },
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

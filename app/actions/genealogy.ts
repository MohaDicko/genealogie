"use server"

import { prisma } from "@/lib/prisma"
import { Person } from "@prisma/client"

// Type retourné par la server action (compatible avec notre frontend)
// Note: On pourrait utiliser directement les types Prisma, mais on veut peut-être mapper vers notre type Person frontend
// Pour simplifier ici on renvoie un tableau de Person (Prisma)

export async function getAncestorsAction(personId: string, generations: number = 7): Promise<Person[]> {
    const ancestors: Person[] = []

    // Set pour éviter les doublons et boucles infinies
    const visited = new Set<string>()

    async function fetchAncestorsRecursive(currentId: string, currentGen: number) {
        if (currentGen > generations || visited.has(currentId)) {
            return
        }

        visited.add(currentId)

        const person = await prisma.person.findUnique({
            where: { id: currentId },
        })

        if (!person) return

        // On ajoute la personne à la liste (sauf si c'est la personne de départ, selon le besoin.
        // Ici on l'ajoute car elle fait partie de l'arbre)
        ancestors.push(person)

        const promises = []

        if (person.fatherId) {
            promises.push(fetchAncestorsRecursive(person.fatherId, currentGen + 1))
        }

        if (person.motherId) {
            promises.push(fetchAncestorsRecursive(person.motherId, currentGen + 1))
        }

        await Promise.all(promises)
    }

    await fetchAncestorsRecursive(personId, 0)

    return ancestors
}

// Fonction pour récupérer le chemin entre deux personnes (Server Side)
export async function getRelationshipPathAction(fromId: string, toId: string) {
    // Cette implémentation serait plus complexe en SQL pur.
    // Souvent, il est plus simple de charger tout l'arbre ou une grande partie en mémoire
    // pour faire le BFS si la base n'est pas énorme (quelques milliers de personnes ça passe en RAM).

    // Pour une solution évolutive, on utiliserait une requête SQL récursive (WITH RECURSIVE)
    // Mais Prisma ne le supporte pas nativement avec son API fluente, il faut utiliser rawQuery.

    // Voici une approche naïve : charger les ancêtres des deux et trouver l'ancêtre commun
    // Ou charger tout le graphe connecté (peut être lourd).

    // Pour l'instant, on laisse cette logique côté client avec les données chargées,
    // ou on implémentera une version SQL raw plus tard.
    return { message: "Not implemented specifically as server action yet, use client side logic with fetched data" }
}

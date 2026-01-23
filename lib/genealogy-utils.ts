import type { Person, RelationshipPath, FamilyTreeNode, FamilyTreeEdge, Gender } from "./types"

/**
 * Creates a Map of persons by their ID
 */
export function createPersonsMap(persons: Person[]): Map<string, Person> {
  return new Map(persons.map((p) => [p.id, p]))
}

/**
 * Calcule le chemin de parenté entre deux personnes
 * Retourne le chemin et la description de la relation
 */
export function calculateRelationshipPath(
  from: Person,
  to: Person,
  allPersons: Map<string, Person>,
): RelationshipPath | null {
  // BFS pour trouver le chemin le plus court
  const visited = new Set<string>()
  const queue: Array<{ person: Person; path: Person[]; direction: "up" | "down" | "start" }> = [
    { person: from, path: [from], direction: "start" },
  ]

  while (queue.length > 0) {
    const current = queue.shift()!

    if (current.person.id === to.id) {
      return {
        from,
        to,
        path: current.path,
        relationship: describeRelationship(current.path, from, to),
      }
    }

    if (visited.has(current.person.id)) continue
    visited.add(current.person.id)

    // Remonter vers les parents
    if (current.person.fatherId && !visited.has(current.person.fatherId)) {
      const father = allPersons.get(current.person.fatherId)
      if (father) {
        queue.push({ person: father, path: [...current.path, father], direction: "up" })
      }
    }

    if (current.person.motherId && !visited.has(current.person.motherId)) {
      const mother = allPersons.get(current.person.motherId)
      if (mother) {
        queue.push({ person: mother, path: [...current.path, mother], direction: "up" })
      }
    }

    // Descendre vers les enfants
    const children = Array.from(allPersons.values()).filter(
      (p) => p.fatherId === current.person.id || p.motherId === current.person.id,
    )

    for (const child of children) {
      if (!visited.has(child.id)) {
        queue.push({ person: child, path: [...current.path, child], direction: "down" })
      }
    }

    // Vérifier le conjoint
    if (current.person.spouseId && !visited.has(current.person.spouseId)) {
      const spouse = allPersons.get(current.person.spouseId)
      if (spouse) {
        queue.push({ person: spouse, path: [...current.path, spouse], direction: "start" })
      }
    }
  }

  return null
}

/**
 * Décrit la relation en français
 */
function describeRelationship(path: Person[], from: Person, to: Person): string {
  if (path.length === 1) return "même personne"
  if (path.length === 2) {
    const relation = getDirectRelation(from, to)
    if (relation) return relation
  }

  // Compter les générations montantes et descendantes
  let ascending = 0
  let descending = 0

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i]
    const next = path[i + 1]

    if (next.fatherId === current.id || next.motherId === current.id) {
      descending++
    } else if (current.fatherId === next.id || current.motherId === next.id) {
      ascending++
    }
  }

  if (ascending > 0 && descending === 0) {
    return getAscendantTitle(ascending, to.gender)
  }

  if (descending > 0 && ascending === 0) {
    return getDescendantTitle(descending, to.gender)
  }

  if (ascending === descending) {
    return `cousin${to.gender === "FEMALE" ? "e" : ""} au ${ascending}${ascending === 1 ? "er" : "e"} degré`
  }

  return `parent éloigné (${ascending} gén. montantes, ${descending} gén. descendantes)`
}

function getDirectRelation(from: Person, to: Person): string | null {
  if (from.fatherId === to.id) return to.gender === "MALE" ? "père" : "mère"
  if (from.motherId === to.id) return to.gender === "FEMALE" ? "mère" : "père"
  if (to.fatherId === from.id || to.motherId === from.id) {
    return to.gender === "MALE" ? "fils" : "fille"
  }
  if (from.spouseId === to.id) return to.gender === "MALE" ? "époux" : "épouse"

  return null
}

function getAscendantTitle(generations: number, gender: Gender): string {
  const isFemale = gender === "FEMALE"

  switch (generations) {
    case 1:
      return isFemale ? "mère" : "père"
    case 2:
      return isFemale ? "grand-mère" : "grand-père"
    case 3:
      return isFemale ? "arrière-grand-mère" : "arrière-grand-père"
    case 4:
      return isFemale ? "arrière-arrière-grand-mère" : "arrière-arrière-grand-père"
    default: {
      const prefix = "arrière-".repeat(generations - 2)
      return isFemale ? `${prefix}grand-mère` : `${prefix}grand-père`
    }
  }
}

function getDescendantTitle(generations: number, gender: Gender): string {
  const isFemale = gender === "FEMALE"

  switch (generations) {
    case 1:
      return isFemale ? "fille" : "fils"
    case 2:
      return isFemale ? "petite-fille" : "petit-fils"
    case 3:
      return isFemale ? "arrière-petite-fille" : "arrière-petit-fils"
    default: {
      const prefix = "arrière-".repeat(generations - 2)
      return isFemale ? `${prefix}petite-fille` : `${prefix}petit-fils`
    }
  }
}

/**
 * Récupère les ancêtres d'une personne sur N générations
 */
export function getAncestors(
  person: Person,
  allPersons: Map<string, Person>,
  maxGenerations = 7,
): Map<number, Person[]> {
  const ancestors = new Map<number, Person[]>()
  ancestors.set(0, [person])

  function fetchGeneration(currentPerson: Person, generation: number) {
    if (generation >= maxGenerations) return

    const nextGen = generation + 1
    if (!ancestors.has(nextGen)) {
      ancestors.set(nextGen, [])
    }

    if (currentPerson.fatherId) {
      const father = allPersons.get(currentPerson.fatherId)
      if (father) {
        ancestors.get(nextGen)!.push(father)
        fetchGeneration(father, nextGen)
      }
    }

    if (currentPerson.motherId) {
      const mother = allPersons.get(currentPerson.motherId)
      if (mother) {
        ancestors.get(nextGen)!.push(mother)
        fetchGeneration(mother, nextGen)
      }
    }
  }

  fetchGeneration(person, 0)
  return ancestors
}

/**
 * Obtient la lignée directe entre deux personnes
 */
export function getDirectLineage(from: Person, to: Person, allPersons: Map<string, Person>): Person[] {
  const result = calculateRelationshipPath(from, to, allPersons)
  return result?.path ?? []
}

/**
 * Génère les nœuds et arêtes pour React Flow
 */
export function generateTreeLayout(
  rootPerson: Person,
  allPersons: Map<string, Person>,
  maxGenerations = 5,
  highlightLineage?: string[], // IDs des personnes dans la lignée directe
): { nodes: FamilyTreeNode[]; edges: FamilyTreeEdge[] } {
  const nodes: FamilyTreeNode[] = []
  const edges: FamilyTreeEdge[] = []
  const processedIds = new Set<string>()

  const HORIZONTAL_SPACING = 280
  const VERTICAL_SPACING = 200
  const SIBLING_SPACING = 300

  function processGeneration(persons: Person[], generation: number, startX: number): number {
    let currentX = startX

    persons.forEach((person, index) => {
      if (processedIds.has(person.id)) return
      processedIds.add(person.id)

      const isHighlighted = highlightLineage?.includes(person.id)

      nodes.push({
        id: person.id,
        type: "person",
        position: {
          x: currentX + index * SIBLING_SPACING,
          y: generation * VERTICAL_SPACING,
        },
        data: {
          person,
          generation,
          isRoot: generation === 0,
          isDirectLineage: isHighlighted,
        },
      })

      // Ajouter les arêtes vers les parents
      if (person.fatherId) {
        edges.push({
          id: `${person.id}-father-${person.fatherId}`,
          source: person.fatherId,
          target: person.id,
          type: "parentChild",
          animated: isHighlighted,
        })
      }

      if (person.motherId) {
        edges.push({
          id: `${person.id}-mother-${person.motherId}`,
          source: person.motherId,
          target: person.id,
          type: "parentChild",
          animated: isHighlighted,
        })
      }

      // Ajouter l'arête vers le conjoint
      if (person.spouseId && !processedIds.has(person.spouseId)) {
        const spouse = allPersons.get(person.spouseId)
        if (spouse) {
          processedIds.add(spouse.id)
          nodes.push({
            id: spouse.id,
            type: "person",
            position: {
              x: currentX + index * SIBLING_SPACING + HORIZONTAL_SPACING,
              y: generation * VERTICAL_SPACING,
            },
            data: {
              person: spouse,
              generation,
              isDirectLineage: highlightLineage?.includes(spouse.id),
            },
          })

          edges.push({
            id: `spouse-${person.id}-${spouse.id}`,
            source: person.id,
            target: spouse.id,
            type: "spouse",
            style: { strokeDasharray: "5,5" },
          })
        }
      }

      currentX += SIBLING_SPACING
    })

    return currentX
  }

  // Récupérer les ancêtres par génération
  const ancestorsByGen = getAncestors(rootPerson, allPersons, maxGenerations)

  // Traiter chaque génération de bas en haut
  let maxWidth = 0
  ancestorsByGen.forEach((persons, gen) => {
    const width = processGeneration(persons, gen, 0)
    maxWidth = Math.max(maxWidth, width)
  })

  // Centrer les nœuds
  const centerOffset = maxWidth / 2
  nodes.forEach((node) => {
    node.position.x -= centerOffset
  })

  return { nodes, edges }
}

/**
 * Calcule l'âge d'une personne
 */
export function calculateAge(
  birthDate: Date | string | null | undefined,
  deathDate?: Date | string | null,
): number | null {
  if (!birthDate) return null

  const birth = new Date(birthDate)
  const end = deathDate ? new Date(deathDate) : new Date()

  let age = end.getFullYear() - birth.getFullYear()
  const monthDiff = end.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--
  }

  return age
}

/**
 * Formate une date en français
 */
export function formatDateFr(date: Date | string | null | undefined): string {
  if (!date) return ""

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/**
 * Obtient le nom complet d'une personne
 */
export function getFullName(person: Person): string {
  const parts = [person.firstName, person.lastName]
  if (person.birthName && person.birthName !== person.lastName) {
    parts.push(`(née ${person.birthName})`)
  }
  return parts.join(" ")
}

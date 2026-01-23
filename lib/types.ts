import type React from "react"
// Types TypeScript pour Mémoire Familiale
// Note: Adaptés pour correspondre au schéma Prisma (SQLite) ou types génériques

export type Gender = string
export type MediaType = string
export type EventType = string
export type FamilyRole = string

export interface Person {
  id: string
  firstName: string
  lastName: string
  birthName?: string | null
  gender: Gender
  birthDate?: Date | string | null
  birthPlace?: string | null
  deathDate?: Date | string | null
  deathPlace?: string | null
  biography?: string | null
  photoUrl?: string | null
  occupation?: string | null
  fatherId?: string | null
  motherId?: string | null
  spouseId?: string | null
  marriageDate?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string

  // Relations chargées
  father?: Person | null
  mother?: Person | null
  spouse?: Person | null
  children?: Person[]
  media?: Media[]
  lifeEvents?: LifeEvent[]
}

export interface Media {
  id: string
  url: string
  type: MediaType
  title?: string | null
  description?: string | null
  date?: Date | string | null
  personId: string
  createdAt: Date | string
}

export interface LifeEvent {
  id: string
  type: EventType
  title: string
  description?: string | null
  date: Date | string
  place?: string | null
  personId: string
  createdAt: Date | string
}

export interface Family {
  id: string
  name: string
  description?: string | null
  inviteCode: string
  createdAt: Date | string
  updatedAt: Date | string
}

// Types pour React Flow
export interface FamilyTreeNode {
  id: string
  type: "person"
  position: { x: number; y: number }
  data: {
    person: Person
    generation: number
    isRoot?: boolean
    isDirectLineage?: boolean
  }
}

export interface FamilyTreeEdge {
  id: string
  source: string
  target: string
  type: "parentChild" | "spouse"
  animated?: boolean
  style?: React.CSSProperties
}

// Type pour le calcul du chemin de parenté
export interface RelationshipPath {
  from: Person
  to: Person
  path: Person[]
  relationship: string // ex: "arrière-grand-père paternel"
}

// Type pour les statistiques du dashboard
export interface FamilyStats {
  totalMembers: number
  generations: number
  oldestMember?: Person | null
  youngestMember?: Person | null
  recentlyAdded: Person[]
  upcomingBirthdays: Array<{
    person: Person
    daysUntil: number
  }>
}

"use client"

import type React from "react"

import { useCallback, useMemo, useState, useEffect } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  BackgroundVariant,
  Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { PersonNode } from "./person-node"
import { ParentChildEdge, SpouseEdge } from "./custom-edges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { generateTreeLayout, getDirectLineage, calculateRelationshipPath } from "@/lib/genealogy-utils"
import type { Person, FamilyTreeNode } from "@/lib/types"
import { ZoomIn, ZoomOut, Maximize2, Users, GitBranch, Info, X } from "lucide-react"

interface FamilyTreeProps {
  persons: Person[]
  rootPersonId: string
  onPersonSelect?: (person: Person) => void
  initialFocusId?: string
}

const nodeTypes: NodeTypes = {
  person: PersonNode,
}

const edgeTypes: EdgeTypes = {
  parentChild: ParentChildEdge,
  spouse: SpouseEdge,
}

function createPersonsMapFromArray(persons: Person[]): Map<string, Person> {
  return new Map(persons.map((p) => [p.id, p]))
}

export function FamilyTree({ persons, rootPersonId, onPersonSelect, initialFocusId }: FamilyTreeProps) {
  const [viewMode, setViewMode] = useState<"full" | "lineage">("full")
  const [selectedAncestorId, setSelectedAncestorId] = useState<string | null>(initialFocusId || null)
  const [maxGenerations, setMaxGenerations] = useState(5)
  const [showRelationship, setShowRelationship] = useState<string | null>(null)

  const personsMap = useMemo(() => createPersonsMapFromArray(persons), [persons])
  const rootPerson = personsMap.get(rootPersonId)

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!rootPerson) return { nodes: [], edges: [] }

    let highlightLineage: string[] | undefined

    if (viewMode === "lineage" && selectedAncestorId) {
      const ancestor = personsMap.get(selectedAncestorId)
      if (ancestor) {
        highlightLineage = getDirectLineage(rootPerson, ancestor, personsMap).map((p) => p.id)
      }
    }

    return generateTreeLayout(rootPerson, personsMap, maxGenerations, highlightLineage)
  }, [rootPerson, personsMap, maxGenerations, viewMode, selectedAncestorId])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as Node[])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as Edge[])

  // Update nodes when layout changes
  useEffect(() => {
    setNodes(initialNodes as Node[])
    setEdges(initialEdges as Edge[])
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const person = personsMap.get(node.id)
      if (person && onPersonSelect) {
        onPersonSelect(person)
      }

      // Calculate relationship if in lineage mode
      if (person && rootPerson && person.id !== rootPerson.id) {
        const relationship = calculateRelationshipPath(rootPerson, person, personsMap)
        if (relationship) {
          setShowRelationship(relationship.relationship)
        }
      }
    },
    [personsMap, onPersonSelect, rootPerson],
  )

  // Get ancestors for the lineage selector
  const ancestors = useMemo(() => {
    if (!rootPerson) return []
    return persons.filter((p) => {
      if (p.id === rootPersonId) return false
      const lineage = getDirectLineage(rootPerson, p, personsMap)
      return lineage.length > 0
    })
  }, [persons, rootPersonId, rootPerson, personsMap])

  if (!rootPerson) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground text-lg">
            Sélectionnez une personne pour afficher l&apos;arbre généalogique
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full w-full rounded-lg border border-border overflow-hidden bg-card">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "parentChild",
          animated: false,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />

        <Controls className="!bg-card !border-border !shadow-lg" showInteractive={false}>
          <button className="react-flow__controls-button" title="Zoom avant">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button className="react-flow__controls-button" title="Zoom arrière">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button className="react-flow__controls-button" title="Ajuster à l'écran">
            <Maximize2 className="h-4 w-4" />
          </button>
        </Controls>

        <MiniMap
          className="!bg-card !border-border"
          nodeColor={(node) => {
            const data = node.data as FamilyTreeNode["data"]
            if (data.isRoot) return "var(--primary)"
            if (data.isDirectLineage) return "var(--accent)"
            return "var(--muted)"
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />

        {/* Control Panel */}
        <Panel position="top-left" className="space-y-3">
          <Card className="w-72 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Options d&apos;affichage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="view-mode" className="text-sm">
                  Mode lignée directe
                </Label>
                <Switch
                  id="view-mode"
                  checked={viewMode === "lineage"}
                  onCheckedChange={(checked) => {
                    setViewMode(checked ? "lineage" : "full")
                    if (!checked) setShowRelationship(null)
                  }}
                />
              </div>

              {viewMode === "lineage" && (
                <div className="space-y-2">
                  <Label htmlFor="ancestor-select" className="text-sm flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Ancêtre cible
                  </Label>
                  <Select value={selectedAncestorId || ""} onValueChange={setSelectedAncestorId}>
                    <SelectTrigger id="ancestor-select" className="touch-target">
                      <SelectValue placeholder="Choisir un ancêtre" />
                    </SelectTrigger>
                    <SelectContent>
                      {ancestors.map((ancestor) => (
                        <SelectItem key={ancestor.id} value={ancestor.id}>
                          {ancestor.firstName} {ancestor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="generations" className="text-sm">
                  Générations affichées: {maxGenerations}
                </Label>
                <Select
                  value={maxGenerations.toString()}
                  onValueChange={(val) => setMaxGenerations(Number.parseInt(val))}
                >
                  <SelectTrigger id="generations" className="touch-target">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 4, 5, 6, 7].map((gen) => (
                      <SelectItem key={gen} value={gen.toString()}>
                        {gen} générations
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </Panel>

        {/* Relationship Info Panel */}
        {showRelationship && (
          <Panel position="top-right">
            <Card className="w-64 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Info className="h-4 w-4 shrink-0" />
                    <p className="text-sm font-medium">Lien de parenté</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => setShowRelationship(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-lg font-serif font-semibold text-foreground capitalize">{showRelationship}</p>
              </CardContent>
            </Card>
          </Panel>
        )}

        {/* Legend */}
        <Panel position="bottom-left">
          <Card className="shadow-lg">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Légende</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span>Personne racine</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded-full bg-accent" />
                  <span>Lignée directe</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-0.5 w-6 bg-border" />
                  <span>Lien parent-enfant</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-0.5 w-6 bg-accent" style={{ strokeDasharray: "3,3" }} />
                  <span className="flex items-center gap-1">
                    <span className="h-0.5 w-1 bg-accent" />
                    <span className="h-0.5 w-1 bg-accent" />
                    <span className="h-0.5 w-1 bg-accent" />
                    Lien conjugal
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Panel>
      </ReactFlow>
    </div>
  )
}

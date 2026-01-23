"use client"

import { useCallback, useMemo } from "react"
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Edge,
    Node,
    BackgroundVariant,
    Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import PersonNode from "./person-node"
import { Person } from "@/lib/types"
import { generateTreeLayout } from "@/lib/genealogy-utils"
import { Button } from "@/components/ui/button"
import { Filter, Search } from "lucide-react"

// Types pour les props du composant
interface FamilyTreeProps {
    rootPerson: Person
    allPersons: Map<string, Person>
    initialGenerations?: number
}

// Définition des types de nœuds personnalisés
// Il est important de le définir hors du composant pour éviter les re-rendus inutiles
const nodeTypes = {
    person: PersonNode,
}

export function FamilyTree({ rootPerson, allPersons, initialGenerations = 3 }: FamilyTreeProps) {
    // Générer le layout initial
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        return generateTreeLayout(rootPerson, allPersons, initialGenerations)
    }, [rootPerson, allPersons, initialGenerations])

    // Conversion explicite des types pour satisfaire React Flow si nécessaire
    // Note : mes types FamilyTreeNode/Edge devraient être compatibles mais ReactFlow est strict
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as Node[])
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as Edge[])

    const onConnect = useCallback(() => {
        // Read-only tree, pas de création de liens manuelle pour l'instant
        console.log("Connect not supported in this view")
    }, [])

    return (
        <div className="h-[calc(100vh-100px)] w-full border border-border rounded-lg overflow-hidden bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.2}
                maxZoom={4}
                defaultEdgeOptions={{
                    type: "smoothstep", // Lignes coudées plus propres pour les arbres
                    animated: false,
                    style: { stroke: "hsl(var(--muted-foreground))", strokeWidth: 2 },
                }}
                proOptions={{ hideAttribution: true }} // Pour nettoyer l'UI si on a la licence, sinon laisser false
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="hsl(var(--muted-foreground))" className="opacity-20" />
                <Controls showInteractive={false} className="bg-background border-border" />
                <MiniMap
                    nodeColor={(n) => {
                        if (n.type === 'person') return 'hsl(var(--primary))';
                        return '#eee';
                    }}
                    className="bg-background border border-border rounded-lg"
                />

                <Panel position="top-right" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtres
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Search className="h-4 w-4" />
                        Rechercher
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    )
}

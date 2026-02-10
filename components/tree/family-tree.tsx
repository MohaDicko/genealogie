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
        <div className="h-[calc(100vh-120px)] w-full border-none rounded-[2.5rem] overflow-hidden bg-background/50 shadow-premium relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={2}
                defaultEdgeOptions={{
                    type: "smoothstep",
                    animated: false,
                    style: { stroke: "oklch(var(--primary) / 0.2)", strokeWidth: 3 },
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Background
                    variant={BackgroundVariant.Lines}
                    gap={40}
                    size={1}
                    color="oklch(var(--primary) / 0.03)"
                />
                <Controls showInteractive={false} className="!bg-card/80 !backdrop-blur !border-border !rounded-2xl !overflow-hidden !shadow-glass" />
                <MiniMap
                    nodeColor={(n) => {
                        if (n.type === 'person') return 'oklch(var(--primary))';
                        return '#eee';
                    }}
                    className="!bg-card/80 !backdrop-blur !border-border !rounded-2xl !shadow-glass"
                />

                <Panel position="top-right" className="glass p-2 rounded-2xl flex gap-3 m-6">
                    <Button variant="ghost" size="sm" className="gap-2 font-bold hover:bg-primary/10">
                        <Filter className="h-4 w-4 text-primary" />
                        Générations
                    </Button>
                    <div className="w-px h-6 bg-border/50 self-center" />
                    <Button variant="ghost" size="sm" className="gap-2 font-bold hover:bg-primary/10">
                        <Search className="h-4 w-4 text-primary" />
                        Localiser
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    )
}

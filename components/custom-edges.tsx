"use client"
import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react"

export function ParentChildEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const isHighlighted = (data as { isHighlighted?: boolean })?.isHighlighted

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: isHighlighted ? 3 : 2,
        stroke: isHighlighted ? "var(--primary)" : "var(--border)",
      }}
    />
  )
}

export function SpouseEdge({ id, sourceX, sourceY, targetX, targetY, style = {} }: EdgeProps) {
  // Simple horizontal line for spouse connection
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        ...style,
        strokeWidth: 2,
        stroke: "var(--accent)",
        strokeDasharray: "5,5",
      }}
    />
  )
}

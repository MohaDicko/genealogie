"use client"

import { useMemo } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Person } from "@/lib/types"

interface DashboardChartsProps {
    persons: Person[]
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"]

export function DashboardCharts({ persons }: DashboardChartsProps) {
    // 1. Generation stats (by decade of birth)
    const decadeData = useMemo(() => {
        const counts: Record<string, number> = {}
        persons.forEach((p) => {
            if (p.birthDate) {
                const year = new Date(p.birthDate).getFullYear()
                const decade = `${Math.floor(year / 10) * 10}s`
                counts[decade] = (counts[decade] || 0) + 1
            }
        })

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [persons])

    // 2. Gender distribution
    const genderData = useMemo(() => {
        const counts: Record<string, number> = {
            Hommes: 0,
            Femmes: 0,
            Autres: 0,
        }

        persons.forEach((p) => {
            if (p.gender === "MALE") counts["Hommes"]++
            else if (p.gender === "FEMALE") counts["Femmes"]++
            else counts["Autres"]++
        })

        return Object.entries(counts)
            .filter(([_, value]) => value > 0)
            .map(([name, value]) => ({ name, value }))
    }, [persons])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Distribution par décennie */}
            <Card className="premium-card overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                    <CardTitle className="text-xl font-serif">Décennies de Naissance</CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={decadeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={12}
                                    tick={{ fill: 'oklch(var(--muted-foreground))' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={12}
                                    tick={{ fill: 'oklch(var(--muted-foreground))' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'oklch(var(--card))',
                                        borderColor: 'oklch(var(--border))',
                                        borderRadius: '16px',
                                        boxShadow: 'var(--shadow-premium)',
                                        border: 'none',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                    cursor={{ fill: 'oklch(var(--primary)/0.05)' }}
                                />
                                <Bar dataKey="value" name="Membres" radius={[8, 8, 0, 0]} barSize={40}>
                                    {decadeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Répartition par genre */}
            <Card className="premium-card overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                    <CardTitle className="text-xl font-serif">Répartition par Genre</CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {genderData.map((entry, index) => {
                                        let fillColor = "oklch(var(--chart-5))" // Default / Autres
                                        if (entry.name === "Hommes") fillColor = "oklch(var(--primary))"
                                        else if (entry.name === "Femmes") fillColor = "oklch(var(--chart-2))"

                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={fillColor}
                                                fillOpacity={0.8}
                                            />
                                        )
                                    })}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'oklch(var(--card))',
                                        borderColor: 'oklch(var(--border))',
                                        borderRadius: '16px',
                                        boxShadow: 'var(--shadow-premium)',
                                        border: 'none',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-4">
                            {genderData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: entry.name === "Femmes" ? "oklch(var(--chart-2))" : (entry.name === "Hommes" ? "oklch(var(--primary))" : "oklch(var(--chart-5))") }}
                                    />
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

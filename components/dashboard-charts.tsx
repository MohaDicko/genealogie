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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Distribution par décennie */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-serif">Membres par décennie de naissance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={decadeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={12}
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={12}
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                    cursor={{ fill: 'hsl(var(--primary)/0.05)' }}
                                />
                                <Bar dataKey="value" name="Membres" radius={[4, 4, 0, 0]}>
                                    {decadeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Répartition par genre */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-serif">Répartition par genre</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === "Femmes" ? "hsl(var(--chart-2))" : "hsl(var(--primary))"} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

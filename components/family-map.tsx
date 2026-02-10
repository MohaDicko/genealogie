"use client"

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Person } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

// Correct leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FamilyMapProps {
    persons: Person[]
}

interface LocationData {
    name: string
    lat: number
    lon: number
    count: number
    type: 'birth' | 'death' | 'mixed'
}

// Custom hook to fit map to markers
function MapBounds({ locations }: { locations: LocationData[] }) {
    const map = useMap()

    useEffect(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lon]))
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [locations, map])

    return null
}

export function FamilyMap({ persons }: FamilyMapProps) {
    const [locations, setLocations] = useState<LocationData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Extract unique places from persons
    const placesToGeocode = useMemo(() => {
        const placeMap = new Map<string, { count: number, type: Set<'birth' | 'death'> }>()

        persons.forEach(p => {
            if (p.birthPlace) {
                const place = p.birthPlace.trim()
                if (!placeMap.has(place)) placeMap.set(place, { count: 0, type: new Set() })
                placeMap.get(place)!.count++
                placeMap.get(place)!.type.add('birth')
            }
            if (p.deathPlace) {
                const place = p.deathPlace.trim()
                if (!placeMap.has(place)) placeMap.set(place, { count: 0, type: new Set() })
                placeMap.get(place)!.count++
                placeMap.get(place)!.type.add('death')
            }
        })

        return Array.from(placeMap.entries()).map(([name, data]) => ({
            name,
            count: data.count,
            type: data.type.has('birth') && data.type.has('death') ? 'mixed' as const : (data.type.has('birth') ? 'birth' as const : 'death' as const)
        }))
    }, [persons])

    useEffect(() => {
        const fetchCoordinates = async () => {
            setIsLoading(true)
            const resolvedLocations: LocationData[] = []

            // Limit to top 20 locations to avoid spamming the API
            const topPlaces = placesToGeocode
                .sort((a, b) => b.count - a.count)
                .slice(0, 20)

            for (const place of topPlaces) {
                try {
                    // Check local storage cache first
                    const cacheKey = `geo_cache_${place.name.toLowerCase()}`
                    const cached = localStorage.getItem(cacheKey)

                    if (cached) {
                        const { lat, lon } = JSON.parse(cached)
                        resolvedLocations.push({ ...place, lat, lon })
                        continue
                    }

                    // Otherwise fetch from Nominatim (OpenStreetMap)
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place.name)}&limit=1`, {
                        headers: { 'User-Agent': 'SahelGenealogie/1.0' }
                    })
                    const data = await response.json()

                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat)
                        const lon = parseFloat(data[0].lon)

                        localStorage.setItem(cacheKey, JSON.stringify({ lat, lon }))
                        resolvedLocations.push({ ...place, lat, lon })
                    }

                    // Respect API rate limits (1 request per second max recommended)
                    await new Promise(r => setTimeout(r, 1100))

                } catch (err) {
                    console.error(`Failed to geocode ${place.name}`, err)
                }
            }

            setLocations(resolvedLocations)
            setIsLoading(false)
        }

        if (placesToGeocode.length > 0) {
            fetchCoordinates()
        } else {
            setIsLoading(false)
        }
    }, [placesToGeocode])

    if (locations.length === 0 && !isLoading) return null

    return (
        <Card className="premium-card overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-xl font-serif">Géographie Familiale</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0 h-[400px] relative">
                {isLoading && (
                    <div className="absolute inset-0 z-[1000] bg-background/50 backdrop-blur flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-medium text-muted-foreground animate-pulse">Cartographie en cours...</p>
                        </div>
                    </div>
                )}
                <MapContainer center={[14.6928, -17.4467]} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locations.map((loc, idx) => (
                        <Marker key={idx} position={[loc.lat, loc.lon]}>
                            <Popup>
                                <div className="text-center">
                                    <p className="font-bold text-sm">{loc.name}</p>
                                    <p className="text-xs text-muted-foreground">{loc.count} événement{loc.count > 1 ? 's' : ''}</p>
                                    <div className="mt-1 flex justify-center gap-1">
                                        {loc.type === 'birth' && <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">Naissance</span>}
                                        {loc.type === 'death' && <span className="text-[10px] bg-gray-100 text-gray-800 px-1 rounded">Décès</span>}
                                        {loc.type === 'mixed' && <span className="text-[10px] bg-purple-100 text-purple-800 px-1 rounded">Mixte</span>}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    <MapBounds locations={locations} />
                </MapContainer>
            </CardContent>
        </Card>
    )
}

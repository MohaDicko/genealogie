import { useState, useEffect } from "react"
import { Person } from "@/lib/types"

// Custom hook piqué de usehooks-ts pour éviter d'installer toute la lib pour ça
export function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}

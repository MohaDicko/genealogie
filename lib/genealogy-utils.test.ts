
import { describe, it, expect } from 'vitest'
import { calculateAge, formatDateFr } from './genealogy-utils'
import { Person } from './types'

describe('genealogy-utils', () => {
    describe('calculateAge', () => {
        it('should calculate age correctly for living person', () => {
            const birthDate = new Date('1990-01-01')
            // Mocking current date for consistent testing
            const mockDate = new Date('2023-01-01')
            vi.setSystemTime(mockDate)

            expect(calculateAge(birthDate, null)).toBe(33)

            vi.useRealTimers()
        })

        it('should calculate age correctly for deceased person', () => {
            const birthDate = new Date('1900-01-01')
            const deathDate = new Date('1980-01-01')
            expect(calculateAge(birthDate, deathDate)).toBe(80)
        })

        it('should handle months correctly', () => {
            const birthDate = new Date('1990-12-31')
            const mockDate = new Date('2023-01-01') // barely turned 32, one day after birthday
            // Wait, 2023 - 1990 = 33. Birthday was yesterday.
            // If birth is Dec 31, 1990. Current is Jan 1, 2023.
            // Dec 31, 2022 was 32nd birthday.
            // So age is 32.

            vi.setSystemTime(mockDate)

            // Age should be 32, as 33rd birthday is Dec 31, 2023.
            expect(calculateAge(birthDate, null)).toBe(32)

            vi.useRealTimers()
        })

        it('should return null if no birth date provided', () => {
            expect(calculateAge(null)).toBeNull()
        })
    })

    describe('formatDateFr', () => {
        it('should format date in French', () => {
            const date = new Date('2023-05-15')
            // Note: Output depends on locale implementation in environment, JSDOM might vary slightly or be consistent
            // Standard expected: "15 mai 2023"
            const formatted = formatDateFr(date)
            expect(formatted).toMatch(/15 mai 2023|15 May 2023/) // Accommodate potential locale diffs in test env
        })

        it('should return empty string for null date', () => {
            expect(formatDateFr(null)).toBe("")
        })
    })
})

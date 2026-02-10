
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serializes a Person object (or any object) by converting Dates to ISO strings.
 * This is crucial for passing data from Server Components to Client Components.
 */
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

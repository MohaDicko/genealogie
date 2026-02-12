
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PersonCard } from './person-card'
import React from 'react'

// Mock components
vi.mock("@/components/ui/avatar", () => ({
    Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
    AvatarFallback: ({ children }: any) => <div>{children}</div>,
    AvatarImage: ({ src }: any) => <img src={src} alt="avatar" />
}))

vi.mock("@/components/ui/card", () => ({
    Card: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardContent: ({ children, className }: any) => <div className={className}>{children}</div>
}))

vi.mock("next/link", () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

describe('PersonCard', () => {
    const mockPerson = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'MALE',
        birthDate: new Date('19jan1990'),
        createdAt: new Date(),
        updatedAt: new Date(),
        // Add other required fields if necessary or cast as any
    } as any

    it('renders person name correctly', () => {
        render(<PersonCard person={mockPerson} />)
        expect(screen.getByText('John')).toBeInTheDocument()
        expect(screen.getByText('Doe')).toBeInTheDocument()
    })

    it('renders with link if showLink is true (default)', () => {
        const { container } = render(<PersonCard person={mockPerson} />)
        expect(container.querySelector('a')).toHaveAttribute('href', '/person/1')
    })
})


import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddMediaDialog } from './add-media-dialog'
import React from 'react'

// Mock des hooks et modules
vi.mock("next-auth/react", () => ({
    useSession: vi.fn(() => ({
        data: {
            user: { role: "ADMIN" }
        }
    }))
}))

vi.mock("@/lib/supabase", () => ({
    supabase: {
        storage: {
            from: vi.fn(() => ({
                upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
                getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://fake-url.com/file.jpg" } })
            }))
        }
    }
}))

vi.mock("@/app/actions/media", () => ({
    addMediaAction: vi.fn().mockResolvedValue({ success: true })
}))

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    }
}))

describe('AddMediaDialog', () => {
    const defaultProps = {
        personId: "person-123",
        personName: "Jean Dupont"
    }

    it('renders trigger button correctly', () => {
        render(<AddMediaDialog {...defaultProps} />)
        expect(screen.getByText(/Ajouter un document/i)).toBeInTheDocument()
    })

    it('opens dialog when trigger is clicked', async () => {
        render(<AddMediaDialog {...defaultProps} />)

        fireEvent.click(screen.getByText(/Ajouter un document/i))

        await waitFor(() => {
            expect(screen.getByText("Ajouter une photo ou un document d'archive pour Jean Dupont.")).toBeInTheDocument()
        })
    })

    // Note: Testing actual file upload logic in JSDOM/HappyDOM can be complex due to file API mocking.
    // For this basic test suite, we verify the component renders and opens correctly with the mocked auth context.
})

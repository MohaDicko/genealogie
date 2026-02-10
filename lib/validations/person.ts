import { z } from "zod"

export const personSchema = z.object({
    firstName: z.string().min(2, {
        message: "Le prénom doit avoir au moins 2 caractères.",
    }),
    lastName: z.string().min(2, {
        message: "Le nom doit avoir au moins 2 caractères.",
    }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    birthName: z.string().optional().nullable(),
    // Use coerce to handle string dates from forms and ensure they become heavy Date objects
    birthDate: z.union([z.string(), z.date()]).optional().nullable().transform((val) => {
        if (!val) return null;
        if (val === "") return null;
        const date = new Date(val);
        if (isNaN(date.getTime())) return null;
        return date;
    }),
    birthPlace: z.string().optional().nullable(),
    occupation: z.string().optional().nullable(),
    biography: z.string().optional().nullable(),
    deathDate: z.union([z.string(), z.date()]).optional().nullable().transform((val) => {
        if (!val) return null;
        if (val === "") return null;
        const date = new Date(val);
        if (isNaN(date.getTime())) return null;
        return date;
    }),
    deathPlace: z.string().optional().nullable(),
    fatherId: z.string().optional().nullable().transform(val => (val === "" || val === "none") ? null : val),
    motherId: z.string().optional().nullable().transform(val => (val === "" || val === "none") ? null : val),
    spouseId: z.string().optional().nullable().transform(val => (val === "" || val === "none") ? null : val),
})

export type PersonFormData = z.infer<typeof personSchema>

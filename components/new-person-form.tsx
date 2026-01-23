"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createPersonAction } from "@/app/actions/people"
import { toast } from "sonner"
import { Person } from "@/lib/types"

const personSchema = z.object({
    firstName: z.string().min(2, {
        message: "Le prénom doit avoir au moins 2 caractères.",
    }),
    lastName: z.string().min(2, {
        message: "Le nom doit avoir au moins 2 caractères.",
    }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    birthName: z.string().optional(),
    birthDate: z.string().optional(),
    birthPlace: z.string().optional(),
    occupation: z.string().optional(),
    biography: z.string().optional(),
    fatherId: z.string().optional(),
    motherId: z.string().optional(),
    spouseId: z.string().optional(),
})

interface NewPersonFormProps {
    existingPeople: Person[]
}

export function NewPersonForm({ existingPeople }: NewPersonFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()

    const form = useForm<z.infer<typeof personSchema>>({
        resolver: zodResolver(personSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            gender: "MALE",
            birthName: "",
            birthDate: "",
            birthPlace: "",
            occupation: "",
            biography: "",
            fatherId: "",
            motherId: "",
            spouseId: "",
        },
    })

    function onSubmit(values: z.infer<typeof personSchema>) {
        startTransition(async () => {
            const data = {
                ...values,
                birthDate: values.birthDate ? new Date(values.birthDate) : null,
                fatherId: values.fatherId || null,
                motherId: values.motherId || null,
                spouseId: values.spouseId || null,
            }

            const result = await createPersonAction(data as any)

            if (result.success) {
                toast.success("Membre ajouté avec succès")
                router.push(`/person/${result.person?.id}`)
            } else {
                toast.error(result.error || "Une erreur est survenue")
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Prénom */}
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Marie" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Nom */}
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Diallo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Genre */}
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Genre</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex gap-4"
                                    >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="MALE" />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Homme
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="FEMALE" />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Femme
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Nom de naissance */}
                    <FormField
                        control={form.control}
                        name="birthName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom de naissance (si différent)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Sow" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Optionnel, utile pour les noms de jeune fille.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date de naissance */}
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date de naissance</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Lieu de naissance */}
                    <FormField
                        control={form.control}
                        name="birthPlace"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lieu de naissance</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Dakar, Sénégal" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Profession */}
                    <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profession / Activité</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Enseignante" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Biographie */}
                <FormField
                    control={form.control}
                    name="biography"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Biographie</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Racontez l'histoire de cette personne..."
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="border-t border-border pt-8 mt-8">
                    <h3 className="text-lg font-serif font-semibold mb-4 text-primary">Relations Familiales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Père */}
                        <FormField
                            control={form.control}
                            name="fatherId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Père</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner le père" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="">Aucun</SelectItem>
                                            {existingPeople
                                                .filter((p) => p.gender === "MALE")
                                                .map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        {p.firstName} {p.lastName}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Mère */}
                        <FormField
                            control={form.control}
                            name="motherId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mère</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner la mère" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="">Aucune</SelectItem>
                                            {existingPeople
                                                .filter((p) => p.gender === "FEMALE")
                                                .map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        {p.firstName} {p.lastName}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Conjoint */}
                        <FormField
                            control={form.control}
                            name="spouseId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Conjoint(e)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner le conjoint" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="">Aucun</SelectItem>
                                            {existingPeople.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    {p.firstName} {p.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Annuler
                    </Button>
                    <Button type="submit" disabled={isPending} className="gap-2">
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Ajouter au registre
                    </Button>
                </div>
            </form>
        </Form>
    )
}

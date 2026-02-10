"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod" // keep specific z imports if needed, but schema is imported
import { personSchema } from "@/lib/validations/person"
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

interface NewPersonFormProps {
    existingPeople: Person[]
}

export function NewPersonForm({ existingPeople }: NewPersonFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()

    // Note: We use z.input for the form to handle strings from inputs, but zodResolver will validate/transform
    const form = useForm<z.input<typeof personSchema>>({
        resolver: zodResolver(personSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            gender: "MALE",
            birthName: "",
            birthDate: "", // String empty by default
            birthPlace: "",
            occupation: "",
            biography: "",
            fatherId: "",
            motherId: "",
            spouseId: "",
        },
    })

    const onSubmit = (values: any) => {
        console.log("NewPersonForm onSubmit triggered with values:", values);
        startTransition(async () => {
            try {
                const validatedValues = values as z.infer<typeof personSchema>;
                console.log("Calling createPersonAction with:", validatedValues);
                const result = await createPersonAction(validatedValues)
                console.log("createPersonAction result:", result);

                if (result.success) {
                    toast.success("Membre ajouté avec succès")
                    router.push(`/person/${result.person?.id}`)
                } else {
                    toast.error(result.error || "Une erreur est survenue")
                }
            } catch (error: any) {
                console.error("Submission error:", error);
                toast.error("Une erreur imprévue est survenue: " + error.message);
            }
        })
    }

    const onFormError = (errors: any) => {
        console.log("Form Validation Errors:", errors);
        const errorMessages = Object.entries(errors)
            .map(([key, value]: [string, any]) => `${key}: ${value.message}`)
            .join(", ");
        toast.error("Veuillez corriger les erreurs suivantes : " + errorMessages);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onFormError)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Prénom */}
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: Marie"
                                        name={field.name}
                                        onBlur={field.onBlur}
                                        onChange={field.onChange}
                                        ref={field.ref}
                                        value={field.value ?? ""}
                                    />
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
                                    <Input
                                        placeholder="Ex: Diallo"
                                        name={field.name}
                                        onBlur={field.onBlur}
                                        onChange={field.onChange}
                                        ref={field.ref}
                                        value={field.value ?? ""}
                                    />
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
                                        value={field.value ?? "MALE"}
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
                                    <Input
                                        placeholder="Ex: Sow"
                                        name={field.name}
                                        onBlur={field.onBlur}
                                        onChange={field.onChange}
                                        ref={field.ref}
                                        value={field.value ?? ""}
                                    />
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
                                    <Input
                                        type="date"
                                        name={field.name}
                                        onBlur={field.onBlur}
                                        onChange={field.onChange}
                                        ref={field.ref}
                                        value={field.value instanceof Date
                                            ? field.value.toISOString().split('T')[0]
                                            : (typeof field.value === 'string' ? field.value : "")}
                                    />
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
                                    <Input
                                        placeholder="Ex: Dakar, Sénégal"
                                        name={field.name}
                                        onBlur={field.onBlur}
                                        onChange={field.onChange}
                                        ref={field.ref}
                                        value={field.value ?? ""}
                                    />
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
                                    <Input
                                        placeholder="Ex: Enseignante"
                                        name={field.name}
                                        onBlur={field.onBlur}
                                        onChange={field.onChange}
                                        ref={field.ref}
                                        value={field.value ?? ""}
                                    />
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
                                    name={field.name}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                    ref={field.ref}
                                    value={field.value ?? ""}
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
                                    <Select onValueChange={field.onChange} value={field.value ?? "none"}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner le père" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun</SelectItem>
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
                                    <Select onValueChange={field.onChange} value={field.value ?? "none"}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner la mère" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">Aucune</SelectItem>
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
                                    <Select onValueChange={field.onChange} value={field.value ?? "none"}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner le conjoint" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun</SelectItem>
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

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="gap-2 w-full sm:w-auto"
                    >
                        <X className="h-4 w-4" />
                        Annuler
                    </Button>
                    <Button type="submit" disabled={isPending} className="gap-2 w-full sm:w-auto">
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

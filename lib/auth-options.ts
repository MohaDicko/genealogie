import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Code Familial",
            credentials: {
                code: { label: "Code d'invitation", type: "text" },
                email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
                if (!credentials?.code || !credentials?.email) {
                    return null
                }

                // 1. Vérifier si le code correspond à une famille existante
                const family = await prisma.family.findUnique({
                    where: { inviteCode: credentials.code },
                    include: { members: { include: { user: true } } }
                })

                if (!family) {
                    return null
                }

                // 2. Vérifier si l'utilisateur avec cet email est membre de cette famille
                const membership = family.members.find(
                    (m) => m.user.email?.toLowerCase() === credentials.email.toLowerCase()
                )

                if (membership && membership.user) {
                    return {
                        id: membership.user.id,
                        email: membership.user.email,
                        name: membership.user.name,
                        image: membership.user.image
                    }
                }

                // Cas spécial : si c'est le code de démo et que l'utilisateur n'existe pas, on le crée 
                // (On garde ça pour faciliter vos tests si vous voulez tester de nouveaux emails)
                if ((credentials.code === "DICKO2026" && credentials.email.toLowerCase() === "mohamed@dicko.com") || credentials.code === "DEMO123") {
                    let user = await prisma.user.findUnique({
                        where: { email: credentials.email.toLowerCase() }
                    })

                    if (!user) {
                        user = await prisma.user.create({
                            data: {
                                email: credentials.email.toLowerCase(),
                                name: "Mohamed Dicko",
                            }
                        })

                        await prisma.familyMember.create({
                            data: {
                                userId: user.id,
                                familyId: family.id,
                                role: credentials.code === "DICKO2026" ? "ADMIN" : "MEMBER"
                            }
                        })
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    }
                }

                return null
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub

                const membership = await prisma.familyMember.findFirst({
                    where: { userId: token.sub }
                })

                session.user.role = membership?.role || "VIEWER"
            }
            return session
        },
    },
}

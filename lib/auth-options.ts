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

                // Logique de vérification du code familial ici
                // Pour l'instant, on simule une réussite si le code est 'DEMO'

                // Ceci est un placeholder. La vraie logique devra vérifier
                // la table Family et créer/récupérer l'utilisateur.

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user) {
                    // Création utilisateur si n'existe pas (logique simplifiée)
                    // return await prisma.user.create({ data: { email: credentials.email } })
                    return null
                }

                return user
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            return session
        },
    },
}

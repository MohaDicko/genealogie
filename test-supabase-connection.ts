
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkStorage() {
    console.log("🛠️  Vérification de la connexion Supabase Storage...")
    console.log(`URL: ${supabaseUrl}`)

    try {
        // Tenter de lister les buckets
        const { data: buckets, error } = await supabase.storage.listBuckets()

        if (error) {
            console.error("❌ Erreur lors de la récupération des buckets :", error.message)
            return
        }

        console.log("✅ Connexion réussie !")

        const mediaBucket = buckets.find(b => b.name === 'media')

        if (mediaBucket) {
            console.log("✅ Le bucket 'media' existe.")
            console.log("⚠️  Si l'upload échoue, vérifiez les Policies RLS dans le dashboard Supabase :")
            console.log("   -> Autoriser INSERT et SELECT pour 'public' ou 'authenticated'.")
        } else {
            console.error("❌ Le bucket 'media' N'EXISTE PAS.")
            console.log("👉 Action requise : Créer un bucket nommé 'media' dans le dashboard Supabase (Storage > New Bucket).")
            console.log("   (Cochez 'Public bucket' si vous voulez que les images soient accessibles sans token signé)")
        }

    } catch (err) {
        console.error("❌ Erreur inattendue :", err)
    }
}

checkStorage()

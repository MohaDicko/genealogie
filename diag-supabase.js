
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Simple parser pour .env
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach(line => {
        const [key, ...valueParts] = line.split("=");
        if (key && valueParts.length > 0) {
            const value = valueParts.join("=").trim().replace(/^"(.*)"$/, '$1');
            process.env[key.trim()] = value;
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpload() {
    console.log("🚀 Tentative d'upload de test...");

    const testContent = "Test upload Content " + Date.now();
    const fileName = `test-diag-${Date.now()}.txt`;

    try {
        const { data, error } = await supabase.storage
            .from('media')
            .upload(fileName, testContent, {
                contentType: 'text/plain',
                upsert: true
            });

        if (error) {
            console.error("\n❌ ÉCHEC DE L'UPLOAD :");
            console.error(`   Message: ${error.message}`);
            console.error(`   Status Code: ${error.status}`);

            if (error.message.includes("Row-level security") || error.message.includes("policy") || error.status == 403) {
                console.log("\n🚩 CAUSE CONFIRMÉE : Problème de Row-Level Security (RLS).");
                console.log("👉 SOLUTION : Vous devez ajouter une policy sur le bucket 'media' dans Supabase.");
                console.log("   1. Allez dans Storage > Settings > Policies");
                console.log("   2. Pour le bucket 'media', ajoutez une policy 'Allow anonymous uploads' (INSERT).");
            }
        } else {
            console.log("\n✅ L'UPLOAD A RÉUSSI !");
            console.log("Le problème d'image dans l'app pourrait être lié au type de fichier ou à la taille.");

            // Cleanup
            await supabase.storage.from('media').remove([fileName]);
        }
    } catch (err) {
        console.error("❌ Erreur inattendue :", err);
    }
}

testUpload();

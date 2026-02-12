
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    console.log("🧹 Début du nettoyage des données de démonstration...");

    const demoPersonIds = [
        "user-1", "spouse-1", "father-1", "mother-1",
        "gf-paternal-1", "gm-paternal-1", "gf-maternal-1", "gm-maternal-1",
        "ggf-paternal-1", "ggm-paternal-1", "ggf-maternal-1", "ggm-maternal-1",
        "sibling-1", "sibling-2"
    ];

    try {
        // Supprimer d'abord les relations (pour éviter les erreurs de clé étrangère)
        // On met à null les relations parentales/conjoint pour ces IDs
        await prisma.person.updateMany({
            where: { id: { in: demoPersonIds } },
            data: {
                fatherId: null,
                motherId: null,
                spouseId: null
            }
        });

        // Supprimer les médias associés aux personnes démo
        await prisma.media.deleteMany({
            where: { personId: { in: demoPersonIds } }
        });

        // Supprimer les événements de vie associés aux personnes démo
        await prisma.lifeEvent.deleteMany({
            where: { personId: { in: demoPersonIds } }
        });

        // Enfin, supprimer les personnes elles-mêmes
        const deleted = await prisma.person.deleteMany({
            where: { id: { in: demoPersonIds } }
        });

        console.log(`✅ Nettoyage terminé. ${deleted.count} personnes de démo supprimées.`);
        console.log("Les personnes que vous avez créées manuellement ont été conservées.");

    } catch (error) {
        console.error("❌ Erreur lors du nettoyage :", error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Données d'exemple directement incluses
const sampleFamilyData: any[] = [
    {
        id: "user-1",
        firstName: "Marie",
        lastName: "Diallo",
        gender: "FEMALE",
        birthDate: "1990-03-15",
        birthPlace: "Dakar, Sénégal",
        occupation: "Enseignante",
        biography: "Marie est passionnée par l'histoire de sa famille et a entrepris de documenter l'héritage familial.",
        photoUrl: "/young-african-woman-portrait.png",
        fatherId: "father-1",
        motherId: "mother-1",
        spouseId: "spouse-1",
        marriageDate: "2015-06-20",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "spouse-1",
        firstName: "Amadou",
        lastName: "Diallo",
        gender: "MALE",
        birthDate: "1988-07-22",
        birthPlace: "Saint-Louis, Sénégal",
        occupation: "Médecin",
        photoUrl: "/young-african-man-portrait.png",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "father-1",
        firstName: "Ousmane",
        lastName: "Ndiaye",
        gender: "MALE",
        birthDate: "1960-11-08",
        birthPlace: "Thiès, Sénégal",
        occupation: "Commerçant",
        biography: "Ousmane a bâti une entreprise familiale prospère dans le commerce de textiles.",
        photoUrl: "/middle-aged-african-man-portrait.jpg",
        fatherId: "gf-paternal-1",
        motherId: "gm-paternal-1",
        spouseId: "mother-1",
        marriageDate: "1985-04-10",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "mother-1",
        firstName: "Fatou",
        lastName: "Ndiaye",
        birthName: "Sow",
        gender: "FEMALE",
        birthDate: "1965-02-28",
        birthPlace: "Kaolack, Sénégal",
        occupation: "Sage-femme",
        biography: "Fatou a aidé des centaines de femmes à accoucher au cours de sa carrière.",
        photoUrl: "/middle-aged-african-woman-portrait.jpg",
        fatherId: "gf-maternal-1",
        motherId: "gm-maternal-1",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "gf-paternal-1",
        firstName: "Ibrahima",
        lastName: "Ndiaye",
        gender: "MALE",
        birthDate: "1930-06-15",
        birthPlace: "Thiès, Sénégal",
        deathDate: "2010-12-20",
        deathPlace: "Dakar, Sénégal",
        occupation: "Agriculteur",
        biography: "Ibrahima était un homme respecté dans sa communauté, connu pour sa sagesse.",
        photoUrl: "/elderly-african-man-vintage-portrait-sepia.jpg",
        fatherId: "ggf-paternal-1",
        motherId: "ggm-paternal-1",
        spouseId: "gm-paternal-1",
        marriageDate: "1955-03-22",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "gm-paternal-1",
        firstName: "Aminata",
        lastName: "Ndiaye",
        birthName: "Ba",
        gender: "FEMALE",
        birthDate: "1935-09-03",
        birthPlace: "Rufisque, Sénégal",
        deathDate: "2018-05-14",
        occupation: "Tisserande",
        biography: "Aminata était réputée pour ses magnifiques tissages traditionnels.",
        photoUrl: "/elderly-african-woman-vintage-portrait-sepia.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "gf-maternal-1",
        firstName: "Mamadou",
        lastName: "Sow",
        gender: "MALE",
        birthDate: "1932-01-20",
        birthPlace: "Kaolack, Sénégal",
        deathDate: "2005-08-11",
        occupation: "Instituteur",
        biography: "Mamadou a consacré sa vie à l'éducation des jeunes de sa région.",
        photoUrl: "/elderly-african-man-teacher-vintage-portrait.jpg",
        fatherId: "ggf-maternal-1",
        motherId: "ggm-maternal-1",
        spouseId: "gm-maternal-1",
        marriageDate: "1958-07-08",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "gm-maternal-1",
        firstName: "Aissatou",
        lastName: "Sow",
        birthName: "Diop",
        gender: "FEMALE",
        birthDate: "1938-12-05",
        birthPlace: "Ziguinchor, Sénégal",
        occupation: "Guérisseuse traditionnelle",
        biography: "Aissatou possédait une connaissance profonde des plantes médicinales.",
        photoUrl: "/elderly-african-woman-healer-vintage-portrait.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "ggf-paternal-1",
        firstName: "Modou",
        lastName: "Ndiaye",
        gender: "MALE",
        birthDate: "1900-03-10",
        birthPlace: "Thiès, Sénégal",
        deathDate: "1975-11-25",
        occupation: "Chef de village",
        biography: "Modou était un leader respecté qui a guidé son village à travers de nombreux défis.",
        photoUrl: "/african-chief-elder-vintage-portrait-1950s.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "ggm-paternal-1",
        firstName: "Ndèye",
        lastName: "Ndiaye",
        birthName: "Fall",
        gender: "FEMALE",
        birthDate: "1905-08-18",
        birthPlace: "Louga, Sénégal",
        deathDate: "1980-04-02",
        occupation: "Matrone du village",
        photoUrl: "/african-woman-elder-vintage-portrait-1950s.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "ggf-maternal-1",
        firstName: "Cheikh",
        lastName: "Sow",
        gender: "MALE",
        birthDate: "1902-05-22",
        birthPlace: "Tambacounda, Sénégal",
        deathDate: "1968-02-14",
        occupation: "Éleveur",
        biography: "Cheikh possédait l'un des plus grands troupeaux de la région.",
        photoUrl: "/african-cattle-herder-vintage-portrait-1940s.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "ggm-maternal-1",
        firstName: "Mariama",
        lastName: "Sow",
        birthName: "Kane",
        gender: "FEMALE",
        birthDate: "1908-11-30",
        birthPlace: "Matam, Sénégal",
        deathDate: "1990-09-17",
        occupation: "Conteuse",
        biography: "Mariama était célèbre pour ses histoires qui captivaient des générations d'enfants.",
        photoUrl: "/african-storyteller-woman-elder-vintage-portrait.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "sibling-1",
        firstName: "Abdoulaye",
        lastName: "Ndiaye",
        gender: "MALE",
        birthDate: "1987-09-12",
        birthPlace: "Dakar, Sénégal",
        occupation: "Ingénieur",
        photoUrl: "/young-african-man-engineer-portrait.jpg",
        fatherId: "father-1",
        motherId: "mother-1",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "sibling-2",
        firstName: "Khady",
        lastName: "Ndiaye",
        gender: "FEMALE",
        birthDate: "1993-04-25",
        birthPlace: "Dakar, Sénégal",
        occupation: "Avocate",
        photoUrl: "/young-african-woman-lawyer-portrait.jpg",
        fatherId: "father-1",
        motherId: "mother-1",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

async function main() {
    console.log('Start seeding...')

    try {
        // Force 'any' cast to bypass outdated client type checks during rapid dev iteration
        const p = prisma as any
        await p.media.deleteMany()
        await p.lifeEvents.deleteMany()
        await p.person.deleteMany()
        await p.familyMember.deleteMany()
        await p.user.deleteMany()
        await p.family.deleteMany()
    } catch (e) {
        console.log("Database likely empty, continuing...")
    }

    // 1. Créer une famille
    const family = await prisma.family.create({
        data: {
            name: "Famille Demo",
            description: "Une famille de démonstration pour Sahel Généalogie",
            inviteCode: "DEMO123"
        }
    })

    // 2. Créer l'utilisateur démo
    const user = await prisma.user.create({
        data: {
            name: "Jean Dupond",
            email: "jean@example.com",
            memberships: {
                create: {
                    familyId: family.id,
                    role: "ADMIN"
                }
            }
        }
    })

    // 3. Importer les personnes
    console.log(`Importing ${sampleFamilyData.length} people...`)

    for (const p of sampleFamilyData) {
        // Cast prisma.person to any to allow properties like 'occupation' even if types are stale
        await (prisma.person as any).create({
            data: {
                id: p.id,
                firstName: p.firstName,
                lastName: p.lastName,
                gender: p.gender,
                birthDate: p.birthDate ? new Date(p.birthDate) : null,
                birthPlace: p.birthPlace,
                deathDate: p.deathDate ? new Date(p.deathDate) : null,
                deathPlace: p.deathPlace,
                biography: p.biography,
                photoUrl: p.photoUrl,
                occupation: p.occupation,
                createdById: user.id,
                marriageDate: p.marriageDate ? new Date(p.marriageDate) : null
            }
        })
    }

    // Etape 3b: Update des relations
    for (const p of sampleFamilyData) {
        await prisma.person.update({
            where: { id: p.id },
            data: {
                fatherId: p.fatherId || null,
                motherId: p.motherId || null,
                spouseId: p.spouseId || null,
            }
        })
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

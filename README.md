# 🌳 Sahel Généalogie - Mémoire Familiale

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-green)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38bdf8)](https://tailwindcss.com/)

**Préservez l'histoire de votre famille** - Une application web moderne pour documenter, visualiser et explorer votre arbre généalogique sur plusieurs générations.

![Sahel Généalogie](https://img.shields.io/badge/Made_with-❤️-red)

---

## ✨ Fonctionnalités

### 🏠 **Dashboard Interactif**
- 📊 Statistiques en temps réel (membres, générations, anniversaires)
- 👴 Mise en avant du doyen de la famille
- 📈 Graphiques analytiques (pyramide des âges, répartition par genre)
- 🎂 Suivi des anniversaires à venir

### 🌳 **Arbre Généalogique Visuel**
- 🎨 Visualisation interactive avec zoom et navigation fluide
- 🔗 Relations parent-enfant et conjugales
- 🎯 Mise en évidence de la lignée directe
- 🗺️ Minimap pour navigation globale
- ⚡ Génération automatique du layout

### 👥 **Gestion des Membres**
- ✏️ Création et édition de profils complets
- 📷 Galerie de photos et médias
- 📅 Événements de vie (naissance, mariage, diplôme, etc.)
- 📖 Biographies détaillées
- 🏷️ Métadonnées (profession, lieux, dates)

### 🔍 **Recherche Avancée**
- 🔎 Recherche par nom, prénom, lieu
- ⚡ Résultats instantanés
- 🎯 Filtres multiples

### 🔐 **Authentification & Collaboration**
- 🔒 NextAuth.js avec support OAuth
- 👨‍👩‍👧‍👦 Système de familles partagées
- 🎟️ Codes d'invitation uniques
- 👑 Gestion des rôles (admin, member)

---

## 🛠️ Stack Technique

### **Frontend**
- **Framework** : Next.js 16 (App Router + Server Components)
- **UI Library** : React 19.2
- **Langage** : TypeScript 5 (strict mode)
- **Styling** : TailwindCSS 4.1 + Postcss
- **Composants** : Radix UI (57 composants accessibles)
- **Visualisation** : React Flow, Recharts
- **Formulaires** : React Hook Form + Zod
- **State Management** : TanStack Query v5

### **Backend**
- **ORM** : Prisma 5.10
- **Base de données** : PostgreSQL (SQLite en dev)
- **Authentification** : NextAuth.js v4
- **Validation** : Zod 3.25

### **DevOps**
- **Déploiement** : Vercel (recommandé)
- **Analytics** : Vercel Analytics
- **Fonts** : Google Fonts (Playfair Display, Source Sans 3)

---

## 🚀 Installation

### **Prérequis**
- Node.js 18+ et npm/pnpm/yarn
- PostgreSQL (ou utiliser SQLite pour le dev)

### **1. Cloner le projet**
```bash
git clone https://github.com/votre-username/sahel-genealogie.git
cd sahel-genealogie
```

### **2. Installer les dépendances**
```bash
npm install
# ou
pnpm install
# ou
yarn install
```

### **3. Configurer les variables d'environnement**
```bash
cp .env.template .env
```

Éditez `.env` et configurez :
```env
# Base de données
DATABASE_URL="file:./dev.db"  # SQLite pour dev
# ou
DATABASE_URL="postgresql://user:password@localhost:5432/genealogie"  # PostgreSQL

# NextAuth
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (optionnel)
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
```

### **4. Initialiser la base de données**
```bash
# Générer le client Prisma
npx prisma generate

# Créer la base de données et appliquer les migrations
npx prisma db push

# (Optionnel) Remplir avec des données de démonstration
npx prisma db seed
```

### **5. Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur 🎉

---

## 📂 Structure du Projet

```
sahel_genéalogie/
├── app/                      # Next.js App Router
│   ├── actions/             # Server Actions (CRUD)
│   ├── api/                 # API Routes
│   ├── members/             # Liste des membres
│   ├── person/              # Gestion des personnes
│   │   ├── [id]/           # Détails d'une personne
│   │   └── new/            # Création
│   ├── search/             # Recherche
│   ├── tree/               # Arbre généalogique
│   ├── globals.css         # Styles globaux + thème
│   ├── layout.tsx          # Layout racine
│   └── page.tsx            # Dashboard
│
├── components/              # Composants réutilisables
│   ├── ui/                 # Composants Radix UI
│   ├── providers/          # Context providers
│   ├── tree/               # Composants arbre
│   └── ...                 # Composants métier
│
├── lib/                     # Utilitaires
│   ├── genealogy-utils.ts  # Algorithmes généalogiques
│   ├── types.ts            # Types TypeScript
│   ├── prisma.ts           # Client Prisma
│   └── auth-options.ts     # Config NextAuth
│
├── prisma/                  # Base de données
│   ├── schema.prisma       # Schéma Prisma
│   ├── seed.ts             # Données de démo
│   └── dev.db              # SQLite (dev)
│
└── public/                  # Assets statiques
```

---

## 🗄️ Modèle de Données

### **Person** (Membre de la famille)
- Informations biographiques complètes
- Relations familiales (père, mère, conjoint)
- Médias associés (photos, documents)
- Événements de vie (timeline)

### **Family** (Famille partagée)
- Nom de famille
- Code d'invitation unique
- Membres avec rôles (admin, member)

### **Media & LifeEvent**
- Photos, vidéos, documents
- Événements importants de la vie

### **NextAuth Models**
- Authentification multi-utilisateurs
- Support OAuth (Google, GitHub, etc.)

Voir le schéma complet : [`prisma/schema.prisma`](./prisma/schema.prisma)

---

## 🎨 Design System

### **Palette de couleurs**
- **Primary** : Vert sauge (oklch 0.45 0.12 145)
- **Accent** : Ton or/terre (oklch 0.75 0.12 55)
- **Background** : Beige chaleureux
- **Mode sombre** : Contraste optimisé

### **Typographie**
- **Titres** : Playfair Display (serif élégant)
- **Corps** : Source Sans 3 (lisibilité)

### **Accessibilité**
- ✅ Zones de touche 48×48px minimum
- ✅ Texte agrandi pour seniors
- ✅ Navigation au clavier
- ✅ Contraste WCAG AA+

---

## 🧪 Scripts Disponibles

```bash
# Développement
npm run dev          # Lance le serveur de dev (port 3000)

# Build & Production
npm run build        # Build de production
npm run start        # Lance le serveur de production

# Base de données
npx prisma studio    # Interface visuelle pour la DB
npx prisma db push   # Synchronise le schéma avec la DB
npx prisma db seed   # Remplit la DB avec des données de démo
npx prisma generate  # Génère le client Prisma

# Linting
npm run lint         # Vérifie le code
```

---

## 🚢 Déploiement

### **Déploiement sur Vercel (recommandé)**

1. **Pushez votre code sur GitHub**
2. **Importez le projet sur Vercel**
3. **Configurez les variables d'environnement** :
   - `DATABASE_URL` (PostgreSQL via Vercel Postgres ou Supabase)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (votre domaine Vercel)
4. **Déployez** 🚀

### **Base de données en production**

**Option 1 : Vercel Postgres**
```bash
vercel postgres create
```

**Option 2 : Supabase**
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez l'URL de connexion PostgreSQL
3. Ajoutez-la dans `DATABASE_URL`

**Option 3 : Neon, Railway, PlanetScale**

Après configuration :
```bash
# Appliquer les migrations en production
npx prisma db push
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout de fonctionnalité'`)
4. Pushez (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

---

## 📝 Roadmap

- [ ] Export PDF de l'arbre généalogique
- [ ] Partage de branches spécifiques
- [ ] Timeline historique globale
- [ ] Notifications email pour anniversaires
- [ ] Application mobile (React Native)
- [ ] Import/Export GEDCOM
- [ ] Traductions multilingues (i18n)

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Sahel Généalogie Team**

- 🌐 Website : [À venir]
- 📧 Email : contact@sahel-genealogie.com
- 💼 LinkedIn : [À venir]

---

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Le framework React
- [Prisma](https://www.prisma.io/) - ORM moderne
- [Radix UI](https://www.radix-ui.com/) - Composants accessibles
- [React Flow](https://reactflow.dev/) - Visualisation de graphes
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS utilitaire

---

<div align="center">

**Fait avec ❤️ pour préserver la mémoire familiale**

⭐ Si ce projet vous plaît, donnez-lui une étoile !

</div>

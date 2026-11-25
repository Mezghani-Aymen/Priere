# 🕌 Application « Prières » - Horaires de Prière

Application web moderne développée avec **Angular 18**, permettant de consulter en temps réel les horaires des cinq prières quotidiennes, de calculer dynamiquement la prochaine prière et le temps restant, avec recherche par ville et géolocalisation automatique.

---

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Concepts Angular Appliqués](#-concepts-angular-appliqués)
- [Architecture du Projet](#-architecture-du-projet)
- [API Utilisée](#-api-utilisée)
- [Installation & Démarrage](#-installation--démarrage)
- [Déploiement sur Netlify](#-déploiement-sur-netlify)

---

## ✨ Fonctionnalités

1. **Horaires des 5 prières quotidiennes** :
   - Fajr, Dhuhr, Asr, Maghrib et Isha avec icônes distinctes.
2. **Double affichage de la date** :
   - Date grégorienne (ex: `25 Nov 2026`).
   - Date hijri (calendrier islamique, ex: `15 Jumādá al-ākhirah 1448 AH`).
3. **Recherche par Ville** (`/search`) :
   - Champ de saisie avec bouton de recherche et validation par touche `Entrée`.
4. **Géolocalisation du navigateur** (`/location`) :
   - Récupération automatique de la position GPS via l'API Geolocation.
   - Affichage précis des coordonnées obtenues (Latitude et Longitude).
5. **Prochaine prière & Compte à rebours dynamique** :
   - Détection automatique de la prochaine prière basée sur l'heure locale.
   - Mise en évidence de la ligne correspondante avec un badge **Prochaine**.
   - Compte à rebours mis à jour chaque seconde (`⏱ 02h 15min`).
6. **Coloration dynamique RGB avec `[ngStyle]`** :
   - Variation progressive du degré de couleur selon le temps restant.
   - Lorsque le temps restant est inférieur ou égal à **15 minutes**, le degré de rouge dans `rgb(R, G, B)` s'intensifie dynamiquement et un badge d'alerte apparaît.
7. **Méthodes de calcul astronomique** :
   - Liste déroulante permettant de choisir parmi 11 conventions internationales (Ligue Islamique Mondiale, Umm Al-Qura La Mecque, Autorité Égyptienne, Université de Karachi, etc.).
8. **Routage Angular & Page 404** :
   - Navigation fluide entre la recherche par ville et la géolocalisation.
   - Page 404 personnalisée pour toutes les routes inconnues (`**`).

---

## 🎓 Concepts Angular Appliqués

- **Composants Standalone** : Architecture moderne Angular sans `NgModule`.
- **Directives de contrôle de flux** :
  - `@if` : Gestion des états de chargement, erreurs, et affichages conditionnels.
  - `@for` : Itération sur la liste des méthodes de calcul et sur les 5 prières quotidiennes.
  - `@switch` / `@case` / `@default` : Sélection dynamique des icônes de prière.
- **Directives d'attributs** :
  - `[ngClass]` : Application conditionnelle de classes CSS.
  - `[ngStyle]` : Calcul dynamique de styles en ligne (notamment la couleur `rgb()` progressive).
- **Communication entre composants** :
  - Liaison de propriétés `@Input()` pour le passage des données aux composants enfants.
- **Formulaires & Liaison bidirectionnelle** :
  - `[(ngModel)]` et `(ngModelChange)` avec `FormsModule`.
- **Services & Injection de Dépendances (Principes SOLID)** :
  - Séparation stricte des responsabilités (Service API vs Service Géolocalisation).
- **Consommation d'API REST** :
  - Utilisation de `HttpClient` et des Observables RxJS (`provideHttpClient()`).
- **Routage Angular** :
  - `RouterOutlet`, `RouterLink`, `RouterLinkActive`, redirections et route wildcard `**`.

---

## 📁 Architecture du Projet

```
src/app/
├── components/
│   ├── horaire/                  # Composant d'affichage d'une ligne de prière (@Input, @switch)
│   │   ├── horaire.component.ts
│   │   ├── horaire.component.html
│   │   └── horaire.component.css
│   └── prayer-card/              # Composant carte réutilisable (dates, liste, compte à rebours)
│       ├── prayer-card.component.ts
│       ├── prayer-card.component.html
│       └── prayer-card.component.css
├── pages/
│   ├── search/                   # Page de recherche par ville (/search)
│   │   ├── search.component.ts
│   │   ├── search.component.html
│   │   └── search.component.css
│   └── location/                 # Page de géolocalisation GPS (/location)
│       ├── location.component.ts
│       ├── location.component.html
│       └── location.component.css
├── services/
│   ├── priere.service.ts         # Service de consommation de l'API AlAdhan & calculs
│   └── location.service.ts       # Service dédié à la géolocalisation navigateur
├── types/
│   └── prayer.types.ts           # Interfaces & modèles TypeScript fortement typés
├── not-found/                    # Page 404 Not Found
│   ├── not-found.component.ts
│   ├── not-found.component.html
│   └── not-found.component.css
├── app.component.*               # Layout racine avec navigation & router-outlet
├── app.config.ts                 # Configuration des providers (Router, HttpClient)
└── app.routes.ts                 # Définition des routes de l'application
```

---

## 🌐 API Utilisée

L'application consomme l'API gratuite **[AlAdhan Prayer Times API](https://aladhan.com/prayer-times-api)** :
- **Recherche par ville** : `https://api.aladhan.com/v1/timingsByCity?city={ville}&country=&method={id}`
- **Recherche par coordonnées GPS** : `https://api.aladhan.com/v1/timings?latitude={lat}&longitude={lng}&method={id}`

---

## 🚀 Installation & Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- [Angular CLI](https://angular.dev/tools/cli) version 18+

### 1. Cloner le projet et installer les dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
```bash
ng serve
```
Rendez-vous sur `http://localhost:4200/` dans votre navigateur.

### 3. Compiler pour la production
```bash
ng build
```
Les fichiers compilés et optimisés seront générés dans le dossier `dist/priere/browser/`.

---

## ☁️ Déploiement sur Netlify

L'application est prête pour un hébergement sur **Netlify** :

- **Répertoire de publication (Publish directory)** : `dist/priere/browser`
- **Commande de build** : `npm run build` ou `ng build`
- **Redirection SPA** : Le fichier `public/_redirects` contenant `/*  /index.html  200` est automatiquement copié dans le dossier de build pour garantir le bon fonctionnement des routes Angular lors du rechargement des pages.

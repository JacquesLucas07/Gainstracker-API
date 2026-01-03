# 📖 Documentation Technique - Gainstracker API

## Architecture du projet

### Pattern MVC (Model-View-Controller)

Le projet suit une architecture MVC adaptée pour une API REST :

```
Routes → Middleware → Controllers → Services → Models → Database
```

### Structure des dossiers expliquée

#### **src/config/**
Contient toutes les configurations de l'application :
- `env.js` : Charge et exporte les variables d'environnement
- `db/database.js` : Gestionnaire de connexion SQLite avec méthodes async/await
- `db/script.sql` : Schéma de la base de données (CREATE TABLE)
- `db/request.sql` : Requêtes SQL documentées (référence)

#### **src/models/**
Définissent la structure des données et la logique métier de base :
- `User.js` : Modèle utilisateur avec validation et calcul IMC
- `Food.js` : Modèle aliment avec calcul automatique des calories
- `Meal.js` : Modèle repas/consommation avec validation

#### **src/controllers/**
Orchestrent les requêtes HTTP et gèrent la logique métier :
- `authController.js` : Authentification JWT (login, register)
- `userController.js` : CRUD utilisateurs
- `foodController.js` : CRUD aliments + recherche
- `mealController.js` : Gestion des repas et consommation
- `calculationController.js` : Calculs nutritionnels (IMC, BMR, TDEE, macros)

#### **src/routes/**
Définissent les endpoints HTTP et les lient aux contrôleurs :
- `userRoutes.js` : Routes `/api/users/*`
- `foodRoutes.js` : Routes `/api/aliments/*`
- `mealRoutes.js` : Routes `/api/consommation/*`
- `calculationRoutes.js` : Routes `/api/calculations/*`

#### **src/middleware/**
Fonctions intermédiaires exécutées entre la requête et la réponse :
- `authMiddleware.js` : Vérifie le token JWT (protège les routes)
- `errorHandler.js` : Capture et formate les erreurs

#### **src/services/**
Logique métier complexe réutilisable :
- `caculationServices.js` : Tous les calculs (IMC, BMR, TDEE, macros, calories brûlées)
- `nutritionServices.js` : Recommandations et analyses nutritionnelles

---

## Formules de calcul

### 1. IMC (Indice de Masse Corporelle)
```
IMC = poids (kg) / taille² (m)
```
- < 18.5 : Maigreur
- 18.5-25 : Normal
- 25-30 : Surpoids
- > 30 : Obésité

### 2. BMR (Basal Metabolic Rate) - Harris-Benedict révisée

**Homme :**
```
BMR = 88.362 + (13.397 × poids) + (4.799 × taille) - (5.677 × âge)
```

**Femme :**
```
BMR = 447.593 + (9.247 × poids) + (3.098 × taille) - (4.330 × âge)
```

### 3. TDEE (Total Daily Energy Expenditure)
```
TDEE = BMR × Multiplicateur d'activité
```

Multiplicateurs :
- Sédentaire : 1.2
- Léger : 1.375
- Modéré : 1.55
- Actif : 1.725
- Très actif : 1.9

### 4. Répartition des macronutriments

**Conversions caloriques :**
- 1g protéine = 4 kcal
- 1g glucide = 4 kcal
- 1g lipide = 9 kcal

**Calcul :**
```javascript
proteines_g = (calories × ratio_proteines%) / 4
glucides_g = (calories × ratio_glucides%) / 4
lipides_g = (calories × ratio_lipides%) / 9
```

### 5. Calories brûlées (MET)
```
Calories = MET × poids (kg) × durée (heures)
```

---

## Exemples d'utilisation

### Créer un utilisateur
```javascript
POST /api/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "poids": 75,
  "taille": 180,
  "objectif_calories": 2500,
  "objectif_proteines": 150,
  "objectif_glucides": 250,
  "objectif_lipides": 83
}
```

### Calculer les besoins caloriques complets
```javascript
// 1. Calculer le BMR
GET /api/calculations/bmr?poids=75&taille=180&age=25&sexe=homme
// Retourne: { bmr: 1850.72 }

// 2. Calculer le TDEE
GET /api/calculations/tdee?bmr=1850.72&niveau_activite=modere
// Retourne: { tdee: 2868.62 }

// 3. Calculer les macros
GET /api/calculations/macros?calories_cibles=2868&ratio_proteines=30&ratio_glucides=40&ratio_lipides=30
// Retourne la répartition en grammes
```

### Ajouter un repas
```javascript
POST /api/consommation
Content-Type: application/json

{
  "user_id": 1,
  "aliment_id": 1,
  "quantite": 150,
  "type_repas": "dejeuner",
  "notes": "Poulet grillé"
}
```

### Obtenir le bilan du jour
```javascript
GET /api/consommation/today?user_id=1

// Retourne:
{
  "success": true,
  "data": {
    "date": "2025-12-20",
    "repas": [...],
    "totaux": {
      "calories": 1850,
      "proteines": 120.5,
      "glucides": 180.2,
      "lipides": 65.3
    },
    "nombre_repas": 4
  }
}
```

---

## Base de données

### Schéma relationnel

```
users (1) ──┬─── (N) consommation ─── (N) aliments
            │
            └─── (N) user_activities ─── (N) activities
```

### Tables principales

**users**
- Informations personnelles
- Objectifs nutritionnels
- IMC calculé

**aliments**
- Valeurs nutritionnelles pour 100g
- Catégorisation

**consommation**
- Historique des repas
- Liaison user-aliment avec quantité

**activities** (référentiel)
- Activités physiques disponibles
- Valeurs MET

**user_activities** (historique)
- Activités pratiquées
- Calories brûlées calculées

---

## Sécurité

### Authentification JWT (à implémenter)

1. L'utilisateur s'inscrit/connecte
2. Le serveur génère un JWT signé
3. Le client envoie le token dans chaque requête : `Authorization: Bearer <token>`
4. Le middleware `authMiddleware` vérifie le token

### Bonnes pratiques

- ✅ Hasher les mots de passe avec bcrypt
- ✅ Utiliser HTTPS en production
- ✅ Valider toutes les entrées utilisateur
- ✅ Protéger contre les injections SQL (paramètres liés)
- ✅ Limiter le taux de requêtes (rate limiting)
- ✅ Ne jamais exposer le JWT_SECRET

---

## Déploiement

### Variables d'environnement requises

```env
NODE_ENV=production
PORT=8000
DB_PATH=./db/gainstracker.db
JWT_SECRET=votre_secret_ultra_securise
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://votredomaine.com
```

### Commandes de production

```bash
# Installation
npm install --production

# Initialisation de la BDD
npm run setup

# Démarrage
npm start
```

---

## Tests

### Structure des tests (à implémenter)

```
test/
├── unit/
│   ├── models/
│   ├── services/
│   └── utils/
├── integration/
│   ├── routes/
│   └── controllers/
└── e2e/
    └── api/
```

### Lancer les tests
```bash
npm test
```

---

## Contribution

### Workflow Git

1. Créer une branche : `git checkout -b feature/ma-fonctionnalite`
2. Commits clairs : `git commit -m "feat: ajout de..."`
3. Push : `git push origin feature/ma-fonctionnalite`
4. Pull Request sur GitHub

### Convention de commits

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `refactor:` Refactorisation
- `test:` Ajout de tests
- `chore:` Tâches diverses

---

## Roadmap

### Version 1.0 ✅
- [x] Structure MVC
- [x] CRUD utilisateurs
- [x] CRUD aliments
- [x] Gestion des repas
- [x] Calculs nutritionnels

### Version 1.1 🔜
- [ ] Authentification JWT complète
- [ ] Protection des routes
- [ ] Gestion des activités physiques
- [ ] Statistiques avancées

### Version 2.0 🚀
- [ ] API de nutrition externe (OpenFoodFacts)
- [ ] Upload d'images
- [ ] Recommandations IA
- [ ] Application mobile

---

## Support

Pour toute question, ouvrez une issue sur GitHub ou contactez les développeurs :
- Jacques Lucas
- Thiefan Jules

---

**Dernière mise à jour :** 20 décembre 2025

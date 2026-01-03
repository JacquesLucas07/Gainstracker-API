# 🏋️ Gainstracker API

**Application de gestion de macronutriments et suivi nutritionnel**

Proposée par 2 étudiants de l'université de l'URCA :
- Jacques Lucas
- Thiefan Jules

## 📋 Description

L'application permet de gérer et suivre les macronutriments des utilisateurs afin de les aider à atteindre leurs objectifs nutritionnels et sportifs.

## 🚀 Fonctionnalités

- ✅ Gestion des utilisateurs (CRUD complet)
- ✅ Base de données d'aliments avec valeurs nutritionnelles
- ✅ Suivi de la consommation quotidienne
- ✅ Calculs nutritionnels (IMC, BMR, TDEE, Macros)
- ✅ Historique des repas
- ✅ Recommandations personnalisées
- 🔜 Authentification JWT (à venir)
- 🔜 Suivi des activités physiques (à venir)

## 🛠️ Technologies utilisées

- **Node.js** + **Express.js** - Backend API REST
- **SQLite** - Base de données
- **JWT** - Authentification (prévu)

## 📦 Installation

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone https://github.com/JacquesLucas07/Gainstracker-API.git
cd Gainstracker-API
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```
Puis modifiez le fichier `.env` selon vos besoins.

4. **Initialiser la base de données**
```bash
# Exécutez les scripts SQL dans src/config/db/
# (script.sql pour créer les tables)
```

5. **Démarrer le serveur**
```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:8000`

## 📚 Documentation API

### Endpoints disponibles

#### **Utilisateurs** (`/api/users`)
- `POST /register` - Créer un utilisateur
- `GET /` - Lister les utilisateurs
- `GET /:user_id` - Obtenir un utilisateur
- `PUT /:user_id` - Mettre à jour un utilisateur
- `DELETE /:user_id` - Supprimer un utilisateur

#### **Aliments** (`/api/aliments`)
- `GET /` - Lister les aliments
- `GET /search?q=` - Rechercher un aliment
- `GET /:aliment_id` - Obtenir un aliment
- `POST /` - Créer un aliment
- `PUT /:aliment_id` - Mettre à jour un aliment
- `DELETE /:aliment_id` - Supprimer un aliment

#### **Consommation** (`/api/consommation`)
- `POST /` - Ajouter un repas
- `GET /today?user_id=` - Consommation du jour
- `GET /history?user_id=` - Historique
- `DELETE /:meal_id` - Supprimer un repas

#### **Calculs** (`/api/calculations`)
- `GET /imc?poids=&taille=` - Calculer l'IMC
- `GET /bmr?poids=&taille=&age=&sexe=` - Calculer le BMR
- `GET /tdee?bmr=&niveau_activite=` - Calculer le TDEE
- `GET /macros?calories_cibles=&ratio_proteines=&ratio_glucides=&ratio_lipides=` - Répartition des macros
- `GET /calories-burned?poids=&duree=&intensite=` - Calories brûlées

### Exemple de requête

```bash
# Calculer l'IMC
curl "http://localhost:8000/api/calculations/imc?poids=75&taille=1.80"

# Créer un utilisateur
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "poids": 75,
    "taille": 180,
    "objectif_calories": 2500
  }'
```

## 📁 Structure du projet

```
Gainstracker-API/
├── src/
│   ├── app.js                    # Point d'entrée de l'application
│   ├── config/
│   │   ├── env.js               # Configuration environnement
│   │   └── db/
│   │       ├── database.js      # Gestionnaire de base de données
│   │       ├── script.sql       # Schéma de la base de données
│   │       └── request.sql      # Requêtes SQL prédéfinies
│   ├── controllers/             # Logique métier
│   │   ├── userController.js
│   │   ├── foodController.js
│   │   ├── mealController.js
│   │   └── calculationController.js
│   ├── models/                  # Modèles de données
│   │   ├── User.js
│   │   ├── Food.js
│   │   └── Meal.js
│   ├── routes/                  # Définition des routes
│   │   ├── userRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── mealRoutes.js
│   │   └── calculationRoutes.js
│   ├── middleware/              # Middlewares
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   └── services/                # Services métier
│       ├── caculationServices.js
│       └── nutritionServices.js
├── package.json
├── .env.example
└── README.md
```

## 🧪 Tests

```bash
npm test
```

## 📄 Licence

L'application est **OpenSource** et soumise à la licence **Apache 2.0**.

## 👥 Contributeurs

- **Jacques Lucas** - Développeur principal
- **Thiefan Jules** - Développeur principal

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Contact

Pour toute question, contactez-nous via GitHub.

---

Développé avec ❤️ par l'équipe Gainstracker - URCA
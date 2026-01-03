# 🚀 Guide de Démarrage Rapide - Gainstracker API

## Installation en 5 minutes

### 1️⃣ Installer les dépendances
```bash
npm install
```

### 2️⃣ Configurer l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Ou sur Windows
copy .env.example .env
```

### 3️⃣ Initialiser la base de données
```bash
npm run setup
```

### 4️⃣ Démarrer le serveur
```bash
# Mode développement (rechargement automatique)
npm run dev

# OU mode production
npm start
```

### 5️⃣ Tester l'API
Ouvrez votre navigateur sur : **http://localhost:8000**

---

## 🧪 Tester les fonctionnalités

### Tests unitaires
```bash
# Tester tous les modèles et services
node test/test.js
```

### Calculateur interactif
```bash
# Lancer le calculateur en ligne de commande
node test/calculator.js
```

---

## 📡 Exemples d'utilisation de l'API

### Avec curl (terminal)

```bash
# 1. Calculer l'IMC
curl "http://localhost:8000/api/calculations/imc?poids=75&taille=1.80"

# 2. Calculer le BMR
curl "http://localhost:8000/api/calculations/bmr?poids=75&taille=180&age=25&sexe=homme"

# 3. Créer un utilisateur
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","poids":75,"taille":180}'

# 4. Lister les aliments
curl "http://localhost:8000/api/aliments"

# 5. Rechercher un aliment
curl "http://localhost:8000/api/aliments/search?q=poulet"
```

### Avec JavaScript (fetch)

```javascript
// Calculer l'IMC
fetch('http://localhost:8000/api/calculations/imc?poids=75&taille=1.80')
  .then(res => res.json())
  .then(data => console.log(data));

// Créer un utilisateur
fetch('http://localhost:8000/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    poids: 75,
    taille: 180,
    objectif_calories: 2500
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Avec Postman ou Insomnia

1. Importer la collection (à venir)
2. Sélectionner l'environnement `localhost`
3. Tester les endpoints

---

## 📁 Structure du projet

```
Gainstracker-API/
├── src/
│   ├── app.js                 # 🚀 Point d'entrée
│   ├── config/                # ⚙️ Configuration
│   ├── controllers/           # 🎮 Logique des routes
│   ├── models/                # 📊 Modèles de données
│   ├── routes/                # 🛣️ Définition des endpoints
│   ├── middleware/            # 🛡️ Middlewares (auth, errors)
│   └── services/              # 🔧 Services métier
├── test/                      # 🧪 Tests
├── db/                        # 💾 Base de données SQLite
├── package.json               # 📦 Dépendances
├── .env                       # 🔐 Variables d'environnement
└── README.md                  # 📖 Documentation
```

---

## 🎯 Endpoints principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Informations sur l'API |
| GET | `/api/calculations/imc` | Calculer l'IMC |
| GET | `/api/calculations/bmr` | Calculer le BMR |
| GET | `/api/calculations/tdee` | Calculer le TDEE |
| GET | `/api/calculations/macros` | Répartition macros |
| POST | `/api/users/register` | Créer un utilisateur |
| GET | `/api/users/:id` | Obtenir un utilisateur |
| GET | `/api/aliments` | Lister les aliments |
| GET | `/api/aliments/search` | Rechercher un aliment |
| POST | `/api/consommation` | Ajouter un repas |
| GET | `/api/consommation/today` | Bilan du jour |

**[Documentation complète →](DOCUMENTATION.md)**

---

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifiez que le port 8000 est libre
netstat -ano | findstr :8000

# Ou changez le port dans .env
PORT=3000
```

### Erreur "Cannot find module"
```bash
# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Base de données corrompue
```bash
# Supprimez et recréez la BDD
rm db/gainstracker.db
npm run setup
```

---

## 📚 Ressources

- [Documentation technique](DOCUMENTATION.md)
- [Architecture MVC](DOCUMENTATION.md#architecture-du-projet)
- [Exemples de code](test/)
- [Licence Apache 2.0](LICENSE)

---

## 👥 Contributeurs

- **Jacques Lucas** - Développeur
- **Thiefan Jules** - Développeur

**Université de Reims Champagne-Ardenne (URCA)**

---

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'feat: Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

---

## ⭐ Support

Si ce projet vous aide, n'hésitez pas à lui donner une étoile sur GitHub ! ⭐

---

**Bon développement ! 🚀**

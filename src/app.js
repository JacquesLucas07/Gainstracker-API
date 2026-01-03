const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import des routes
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const mealRoutes = require('./routes/mealRoutes');
const calculationRoutes = require('./routes/calculationRoutes');

// Import des middlewares
const errorHandler = require('./middleware/errorHandler');

// Import des informations du projet
const { projectInfo, displayProjectInfo } = require('./Info');

// Initialisation de l'application Express
const app = express();

// Configuration CORS
app.use(cors({
    origin: '*', // En production, spécifier les domaines autorisés
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route racine - Information sur l'API
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API Gainstracker',
        version: projectInfo.version,
        authors: projectInfo.authors,
        documentation: '/api/docs',
        endpoints: {
            users: '/api/users',
            foods: '/api/aliments',
            meals: '/api/consommation',
            calculations: '/api/calculations'
        },
        status: 'operational'
    });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/aliments', foodRoutes);
app.use('/api/consommation', mealRoutes);
app.use('/api/calculations', calculationRoutes);

// Middleware de gestion des erreurs (doit être en dernier)
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 8000;

if (require.main === module) {
    app.listen(PORT, () => {
        // Afficher les informations du projet au démarrage
        displayProjectInfo();
        
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                   SERVEUR DÉMARRÉ                          ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        console.log(`🚀 Serveur en écoute sur le port ${PORT}`);
        console.log(`🌐 URL locale: http://localhost:${PORT}`);
        console.log(`📚 Documentation: http://localhost:${PORT}/`);
        console.log(`\n📡 Endpoints disponibles:`);
        console.log(`   - GET  /api/users`);
        console.log(`   - GET  /api/aliments`);
        console.log(`   - GET  /api/consommation/today`);
        console.log(`   - GET  /api/calculations/imc`);
        console.log(`   - GET  /api/calculations/bmr`);
        console.log(`   - GET  /api/calculations/tdee`);
        console.log(`   - GET  /api/calculations/macros`);
        console.log('\n💡 Appuyez sur CTRL+C pour arrêter le serveur\n');
    });
}

module.exports = app;

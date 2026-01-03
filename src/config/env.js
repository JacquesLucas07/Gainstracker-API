require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Configuration de la base de données
    DB_PATH: process.env.DB_PATH || './db/gainstracker.db',
    
    // Configuration JWT (pour l'authentification future)
    JWT_SECRET: process.env.JWT_SECRET || 'votre_secret_jwt_a_changer',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    
    // Configuration CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};

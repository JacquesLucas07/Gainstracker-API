const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

/**
 * Middleware d'authentification JWT
 * Vérifie qu'un token valide est présent dans les headers
 */
const authMiddleware = (req, res, next) => {
    try {
        // Récupérer le token depuis le header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'authentification manquant'
            });
        }

        // Format: "Bearer TOKEN"
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'authentification invalide'
            });
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Ajouter les informations de l'utilisateur à la requête
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification du token'
        });
    }
};

/**
 * Middleware optionnel d'authentification
 * Permet l'accès même sans token, mais ajoute les infos utilisateur si présent
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (token) {
                const decoded = jwt.verify(token, JWT_SECRET);
                req.user = decoded;
            }
        }

        next();
    } catch (error) {
        // En cas d'erreur, continuer sans authentification
        next();
    }
};

module.exports = {
    authMiddleware,
    optionalAuth
};

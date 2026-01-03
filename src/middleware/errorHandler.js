/**
 * Middleware de gestion des erreurs
 * Capture toutes les erreurs et renvoie une réponse JSON formatée
 */
const errorHandler = (err, req, res, next) => {
    console.error('❌ Erreur:', err);

    // Erreur de validation
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // Erreur de casting (mauvais type de données)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Format de données invalide',
            error: err.message
        });
    }

    // Erreur de base de données SQLite
    if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({
            success: false,
            message: 'Violation de contrainte de base de données',
            error: err.message
        });
    }

    // Erreur personnalisée avec status
    if (err.status) {
        return res.status(err.status).json({
            success: false,
            message: err.message
        });
    }

    // Erreur par défaut (500)
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
};

module.exports = errorHandler;

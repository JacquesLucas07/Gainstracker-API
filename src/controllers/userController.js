const database = require('../config/db/database');
const User = require('../models/User');

/**
 * Contrôleur pour la gestion des utilisateurs
 */
class UserController {
    /**
     * Créer un nouveau compte utilisateur
     */
    static async register(req, res, next) {
        try {
            const userData = req.body;
            const user = new User(userData);

            // Validation des données
            const validation = user.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            // Calculer l'IMC si poids et taille fournis
            user.calculateIMC();

            // Connexion à la base de données
            await database.connect();

            // Insertion en base de données
            const result = await database.run(`
                INSERT INTO users (username, email, poids, taille, imc, 
                                 objectif_calories, objectif_proteines, 
                                 objectif_glucides, objectif_lipides)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                user.username, user.email, user.poids, user.taille, user.imc,
                user.objectif_calories, user.objectif_proteines,
                user.objectif_glucides, user.objectif_lipides
            ]);

            user.id = result.lastID;

            res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès',
                data: user.toJSON()
            });
        } catch (error) {
            if (error.message.includes('UNIQUE constraint')) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce nom d\'utilisateur ou email existe déjà'
                });
            }
            next(error);
        }
    }

    /**
     * Récupérer un utilisateur par son ID
     */
    static async getUser(req, res, next) {
        try {
            const { user_id } = req.params;

            await database.connect();
            const userData = await database.get(
                'SELECT * FROM users WHERE id = ?',
                [user_id]
            );

            if (!userData) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            const user = new User(userData);
            res.json({
                success: true,
                data: user.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mettre à jour un utilisateur
     */
    static async updateUser(req, res, next) {
        try {
            const { user_id } = req.params;
            const userData = req.body;

            await database.connect();

            // Vérifier que l'utilisateur existe
            const existingUser = await database.get(
                'SELECT id FROM users WHERE id = ?',
                [user_id]
            );

            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            const user = new User({ ...userData, id: user_id });
            
            // Validation
            const validation = user.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            // Calculer l'IMC
            user.calculateIMC();

            // Mise à jour
            await database.run(`
                UPDATE users 
                SET username = ?, email = ?, poids = ?, taille = ?, imc = ?,
                    objectif_calories = ?, objectif_proteines = ?,
                    objectif_glucides = ?, objectif_lipides = ?
                WHERE id = ?
            `, [
                user.username, user.email, user.poids, user.taille, user.imc,
                user.objectif_calories, user.objectif_proteines,
                user.objectif_glucides, user.objectif_lipides, user_id
            ]);

            res.json({
                success: true,
                message: 'Utilisateur mis à jour avec succès',
                data: user.toJSON()
            });
        } catch (error) {
            if (error.message.includes('UNIQUE constraint')) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce nom d\'utilisateur ou email existe déjà'
                });
            }
            next(error);
        }
    }

    /**
     * Supprimer un utilisateur
     */
    static async deleteUser(req, res, next) {
        try {
            const { user_id } = req.params;

            await database.connect();
            const result = await database.run(
                'DELETE FROM users WHERE id = ?',
                [user_id]
            );

            if (result.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Utilisateur supprimé avec succès'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lister tous les utilisateurs
     */
    static async listUsers(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;

            await database.connect();

            // Récupérer les utilisateurs
            const users = await database.all(`
                SELECT id, username, email, poids, taille, imc, 
                       objectif_calories, created_at
                FROM users 
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `, [limit, offset]);

            // Compter le total
            const { total } = await database.get('SELECT COUNT(*) as total FROM users');

            res.json({
                success: true,
                data: {
                    users,
                    total,
                    limit,
                    offset
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtenir l'utilisateur actuellement connecté
     */
    static async getCurrentUser(req, res, next) {
        // TODO: Implémenter avec authentification JWT
        res.json({
            success: true,
            message: 'Endpoint pour récupérer l\'utilisateur actuel',
            note: 'TODO: Authentification à implémenter'
        });
    }
}

module.exports = UserController;

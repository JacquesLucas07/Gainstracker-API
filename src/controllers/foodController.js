const database = require('../config/db/database');
const Food = require('../models/Food');

/**
 * Contrôleur pour la gestion des aliments
 */
class FoodController {
    /**
     * Lister tous les aliments
     */
    static async listFoods(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;
            const categorie = req.query.categorie;

            await database.connect();

            let query = `
                SELECT * FROM aliments 
                ${categorie ? 'WHERE categorie = ?' : ''}
                ORDER BY nom ASC
                LIMIT ? OFFSET ?
            `;

            const params = categorie 
                ? [categorie, limit, offset]
                : [limit, offset];

            const foods = await database.all(query, params);

            // Compter le total
            const countQuery = categorie 
                ? 'SELECT COUNT(*) as total FROM aliments WHERE categorie = ?'
                : 'SELECT COUNT(*) as total FROM aliments';
            const countParams = categorie ? [categorie] : [];
            const { total } = await database.get(countQuery, countParams);

            res.json({
                success: true,
                data: {
                    aliments: foods,
                    total,
                    limit,
                    offset,
                    categorie: categorie || 'toutes'
                }
            });
        } catch (error) {
            // Si la table n'existe pas encore
            if (error.message.includes('no such table')) {
                return res.json({
                    success: true,
                    data: {
                        aliments: [],
                        total: 0,
                        message: 'Table aliments non encore créée. Exécutez le script SQL d\'initialisation.'
                    }
                });
            }
            next(error);
        }
    }

    /**
     * Récupérer un aliment par son ID
     */
    static async getFood(req, res, next) {
        try {
            const { aliment_id } = req.params;

            await database.connect();
            const foodData = await database.get(
                'SELECT * FROM aliments WHERE id = ?',
                [aliment_id]
            );

            if (!foodData) {
                return res.status(404).json({
                    success: false,
                    message: 'Aliment non trouvé'
                });
            }

            const food = new Food(foodData);
            res.json({
                success: true,
                data: food.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Créer un nouvel aliment
     */
    static async createFood(req, res, next) {
        try {
            const foodData = req.body;
            const food = new Food(foodData);

            // Validation
            const validation = food.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            // Recalculer les calories au cas où
            food.calories = food.calculateCalories();

            await database.connect();

            const result = await database.run(`
                INSERT INTO aliments (nom, proteines, glucides, lipides, calories, categorie)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                food.nom, food.proteines, food.glucides, 
                food.lipides, food.calories, food.categorie
            ]);

            food.id = result.lastID;

            res.status(201).json({
                success: true,
                message: 'Aliment créé avec succès',
                data: food.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mettre à jour un aliment
     */
    static async updateFood(req, res, next) {
        try {
            const { aliment_id } = req.params;
            const foodData = req.body;

            await database.connect();

            // Vérifier que l'aliment existe
            const existingFood = await database.get(
                'SELECT id FROM aliments WHERE id = ?',
                [aliment_id]
            );

            if (!existingFood) {
                return res.status(404).json({
                    success: false,
                    message: 'Aliment non trouvé'
                });
            }

            const food = new Food({ ...foodData, id: aliment_id });

            // Validation
            const validation = food.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            // Recalculer les calories
            food.calories = food.calculateCalories();

            await database.run(`
                UPDATE aliments 
                SET nom = ?, proteines = ?, glucides = ?, lipides = ?, 
                    calories = ?, categorie = ?
                WHERE id = ?
            `, [
                food.nom, food.proteines, food.glucides, 
                food.lipides, food.calories, food.categorie, aliment_id
            ]);

            res.json({
                success: true,
                message: 'Aliment mis à jour avec succès',
                data: food.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Supprimer un aliment
     */
    static async deleteFood(req, res, next) {
        try {
            const { aliment_id } = req.params;

            await database.connect();
            const result = await database.run(
                'DELETE FROM aliments WHERE id = ?',
                [aliment_id]
            );

            if (result.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Aliment non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Aliment supprimé avec succès'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Rechercher des aliments par nom
     */
    static async searchFoods(req, res, next) {
        try {
            const { q } = req.query; // query search

            if (!q || q.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Le terme de recherche doit contenir au moins 2 caractères'
                });
            }

            await database.connect();
            const foods = await database.all(`
                SELECT * FROM aliments 
                WHERE nom LIKE ?
                ORDER BY nom ASC
                LIMIT 20
            `, [`%${q}%`]);

            res.json({
                success: true,
                data: {
                    aliments: foods,
                    query: q,
                    count: foods.length
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = FoodController;

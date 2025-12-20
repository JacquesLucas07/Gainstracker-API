const database = require('../config/db/database');
const Meal = require('../models/Meal');

/**
 * Contrôleur pour la gestion des repas (consommation)
 */
class MealController {
    /**
     * Ajouter un aliment consommé (repas)
     */
    static async addMeal(req, res, next) {
        try {
            const mealData = req.body;
            const meal = new Meal(mealData);

            // Validation
            const validation = meal.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            await database.connect();

            // Vérifier que l'aliment existe
            const food = await database.get(
                'SELECT * FROM aliments WHERE id = ?',
                [meal.aliment_id]
            );

            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: 'Aliment non trouvé'
                });
            }

            // Insertion du repas
            const result = await database.run(`
                INSERT INTO consommation (user_id, aliment_id, quantite, type_repas, notes, date)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                meal.user_id, meal.aliment_id, meal.quantite,
                meal.type_repas, meal.notes, meal.date || new Date().toISOString()
            ]);

            meal.id = result.lastID;

            // Calculer les valeurs nutritionnelles pour la quantité consommée
            const ratio = meal.quantite / 100;
            const nutritionData = {
                proteines: Math.round(food.proteines * ratio * 10) / 10,
                glucides: Math.round(food.glucides * ratio * 10) / 10,
                lipides: Math.round(food.lipides * ratio * 10) / 10,
                calories: Math.round(food.calories * ratio * 10) / 10
            };

            res.status(201).json({
                success: true,
                message: 'Consommation enregistrée avec succès',
                data: {
                    ...meal.toJSON(),
                    aliment: food.nom,
                    valeurs_nutritionnelles: nutritionData
                }
            });
        } catch (error) {
            if (error.message.includes('no such table')) {
                return res.status(500).json({
                    success: false,
                    message: 'Table consommation non créée. Exécutez le script SQL d\'initialisation.'
                });
            }
            next(error);
        }
    }

    /**
     * Récupérer la consommation du jour
     */
    static async getTodayConsumption(req, res, next) {
        try {
            const { user_id } = req.query;

            if (!user_id) {
                return res.status(400).json({
                    success: false,
                    message: 'L\'ID utilisateur est requis'
                });
            }

            const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

            await database.connect();

            const meals = await database.all(`
                SELECT c.*, a.nom as aliment_nom, 
                       a.proteines, a.glucides, a.lipides, a.calories
                FROM consommation c
                INNER JOIN aliments a ON c.aliment_id = a.id
                WHERE c.user_id = ? AND DATE(c.date) = ?
                ORDER BY c.created_at DESC
            `, [user_id, today]);

            // Calculer les totaux
            let totaux = {
                calories: 0,
                proteines: 0,
                glucides: 0,
                lipides: 0
            };

            const mealsWithNutrition = meals.map(meal => {
                const ratio = meal.quantite / 100;
                const nutrition = {
                    proteines: Math.round(meal.proteines * ratio * 10) / 10,
                    glucides: Math.round(meal.glucides * ratio * 10) / 10,
                    lipides: Math.round(meal.lipides * ratio * 10) / 10,
                    calories: Math.round(meal.calories * ratio * 10) / 10
                };

                // Ajouter aux totaux
                totaux.calories += nutrition.calories;
                totaux.proteines += nutrition.proteines;
                totaux.glucides += nutrition.glucides;
                totaux.lipides += nutrition.lipides;

                return {
                    id: meal.id,
                    aliment: meal.aliment_nom,
                    quantite: meal.quantite,
                    type_repas: meal.type_repas,
                    notes: meal.notes,
                    nutrition
                };
            });

            res.json({
                success: true,
                data: {
                    date: today,
                    repas: mealsWithNutrition,
                    totaux: {
                        calories: Math.round(totaux.calories),
                        proteines: Math.round(totaux.proteines * 10) / 10,
                        glucides: Math.round(totaux.glucides * 10) / 10,
                        lipides: Math.round(totaux.lipides * 10) / 10
                    },
                    nombre_repas: meals.length
                }
            });
        } catch (error) {
            if (error.message.includes('no such table')) {
                return res.json({
                    success: true,
                    data: {
                        date: new Date().toISOString().split('T')[0],
                        repas: [],
                        totaux: { calories: 0, proteines: 0, glucides: 0, lipides: 0 },
                        message: 'Table consommation non créée.'
                    }
                });
            }
            next(error);
        }
    }

    /**
     * Récupérer l'historique des consommations
     */
    static async getConsumptionHistory(req, res, next) {
        try {
            const { user_id, date_debut, date_fin } = req.query;

            if (!user_id) {
                return res.status(400).json({
                    success: false,
                    message: 'L\'ID utilisateur est requis'
                });
            }

            await database.connect();

            let query = `
                SELECT c.*, a.nom as aliment_nom,
                       a.proteines, a.glucides, a.lipides, a.calories
                FROM consommation c
                INNER JOIN aliments a ON c.aliment_id = a.id
                WHERE c.user_id = ?
            `;
            const params = [user_id];

            if (date_debut) {
                query += ' AND DATE(c.date) >= ?';
                params.push(date_debut);
            }

            if (date_fin) {
                query += ' AND DATE(c.date) <= ?';
                params.push(date_fin);
            }

            query += ' ORDER BY c.date DESC, c.created_at DESC';

            const meals = await database.all(query, params);

            res.json({
                success: true,
                data: {
                    historique: meals,
                    count: meals.length,
                    periode: {
                        debut: date_debut || 'début',
                        fin: date_fin || 'aujourd\'hui'
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Supprimer un repas
     */
    static async deleteMeal(req, res, next) {
        try {
            const { meal_id } = req.params;

            await database.connect();
            const result = await database.run(
                'DELETE FROM consommation WHERE id = ?',
                [meal_id]
            );

            if (result.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Repas non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Repas supprimé avec succès'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MealController;

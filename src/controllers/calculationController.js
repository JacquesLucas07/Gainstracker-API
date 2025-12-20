const CalculationService = require('../services/caculationServices');

/**
 * Contrôleur pour les calculs nutritionnels
 */
class CalculationController {
    /**
     * Calcule l'IMC
     */
    static calculateIMC(req, res, next) {
        try {
            const { poids, taille } = req.query;

            if (!poids || !taille) {
                return res.status(400).json({
                    success: false,
                    message: 'Le poids et la taille sont requis'
                });
            }

            const result = CalculationService.calculateIMC(
                parseFloat(poids),
                parseFloat(taille)
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Calcule le BMR (Métabolisme de base)
     */
    static calculateBMR(req, res, next) {
        try {
            const { poids, taille, age, sexe } = req.query;

            if (!poids || !taille || !age || !sexe) {
                return res.status(400).json({
                    success: false,
                    message: 'Le poids, la taille, l\'âge et le sexe sont requis'
                });
            }

            const result = CalculationService.calculateBMR(
                parseFloat(poids),
                parseFloat(taille),
                parseInt(age),
                sexe
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Calcule le TDEE (Dépense énergétique totale)
     */
    static calculateTDEE(req, res, next) {
        try {
            const { bmr, niveau_activite } = req.query;

            if (!bmr || !niveau_activite) {
                return res.status(400).json({
                    success: false,
                    message: 'Le BMR et le niveau d\'activité sont requis'
                });
            }

            const result = CalculationService.calculateTDEE(
                parseFloat(bmr),
                niveau_activite
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Calcule la répartition des macronutriments
     */
    static calculateMacros(req, res, next) {
        try {
            const { calories_cibles, ratio_proteines, ratio_glucides, ratio_lipides } = req.query;

            if (!calories_cibles) {
                return res.status(400).json({
                    success: false,
                    message: 'Les calories cibles sont requises'
                });
            }

            const result = CalculationService.calculateMacros(
                parseFloat(calories_cibles),
                ratio_proteines ? parseInt(ratio_proteines) : 30,
                ratio_glucides ? parseInt(ratio_glucides) : 40,
                ratio_lipides ? parseInt(ratio_lipides) : 30
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Calcule les calories brûlées
     */
    static calculateCaloriesBurned(req, res, next) {
        try {
            const { poids, duree, intensite } = req.query;

            if (!poids || !duree || !intensite) {
                return res.status(400).json({
                    success: false,
                    message: 'Le poids, la durée et l\'intensité sont requis'
                });
            }

            const result = CalculationService.calculateCaloriesBurned(
                parseFloat(poids),
                parseInt(duree),
                intensite
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CalculationController;

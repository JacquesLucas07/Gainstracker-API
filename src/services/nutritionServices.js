/**
 * Service de nutrition
 * Contient la logique métier liée aux recommandations nutritionnelles
 */

class NutritionService {
    /**
     * Calcule les besoins en protéines recommandés selon le profil
     * @param {number} poids - Poids en kg
     * @param {string} objectif - 'maintien', 'perte', 'prise_masse'
     * @param {string} activite - 'sedentaire', 'modere', 'intense'
     * @returns {Object} Recommandations en protéines
     */
    static calculateProteinNeeds(poids, objectif, activite) {
        // Besoins en protéines par kg de poids corporel
        const proteinRatios = {
            maintien: {
                sedentaire: 0.8,
                modere: 1.2,
                intense: 1.6
            },
            perte: {
                sedentaire: 1.2,
                modere: 1.6,
                intense: 2.0
            },
            prise_masse: {
                sedentaire: 1.6,
                modere: 2.0,
                intense: 2.4
            }
        };
        const objectifLower = objectif.toLowerCase();
        const activiteLower = activite.toLowerCase();
        if (!proteinRatios[objectifLower] || !proteinRatios[objectifLower][activiteLower]) {
            throw new Error('Objectif ou activité invalide');
        }
        const ratio = proteinRatios[objectifLower][activiteLower];
        const proteinesRecommandees = poids * ratio;
        return {
            proteines_recommandees_g: Math.round(proteinesRecommandees * 10) / 10,
            proteines_par_kg: ratio,
            poids,
            objectif: objectifLower,
            activite: activiteLower,
            calories_proteines: Math.round(proteinesRecommandees * 4)
        };
    }

    /**
     * Analyse nutritionnelle d'une journée
     * @param {Array} repas - Liste des repas de la journée
     * @returns {Object} Analyse complète
     */
    static analyzeDailyNutrition(repas) {
        let totaux = {
            calories: 0,
            proteines: 0,
            glucides: 0,
            lipides: 0
        };
        // Calcul des totaux
        repas.forEach(repas => {
            totaux.calories += repas.calories || 0;
            totaux.proteines += repas.proteines || 0;
            totaux.glucides += repas.glucides || 0;
            totaux.lipides += repas.lipides || 0;
        });
        // Calcul des pourcentages
        const totalGrammes = totaux.proteines + totaux.glucides + totaux.lipides;
        return {
            totaux: {
                calories: Math.round(totaux.calories),
                proteines: Math.round(totaux.proteines * 10) / 10,
                glucides: Math.round(totaux.glucides * 10) / 10,
                lipides: Math.round(totaux.lipides * 10) / 10
            },
            repartition: {
                proteines_pourcentage: Math.round((totaux.proteines / totalGrammes) * 100),
                glucides_pourcentage: Math.round((totaux.glucides / totalGrammes) * 100),
                lipides_pourcentage: Math.round((totaux.lipides / totalGrammes) * 100)
            },
            nombre_repas: repas.length
        };
    }

    /**
     * Génère des recommandations nutritionnelles personnalisées
     * @param {Object} userProfile - Profil utilisateur
     * @param {Object} currentIntake - Consommation actuelle
     * @returns {Object} Recommandations
     */
    static generateRecommendations(userProfile, currentIntake) {
        const recommendations = [];
        // Vérification des protéines
        if (currentIntake.proteines < userProfile.objectif_proteines * 0.9) {
            recommendations.push({
                type: 'warning',
                categorie: 'proteines',
                message: 'Votre apport en protéines est insuffisant',
                suggestion: 'Augmentez votre consommation de viandes maigres, poissons, œufs ou légumineuses'
            });
        }

        // Vérification des calories
        if (currentIntake.calories < userProfile.objectif_calories * 0.85) {
            recommendations.push({
                type: 'warning',
                categorie: 'calories',
                message: 'Votre apport calorique est trop faible',
                suggestion: 'Augmentez progressivement vos portions ou ajoutez une collation saine'
            });
        } else if (currentIntake.calories > userProfile.objectif_calories * 1.15) {
            recommendations.push({
                type: 'warning',
                categorie: 'calories',
                message: 'Votre apport calorique dépasse vos objectifs',
                suggestion: 'Réduisez les portions ou privilégiez des aliments moins caloriques'
            });
        }

        // Hydratation
        recommendations.push({
            type: 'info',
            categorie: 'hydratation',
            message: 'N\'oubliez pas de vous hydrater',
            suggestion: 'Visez 2 à 3 litres d\'eau par jour selon votre activité'
        });

        return {
            recommendations,
            score_global: this.calculateNutritionScore(userProfile, currentIntake)
        };
    }

    /**
     * Calcule un score nutritionnel (0-100)
     * @param {Object} userProfile - Profil utilisateur
     * @param {Object} currentIntake - Consommation actuelle
     * @returns {number} Score
     */
    static calculateNutritionScore(userProfile, currentIntake) {
        let score = 100;
        // Pénalités selon les écarts aux objectifs
        const ecartCalories = Math.abs(currentIntake.calories - userProfile.objectif_calories) / userProfile.objectif_calories;
        const ecartProteines = Math.abs(currentIntake.proteines - userProfile.objectif_proteines) / userProfile.objectif_proteines;
        score -= ecartCalories * 50;
        score -= ecartProteines * 30;
        return Math.max(0, Math.round(score));
    }
}

module.exports = NutritionService;

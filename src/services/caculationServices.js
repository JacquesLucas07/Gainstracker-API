/**
 * Service de calculs nutritionnels et physiologiques
 * Contient toutes les fonctions de calcul (IMC, BMR, TDEE, Macros)
 */

class CalculationService {
    /**
     * Calcule l'Indice de Masse Corporelle (IMC)
     * @param {number} poids - Poids en kilogrammes
     * @param {number} taille - Taille en mètres
     * @returns {Object} IMC et catégorie
     */
    static calculateIMC(poids, taille) {
        if (poids <= 0 || taille <= 0) {
            throw new Error('Le poids et la taille doivent être positifs');
        }
        const imc = poids / (taille ** 2);
        // Détermination de la catégorie
        let categorie;
        if (imc < 18.5) {
            categorie = 'Maigreur';
        } else if (imc < 25) {
            categorie = 'Normal';
        } else if (imc < 30) {
            categorie = 'Surpoids';
        } else {
            categorie = 'Obésité';
        }
        return {
            imc: Math.round(imc * 100) / 100,
            categorie,
            poids,
            taille
        };
    }

    /**
     * Calcule le Métabolisme de Base (BMR) - Formule de Harris-Benedict révisée
     * @param {number} poids - Poids en kg
     * @param {number} taille - Taille en cm
     * @param {number} age - Âge en années
     * @param {string} sexe - 'homme' ou 'femme'
     * @returns {Object} BMR en kcal/jour
     */
    static calculateBMR(poids, taille, age, sexe) {
        if (poids <= 0 || taille <= 0 || age <= 0) {
            throw new Error('Les valeurs doivent être positives');
        }
        let bmr;
        const sexeLower = sexe.toLowerCase();
        if (sexeLower === 'homme') {
            bmr = 88.362 + (13.397 * poids) + (4.799 * taille) - (5.677 * age);
        } else if (sexeLower === 'femme') {
            bmr = 447.593 + (9.247 * poids) + (3.098 * taille) - (4.330 * age);
        } else {
            throw new Error('Le sexe doit être "homme" ou "femme"');
        }
        return {
            bmr: Math.round(bmr * 100) / 100,
            description: 'Calories nécessaires au repos',
            unite: 'kcal/jour'
        };
    }

    /**
     * Calcule la Dépense Énergétique Totale Quotidienne (TDEE)
     * @param {number} bmr - Métabolisme de base
     * @param {string} niveauActivite - Niveau d'activité physique
     * @returns {Object} TDEE en kcal/jour
     */
    static calculateTDEE(bmr, niveauActivite) {
        const multiplicateurs = {
            'sedentaire': 1.2,      // Peu ou pas d'exercice
            'leger': 1.375,          // Exercice léger 1-3 jours/semaine
            'modere': 1.55,          // Exercice modéré 3-5 jours/semaine
            'actif': 1.725,          // Exercice intense 6-7 jours/semaine
            'tres_actif': 1.9        // Exercice très intense, travail physique
        };
        const niveau = niveauActivite.toLowerCase();
        if (!multiplicateurs[niveau]) {
            throw new Error(
                `Niveau d'activité invalide. Doit être: ${Object.keys(multiplicateurs).join(', ')}`
            );
        }
        const tdee = bmr * multiplicateurs[niveau];
        return {
            tdee: Math.round(tdee * 100) / 100,
            bmr,
            niveau_activite: niveau,
            multiplicateur: multiplicateurs[niveau],
            description: 'Calories totales nécessaires par jour',
            unite: 'kcal/jour'
        };
    }

    /**
     * Calcule la répartition des macronutriments
     * @param {number} caloriesCibles - Objectif calorique quotidien
     * @param {number} ratioProteines - Pourcentage de protéines (défaut: 30%)
     * @param {number} ratioGlucides - Pourcentage de glucides (défaut: 40%)
     * @param {number} ratioLipides - Pourcentage de lipides (défaut: 30%)
     * @returns {Object} Répartition des macronutriments en grammes et calories
     */
    static calculateMacros(caloriesCibles, ratioProteines = 30, ratioGlucides = 40, ratioLipides = 30) {
        // Vérification que les ratios totalisent 100%
        if (ratioProteines + ratioGlucides + ratioLipides !== 100) {
            throw new Error('Les ratios doivent totaliser 100%');
        }
        // Conversion calorique:
        // 1g protéine = 4 kcal
        // 1g glucide = 4 kcal
        // 1g lipide = 9 kcal
        const proteinesG = (caloriesCibles * ratioProteines / 100) / 4;
        const glucidesG = (caloriesCibles * ratioGlucides / 100) / 4;
        const lipidesG = (caloriesCibles * ratioLipides / 100) / 9;
        return {
            calories_cibles: caloriesCibles,
            proteines: {
                grammes: Math.round(proteinesG * 10) / 10,
                pourcentage: ratioProteines,
                calories: Math.round(proteinesG * 4 * 10) / 10
            },
            glucides: {
                grammes: Math.round(glucidesG * 10) / 10,
                pourcentage: ratioGlucides,
                calories: Math.round(glucidesG * 4 * 10) / 10
            },
            lipides: {
                grammes: Math.round(lipidesG * 10) / 10,
                pourcentage: ratioLipides,
                calories: Math.round(lipidesG * 9 * 10) / 10
            }
        };
    }

    /**
     * Calcule les calories brûlées lors d'une activité physique
     * @param {number} poids - Poids en kg
     * @param {number} duree - Durée en minutes
     * @param {string} intensite - 'faible', 'moderee', 'elevee'
     * @returns {Object} Calories brûlées
     */
    static calculateCaloriesBurned(poids, duree, intensite) {
        // MET (Metabolic Equivalent of Task) par intensité
        const metValues = {
            'faible': 3.5,
            'moderee': 6.0,
            'elevee': 9.0
        };
        const intensiteLower = intensite.toLowerCase();
        if (!metValues[intensiteLower]) {
            throw new Error('Intensité invalide. Doit être: faible, moderee, elevee');
        }
        // Formule: Calories = (MET * poids en kg * durée en heures)
        const caloriesBrulees = metValues[intensiteLower] * poids * (duree / 60);
        return {
            calories_brulees: Math.round(caloriesBrulees * 10) / 10,
            poids,
            duree,
            intensite: intensiteLower,
            met: metValues[intensiteLower]
        };
    }
}

module.exports = CalculationService;

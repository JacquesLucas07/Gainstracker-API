/**
 * Fichier Info.js
 * Informations et utilitaires pour le projet Gainstracker
 */

const packageJson = require('../package.json');

/**
 * Informations sur le projet
 */
const projectInfo = {
    name: 'Gainstracker API',
    version: packageJson.version,
    description: 'Application de gestion de macronutriments et suivi nutritionnel',
    authors: [
        'Jacques Lucas',
        'Thiefan Jules'
    ],
    university: 'URCA (Université de Reims Champagne-Ardenne)',
    license: 'Apache-2.0',
    repository: 'https://github.com/JacquesLucas07/Gainstracker-API',
    technologies: [
        'Node.js',
        'Express.js',
        'SQLite',
        'JWT'
    ]
};

/**
 * Affiche les informations du projet
 */
function displayProjectInfo() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    GAINSTRACKER API                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log(`📦 Projet     : ${projectInfo.name}`);
    console.log(`🔢 Version    : ${projectInfo.version}`);
    console.log(`📝 Description: ${projectInfo.description}`);
    console.log(`\n👥 Auteurs:`);
    projectInfo.authors.forEach(author => {
        console.log(`   - ${author}`);
    });
    console.log(`\n🎓 Université : ${projectInfo.university}`);
    console.log(`⚖️  Licence    : ${projectInfo.license}`);
    console.log(`\n🛠️  Technologies:`);
    projectInfo.technologies.forEach(tech => {
        console.log(`   - ${tech}`);
    });
    console.log('\n');
}

/**
 * Constantes de configuration
 */
const CONFIG = {
    // Types de repas valides
    MEAL_TYPES: ['petit-dejeuner', 'dejeuner', 'diner', 'collation'],
    
    // Catégories d'aliments
    FOOD_CATEGORIES: [
        'viandes',
        'poissons',
        'cereales',
        'legumes',
        'fruits',
        'produits_laitiers',
        'fruits_secs',
        'proteines',
        'autres'
    ],
    
    // Niveaux d'activité physique
    ACTIVITY_LEVELS: [
        'sedentaire',
        'leger',
        'modere',
        'actif',
        'tres_actif'
    ],
    
    // Intensités d'exercice
    EXERCISE_INTENSITIES: ['faible', 'moderee', 'elevee'],
    
    // Catégories IMC
    BMI_CATEGORIES: {
        underweight: { max: 18.5, label: 'Maigreur' },
        normal: { min: 18.5, max: 25, label: 'Normal' },
        overweight: { min: 25, max: 30, label: 'Surpoids' },
        obese: { min: 30, label: 'Obésité' }
    },
    
    // Valeurs nutritionnelles (kcal par gramme)
    CALORIE_VALUES: {
        protein: 4,
        carbs: 4,
        fat: 9
    }
};

/**
 * Fonctions utilitaires
 */
const utils = {
    /**
     * Valide un type de repas
     */
    isValidMealType(type) {
        return CONFIG.MEAL_TYPES.includes(type.toLowerCase());
    },
    
    /**
     * Valide une catégorie d'aliment
     */
    isValidFoodCategory(category) {
        return CONFIG.FOOD_CATEGORIES.includes(category.toLowerCase());
    },
    
    /**
     * Valide un niveau d'activité
     */
    isValidActivityLevel(level) {
        return CONFIG.ACTIVITY_LEVELS.includes(level.toLowerCase());
    },
    
    /**
     * Obtient la catégorie IMC
     */
    getBMICategory(bmi) {
        if (bmi < CONFIG.BMI_CATEGORIES.underweight.max) {
            return CONFIG.BMI_CATEGORIES.underweight.label;
        } else if (bmi < CONFIG.BMI_CATEGORIES.normal.max) {
            return CONFIG.BMI_CATEGORIES.normal.label;
        } else if (bmi < CONFIG.BMI_CATEGORIES.overweight.max) {
            return CONFIG.BMI_CATEGORIES.overweight.label;
        } else {
            return CONFIG.BMI_CATEGORIES.obese.label;
        }
    },
    
    /**
     * Formate une date au format YYYY-MM-DD
     */
    formatDate(date = new Date()) {
        return date.toISOString().split('T')[0];
    },
    
    /**
     * Arrondit un nombre à N décimales
     */
    round(number, decimals = 2) {
        const factor = Math.pow(10, decimals);
        return Math.round(number * factor) / factor;
    }
};

/**
 * Messages de statut HTTP
 */
const HTTP_MESSAGES = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error'
};

// Si le fichier est exécuté directement
if (require.main === module) {
    displayProjectInfo();
    
    console.log('📊 Configuration:');
    console.log(`   - Types de repas: ${CONFIG.MEAL_TYPES.join(', ')}`);
    console.log(`   - Niveaux d'activité: ${CONFIG.ACTIVITY_LEVELS.join(', ')}`);
    console.log('\n✅ Toutes les informations ont été chargées avec succès!\n');
}

module.exports = {
    projectInfo,
    CONFIG,
    utils,
    HTTP_MESSAGES,
    displayProjectInfo
};

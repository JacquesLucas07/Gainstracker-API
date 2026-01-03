/**
 * Fichier de test des fonctionnalités principales
 * Équivalent JavaScript de test/debug.py
 */

const User = require('../src/models/User');
const Food = require('../src/models/Food');
const Meal = require('../src/models/Meal');
const CalculationService = require('../src/services/caculationServices');
const NutritionService = require('../src/services/nutritionServices');
const { projectInfo, CONFIG, utils } = require('../src/Info');

console.log('🧪 Début des tests de Gainstracker API\n');

// ==================== Test 1: Modèle User ====================
console.log('📋 Test 1: Modèle User');
const testUser = new User({
    username: 'test_user',
    email: 'test@example.com',
    poids: 75,
    taille: 180
});

testUser.calculateIMC();
console.log(`   ✓ Utilisateur créé: ${testUser.username}`);
console.log(`   ✓ IMC calculé: ${testUser.imc?.toFixed(2)}`);

const validation = testUser.validate();
console.log(`   ✓ Validation: ${validation.isValid ? 'OK' : 'ERREUR'}`);
console.log('');

// ==================== Test 2: Modèle Food ====================
console.log('📋 Test 2: Modèle Food');
const testFood = new Food({
    nom: 'Poulet grillé',
    proteines: 31,
    glucides: 0,
    lipides: 3.6
});

const calories = testFood.calculateCalories();
console.log(`   ✓ Aliment créé: ${testFood.nom}`);
console.log(`   ✓ Calories calculées: ${calories.toFixed(1)} kcal`);

const nutritionFor150g = testFood.getValuesForQuantity(150);
console.log(`   ✓ Pour 150g: ${nutritionFor150g.calories} kcal`);
console.log('');

// ==================== Test 3: Modèle Meal ====================
console.log('📋 Test 3: Modèle Meal');
const testMeal = new Meal({
    user_id: 1,
    aliment_id: 1,
    quantite: 150,
    type_repas: 'dejeuner'
});

const mealValidation = testMeal.validate();
console.log(`   ✓ Repas créé: ${testMeal.quantite}g - ${testMeal.type_repas}`);
console.log(`   ✓ Validation: ${mealValidation.isValid ? 'OK' : 'ERREUR'}`);
console.log('');

// ==================== Test 4: Calculs nutritionnels ====================
console.log('📋 Test 4: Calculs nutritionnels');

// IMC
const imcResult = CalculationService.calculateIMC(75, 1.80);
console.log(`   ✓ IMC: ${imcResult.imc} - ${imcResult.categorie}`);

// BMR
const bmrResult = CalculationService.calculateBMR(75, 180, 25, 'homme');
console.log(`   ✓ BMR: ${bmrResult.bmr} kcal/jour`);

// TDEE
const tdeeResult = CalculationService.calculateTDEE(bmrResult.bmr, 'modere');
console.log(`   ✓ TDEE: ${tdeeResult.tdee} kcal/jour`);

// Macros
const macrosResult = CalculationService.calculateMacros(2500, 30, 40, 30);
console.log(`   ✓ Macros pour 2500 kcal:`);
console.log(`      - Protéines: ${macrosResult.proteines.grammes}g`);
console.log(`      - Glucides: ${macrosResult.glucides.grammes}g`);
console.log(`      - Lipides: ${macrosResult.lipides.grammes}g`);

// Calories brûlées
const caloriesBurned = CalculationService.calculateCaloriesBurned(75, 30, 'moderee');
console.log(`   ✓ Calories brûlées (30min, intensité modérée): ${caloriesBurned.calories_brulees} kcal`);
console.log('');

// ==================== Test 5: Services de nutrition ====================
console.log('📋 Test 5: Services de nutrition');

const proteinNeeds = NutritionService.calculateProteinNeeds(75, 'prise_masse', 'intense');
console.log(`   ✓ Besoins en protéines: ${proteinNeeds.proteines_recommandees_g}g/jour`);

const mockMeals = [
    { calories: 500, proteines: 30, glucides: 50, lipides: 15 },
    { calories: 600, proteines: 35, glucides: 60, lipides: 20 },
    { calories: 450, proteines: 25, glucides: 45, lipides: 18 }
];

const dailyAnalysis = NutritionService.analyzeDailyNutrition(mockMeals);
console.log(`   ✓ Analyse journalière:`);
console.log(`      - Calories totales: ${dailyAnalysis.totaux.calories} kcal`);
console.log(`      - Protéines: ${dailyAnalysis.totaux.proteines}g`);
console.log(`      - Nombre de repas: ${dailyAnalysis.nombre_repas}`);
console.log('');

// ==================== Test 6: Utilitaires ====================
console.log('📋 Test 6: Utilitaires');

console.log(`   ✓ Types de repas valides: ${CONFIG.MEAL_TYPES.join(', ')}`);
console.log(`   ✓ Test validation "dejeuner": ${utils.isValidMealType('dejeuner')}`);
console.log(`   ✓ Test validation "invalid": ${utils.isValidMealType('invalid')}`);
console.log(`   ✓ Catégorie IMC pour 23: ${utils.getBMICategory(23)}`);
console.log(`   ✓ Date formatée: ${utils.formatDate()}`);
console.log(`   ✓ Arrondi 3.14159 (2 décimales): ${utils.round(3.14159, 2)}`);
console.log('');

// ==================== Test 7: Informations projet ====================
console.log('📋 Test 7: Informations projet');
console.log(`   ✓ Nom du projet: ${projectInfo.name}`);
console.log(`   ✓ Version: ${projectInfo.version}`);
console.log(`   ✓ Auteurs: ${projectInfo.authors.join(', ')}`);
console.log('');

// ==================== Résumé ====================
console.log('═══════════════════════════════════════════════════════');
console.log('✅ Tous les tests ont été exécutés avec succès !');
console.log('═══════════════════════════════════════════════════════\n');

// Export pour utilisation dans d'autres fichiers
module.exports = {
    testUser,
    testFood,
    testMeal,
    imcResult,
    bmrResult,
    tdeeResult,
    macrosResult
};

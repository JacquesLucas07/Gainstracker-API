/**
 * Script de test en ligne de commande pour Gainstracker API
 * Équivalent de test/terminalUse.py
 */

const readline = require('readline');
const CalculationService = require('../src/services/caculationServices');
const { CONFIG, utils } = require('../src/Info');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         GAINSTRACKER - Calculateur Nutritionnel           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

/**
 * Pose une question et retourne la réponse
 */
function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

/**
 * Menu principal
 */
async function mainMenu() {
    console.log('\n📋 Que souhaitez-vous calculer ?');
    console.log('1. IMC (Indice de Masse Corporelle)');
    console.log('2. BMR (Métabolisme de Base)');
    console.log('3. TDEE (Dépense Énergétique Totale)');
    console.log('4. Répartition des macronutriments');
    console.log('5. Calories brûlées (activité physique)');
    console.log('6. Quitter\n');
    
    const choice = await question('Votre choix (1-6): ');
    
    switch (choice.trim()) {
        case '1':
            await calculateIMC();
            break;
        case '2':
            await calculateBMR();
            break;
        case '3':
            await calculateTDEE();
            break;
        case '4':
            await calculateMacros();
            break;
        case '5':
            await calculateCaloriesBurned();
            break;
        case '6':
            console.log('\n👋 Au revoir ! Bonne continuation dans vos objectifs nutritionnels.\n');
            rl.close();
            return;
        default:
            console.log('\n❌ Choix invalide. Veuillez choisir entre 1 et 6.');
    }
    
    // Retourner au menu
    await mainMenu();
}

/**
 * Calculer l'IMC
 */
async function calculateIMC() {
    console.log('\n📊 Calcul de l\'IMC\n');
    
    const poids = parseFloat(await question('Votre poids (kg): '));
    const taille = parseFloat(await question('Votre taille (m): '));
    
    try {
        const result = CalculationService.calculateIMC(poids, taille);
        
        console.log('\n✅ Résultats:');
        console.log(`   IMC: ${result.imc}`);
        console.log(`   Catégorie: ${result.categorie}`);
        
        // Conseils selon la catégorie
        if (result.categorie === 'Maigreur') {
            console.log('\n💡 Conseil: Augmentez votre apport calorique progressivement.');
        } else if (result.categorie === 'Normal') {
            console.log('\n💡 Conseil: Votre poids est dans la norme, maintenez vos habitudes !');
        } else if (result.categorie === 'Surpoids') {
            console.log('\n💡 Conseil: Un déficit calorique modéré et de l\'exercice peuvent aider.');
        } else {
            console.log('\n💡 Conseil: Consultez un professionnel de santé pour un suivi personnalisé.');
        }
    } catch (error) {
        console.log(`\n❌ Erreur: ${error.message}`);
    }
}

/**
 * Calculer le BMR
 */
async function calculateBMR() {
    console.log('\n🔥 Calcul du Métabolisme de Base (BMR)\n');
    
    const poids = parseFloat(await question('Votre poids (kg): '));
    const taille = parseFloat(await question('Votre taille (cm): '));
    const age = parseInt(await question('Votre âge (années): '));
    const sexe = await question('Votre sexe (homme/femme): ');
    
    try {
        const result = CalculationService.calculateBMR(poids, taille, age, sexe);
        
        console.log('\n✅ Résultats:');
        console.log(`   BMR: ${result.bmr} kcal/jour`);
        console.log(`   ${result.description}`);
        console.log('\n💡 Info: C\'est la quantité de calories que votre corps brûle au repos.');
    } catch (error) {
        console.log(`\n❌ Erreur: ${error.message}`);
    }
}

/**
 * Calculer le TDEE
 */
async function calculateTDEE() {
    console.log('\n⚡ Calcul de la Dépense Énergétique Totale (TDEE)\n');
    
    const bmr = parseFloat(await question('Votre BMR (kcal/jour): '));
    
    console.log('\nNiveaux d\'activité:');
    console.log('1. Sédentaire (peu ou pas d\'exercice)');
    console.log('2. Léger (exercice 1-3 jours/semaine)');
    console.log('3. Modéré (exercice 3-5 jours/semaine)');
    console.log('4. Actif (exercice 6-7 jours/semaine)');
    console.log('5. Très actif (exercice intense + travail physique)\n');
    
    const choice = await question('Votre niveau d\'activité (1-5): ');
    
    const activityMap = {
        '1': 'sedentaire',
        '2': 'leger',
        '3': 'modere',
        '4': 'actif',
        '5': 'tres_actif'
    };
    
    const niveau = activityMap[choice.trim()];
    
    if (!niveau) {
        console.log('\n❌ Choix invalide.');
        return;
    }
    
    try {
        const result = CalculationService.calculateTDEE(bmr, niveau);
        
        console.log('\n✅ Résultats:');
        console.log(`   TDEE: ${result.tdee} kcal/jour`);
        console.log(`   Multiplicateur: ${result.multiplicateur}`);
        console.log('\n💡 Info: C\'est votre dépense calorique totale quotidienne.');
        console.log('   Pour maintenir votre poids, consommez environ cette quantité de calories.');
        console.log('   Pour perdre du poids: -300 à -500 kcal');
        console.log('   Pour prendre du poids: +300 à +500 kcal');
    } catch (error) {
        console.log(`\n❌ Erreur: ${error.message}`);
    }
}

/**
 * Calculer les macros
 */
async function calculateMacros() {
    console.log('\n🍽️  Calcul de la Répartition des Macronutriments\n');
    
    const calories = parseFloat(await question('Objectif calorique quotidien (kcal): '));
    
    console.log('\nRépartitions suggérées:');
    console.log('1. Équilibrée: 30% protéines, 40% glucides, 30% lipides');
    console.log('2. Prise de masse: 25% protéines, 50% glucides, 25% lipides');
    console.log('3. Sèche: 40% protéines, 30% glucides, 30% lipides');
    console.log('4. Personnalisée\n');
    
    const choice = await question('Votre choix (1-4): ');
    
    let proteines, glucides, lipides;
    
    switch (choice.trim()) {
        case '1':
            proteines = 30; glucides = 40; lipides = 30;
            break;
        case '2':
            proteines = 25; glucides = 50; lipides = 25;
            break;
        case '3':
            proteines = 40; glucides = 30; lipides = 30;
            break;
        case '4':
            proteines = parseInt(await question('% Protéines: '));
            glucides = parseInt(await question('% Glucides: '));
            lipides = parseInt(await question('% Lipides: '));
            break;
        default:
            console.log('\n❌ Choix invalide.');
            return;
    }
    
    try {
        const result = CalculationService.calculateMacros(calories, proteines, glucides, lipides);
        
        console.log('\n✅ Résultats pour', calories, 'kcal/jour:');
        console.log(`\n   🥩 Protéines: ${result.proteines.grammes}g (${result.proteines.pourcentage}%)`);
        console.log(`      → ${result.proteines.calories} kcal`);
        console.log(`\n   🍚 Glucides: ${result.glucides.grammes}g (${result.glucides.pourcentage}%)`);
        console.log(`      → ${result.glucides.calories} kcal`);
        console.log(`\n   🥑 Lipides: ${result.lipides.grammes}g (${result.lipides.pourcentage}%)`);
        console.log(`      → ${result.lipides.calories} kcal`);
    } catch (error) {
        console.log(`\n❌ Erreur: ${error.message}`);
    }
}

/**
 * Calculer les calories brûlées
 */
async function calculateCaloriesBurned() {
    console.log('\n🏃 Calcul des Calories Brûlées\n');
    
    const poids = parseFloat(await question('Votre poids (kg): '));
    const duree = parseInt(await question('Durée de l\'activité (minutes): '));
    
    console.log('\nIntensité de l\'exercice:');
    console.log('1. Faible (marche lente, yoga)');
    console.log('2. Modérée (marche rapide, vélo léger)');
    console.log('3. Élevée (course, HIIT)\n');
    
    const choice = await question('Intensité (1-3): ');
    
    const intensityMap = {
        '1': 'faible',
        '2': 'moderee',
        '3': 'elevee'
    };
    
    const intensite = intensityMap[choice.trim()];
    
    if (!intensite) {
        console.log('\n❌ Choix invalide.');
        return;
    }
    
    try {
        const result = CalculationService.calculateCaloriesBurned(poids, duree, intensite);
        
        console.log('\n✅ Résultats:');
        console.log(`   Calories brûlées: ${result.calories_brulees} kcal`);
        console.log(`   MET: ${result.met}`);
        console.log('\n💡 Info: Ajoutez cette activité à votre suivi pour ajuster vos besoins caloriques !');
    } catch (error) {
        console.log(`\n❌ Erreur: ${error.message}`);
    }
}

// Lancer le menu principal
mainMenu();

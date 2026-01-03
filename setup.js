#!/usr/bin/env node

/**
 * Script d'installation et d'initialisation de Gainstracker API
 * Crée la base de données et initialise les tables
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db', 'gainstracker.db');
const SCRIPT_SQL_PATH = path.join(__dirname, 'src', 'config', 'db', 'script.sql');

console.log('🚀 Début de l\'installation de Gainstracker API\n');

// Créer le dossier db s'il n'existe pas
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('✅ Dossier db/ créé');
}

// Lire le script SQL
let sqlScript = '';
if (fs.existsSync(SCRIPT_SQL_PATH)) {
    sqlScript = fs.readFileSync(SCRIPT_SQL_PATH, 'utf8');
    console.log('✅ Script SQL chargé');
} else {
    console.error('❌ Fichier script.sql introuvable');
    process.exit(1);
}

// Connexion à la base de données
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Erreur de connexion à la base de données:', err.message);
        process.exit(1);
    }
    console.log('✅ Connexion à la base de données établie');
});

// Exécution du script SQL
db.exec(sqlScript, (err) => {
    if (err) {
        console.error('❌ Erreur lors de l\'exécution du script SQL:', err.message);
        db.close();
        process.exit(1);
    }

    console.log('✅ Tables créées avec succès');
    console.log('✅ Données de test insérées\n');

    // Vérification des tables créées
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            console.error('❌ Erreur lors de la vérification:', err.message);
        } else {
            console.log('📊 Tables créées:');
            tables.forEach(table => {
                console.log(`   - ${table.name}`);
            });
        }

        // Fermeture de la connexion
        db.close((err) => {
            if (err) {
                console.error('❌ Erreur de fermeture:', err.message);
            } else {
                console.log('\n🎉 Installation terminée avec succès !');
                console.log('\n📝 Prochaines étapes:');
                console.log('   1. Configurez votre fichier .env (copiez .env.example)');
                console.log('   2. Lancez le serveur avec: npm run dev');
                console.log('   3. Testez l\'API sur: http://localhost:8000\n');
            }
        });
    });
});

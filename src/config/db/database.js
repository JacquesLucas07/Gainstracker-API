const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { DB_PATH } = require('../env');

// Chemin vers la base de données
const dbPath = path.resolve(__dirname, '../../../', DB_PATH);

/**
 * Classe pour gérer la connexion à la base de données SQLite
 */
class Database {
    constructor() {
        this.db = null;
    }

    /**
     * Ouvre une connexion à la base de données
     */
    connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('❌ Erreur de connexion à la base de données:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Connecté à la base de données SQLite');
                    resolve(this.db);
                }
            });
        });
    }

    /**
     * Exécute une requête SQL
     */
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }

    /**
     * Récupère une seule ligne
     */
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**
     * Récupère plusieurs lignes
     */
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Ferme la connexion à la base de données
     */
    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('🔒 Connexion à la base de données fermée');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

// Export d'une instance singleton
const database = new Database();
module.exports = database;

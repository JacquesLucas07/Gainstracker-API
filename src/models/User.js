/**
 * Modèle User
 * Représente un utilisateur de l'application Gainstracker
 */
class User {
    constructor(data) {
        this.id = data.id || null;
        this.username = data.username;
        this.email = data.email || null;
        this.poids = data.poids || null; // en kg
        this.taille = data.taille || null; // en cm
        this.imc = data.imc || null;
        this.objectif_calories = data.objectif_calories || null;
        this.objectif_proteines = data.objectif_proteines || null;
        this.objectif_glucides = data.objectif_glucides || null;
        this.objectif_lipides = data.objectif_lipides || null;
        this.created_at = data.created_at || new Date();
    }

    /**
     * Calcule l'IMC de l'utilisateur
     */
    calculateIMC() {
        if (this.poids && this.taille) {
            const tailleEnMetres = this.taille / 100;
            this.imc = this.poids / (tailleEnMetres ** 2);
            return this.imc;
        }
        return null;
    }

    /**
     * Récupère les macros quotidiennes d'un utilisateur pour une date donnée
     * @param {Date} date - Date pour laquelle récupérer les macros
     */
    async getDailyMacros(date) {
        // TODO: Implémenter la logique pour récupérer les macros du jour
        console.log(`Récupération des macros pour ${this.username} à la date ${date}`);
        return {
            date,
            proteines: 0,
            glucides: 0,
            lipides: 0,
            calories: 0
        };
    }

    /**
     * Ajoute un repas pour l'utilisateur
     * @param {Object} mealData - Données du repas
     */
    async addMeal(mealData) {
        // TODO: Implémenter la logique pour ajouter un repas
        console.log(`Ajout d'un repas pour ${this.username}`, mealData);
        return mealData;
    }

    /**
     * Valide les données de l'utilisateur
     */
    validate() {
        const errors = [];

        if (!this.username || this.username.length < 3) {
            errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
        }

        if (this.email && !this.isValidEmail(this.email)) {
            errors.push('L\'email n\'est pas valide');
        }

        if (this.poids && this.poids <= 0) {
            errors.push('Le poids doit être positif');
        }

        if (this.taille && this.taille <= 0) {
            errors.push('La taille doit être positive');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Vérifie si un email est valide
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Convertit l'utilisateur en objet JSON (sans données sensibles)
     */
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            poids: this.poids,
            taille: this.taille,
            imc: this.imc ? Math.round(this.imc * 100) / 100 : null,
            objectif_calories: this.objectif_calories,
            objectif_proteines: this.objectif_proteines,
            objectif_glucides: this.objectif_glucides,
            objectif_lipides: this.objectif_lipides,
            created_at: this.created_at
        };
    }
}

module.exports = User;

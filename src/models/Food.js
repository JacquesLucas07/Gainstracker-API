/**
 * Modèle Food (Aliment)
 * Représente un aliment avec ses valeurs nutritionnelles
 */
class Food {
    constructor(data) {
        this.id = data.id || null;
        this.nom = data.nom;
        this.proteines = data.proteines || 0; // en grammes pour 100g
        this.glucides = data.glucides || 0; // en grammes pour 100g
        this.lipides = data.lipides || 0; // en grammes pour 100g
        this.calories = data.calories || this.calculateCalories();
        this.categorie = data.categorie || null; // ex: fruits, légumes, viandes, etc.
        this.created_at = data.created_at || new Date();
    }

    /**
     * Calcule les calories d'un aliment
     * 1g protéine = 4 kcal
     * 1g glucide = 4 kcal
     * 1g lipide = 9 kcal
     */
    calculateCalories() {
        return (this.proteines * 4) + (this.glucides * 4) + (this.lipides * 9);
    }

    /**
     * Calcule les valeurs nutritionnelles pour une quantité donnée
     * @param {number} quantite - Quantité en grammes
     */
    getValuesForQuantity(quantite) {
        const ratio = quantite / 100;
        return {
            quantite,
            proteines: Math.round(this.proteines * ratio * 10) / 10,
            glucides: Math.round(this.glucides * ratio * 10) / 10,
            lipides: Math.round(this.lipides * ratio * 10) / 10,
            calories: Math.round(this.calories * ratio * 10) / 10
        };
    }

    /**
     * Valide les données de l'aliment
     */
    validate() {
        const errors = [];

        if (!this.nom || this.nom.trim().length === 0) {
            errors.push('Le nom de l\'aliment est requis');
        }

        if (this.proteines < 0) {
            errors.push('Les protéines ne peuvent pas être négatives');
        }

        if (this.glucides < 0) {
            errors.push('Les glucides ne peuvent pas être négatifs');
        }

        if (this.lipides < 0) {
            errors.push('Les lipides ne peuvent pas être négatifs');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Convertit l'aliment en objet JSON
     */
    toJSON() {
        return {
            id: this.id,
            nom: this.nom,
            proteines: Math.round(this.proteines * 10) / 10,
            glucides: Math.round(this.glucides * 10) / 10,
            lipides: Math.round(this.lipides * 10) / 10,
            calories: Math.round(this.calories * 10) / 10,
            categorie: this.categorie,
            created_at: this.created_at
        };
    }
}

module.exports = Food;

/**
 * Modèle Meal (Repas/Consommation)
 * Représente un aliment consommé par un utilisateur
 */
class Meal {
    constructor(data) {
        this.id = data.id || null;
        this.user_id = data.user_id;
        this.aliment_id = data.aliment_id;
        this.quantite = data.quantite; // en grammes
        this.type_repas = data.type_repas; // petit-dejeuner, dejeuner, diner, collation
        this.notes = data.notes || null;
        this.date = data.date || new Date();
        this.created_at = data.created_at || new Date();
    }

    /**
     * Valide les données du repas
     */
    validate() {
        const errors = [];

        if (!this.user_id) {
            errors.push('L\'ID utilisateur est requis');
        }

        if (!this.aliment_id) {
            errors.push('L\'ID de l\'aliment est requis');
        }

        if (!this.quantite || this.quantite <= 0) {
            errors.push('La quantité doit être positive');
        }

        const typesRepasValides = ['petit-dejeuner', 'dejeuner', 'diner', 'collation'];
        if (!this.type_repas || !typesRepasValides.includes(this.type_repas)) {
            errors.push(`Le type de repas doit être: ${typesRepasValides.join(', ')}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Convertit le repas en objet JSON
     */
    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            aliment_id: this.aliment_id,
            quantite: this.quantite,
            type_repas: this.type_repas,
            notes: this.notes,
            date: this.date,
            created_at: this.created_at
        };
    }
}

module.exports = Meal;

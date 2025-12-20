-- Table utilisateurs
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    -- Informations physiques
    poids REAL, -- en kg
    taille REAL, -- en cm
    imc REAL, -- calculé automatiquement
    -- Objectifs nutritionnels
    objectif_calories REAL, -- calories cibles par jour
    objectif_proteines REAL, -- en grammes par jour
    objectif_glucides REAL, -- en grammes par jour
    objectif_lipides REAL, -- en grammes par jour
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des aliments
CREATE TABLE aliments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    -- Macronutriments (pour 100g)
    proteines REAL DEFAULT 0,
    glucides REAL DEFAULT 0,
    lipides REAL DEFAULT 0,
    fibres REAL DEFAULT 0,
    calories REAL DEFAULT 0,
    -- Micronutriments (en mg pour 100g, sauf vitamines en µg)
    vitamine_a REAL DEFAULT 0,
    vitamine_c REAL DEFAULT 0,
    vitamine_d REAL DEFAULT 0,
    vitamine_e REAL DEFAULT 0,
    calcium REAL DEFAULT 0,
    fer REAL DEFAULT 0,
    magnesium REAL DEFAULT 0,
    potassium REAL DEFAULT 0,
    sodium REAL DEFAULT 0,
    zinc REAL DEFAULT 0,
    -- Informations supplémentaires
    quantite_reference REAL DEFAULT 100, -- en grammes
    categorie TEXT, -- ex: fruits, légumes, viandes, produits laitiers, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de consommation (historique)
CREATE TABLE consommation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    aliment_id INTEGER NOT NULL,
    quantite REAL NOT NULL, -- en grammes
    date_consommation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type_repas TEXT, -- petit-dejeuner, dejeuner, diner, collation
    notes TEXT, -- notes optionnelles
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (aliment_id) REFERENCES aliments(id) ON DELETE CASCADE
);

-- Table des amitiés
CREATE TABLE friendships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, -- utilisateur qui envoie la demande
    friend_id INTEGER NOT NULL, -- utilisateur qui reçoit la demande
    status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, blocked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
    -- Éviter les doublons et auto-amitié
    UNIQUE(user_id, friend_id),
    CHECK(user_id != friend_id)
);

-- Table des repas favoris
CREATE TABLE favorite_meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    nom TEXT NOT NULL, -- nom du repas favori
    description TEXT,
    type_repas TEXT, -- petit-dejeuner, dejeuner, diner, collation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des aliments dans les repas favoris
CREATE TABLE favorite_meal_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    favorite_meal_id INTEGER NOT NULL,
    aliment_id INTEGER NOT NULL,
    quantite REAL NOT NULL, -- en grammes
    FOREIGN KEY (favorite_meal_id) REFERENCES favorite_meals(id) ON DELETE CASCADE,
    FOREIGN KEY (aliment_id) REFERENCES aliments(id) ON DELETE CASCADE
);

-- Table des activités sportives (catalogue de référence)
CREATE TABLE activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL, -- ex: Course à pied, Natation, Musculation
    calories_par_heure REAL DEFAULT 0, -- calories brûlées par heure (moyenne)
    categorie TEXT, -- cardio, musculation, sport, etc.
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des pratiques sportives (historique utilisateur)
CREATE TABLE user_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    duree INTEGER NOT NULL, -- en minutes
    calories_brulees REAL DEFAULT 0, -- calories réellement brûlées
    intensite TEXT, -- faible, moderee, elevee
    date_pratique TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);



-- Index pour optimiser les requêtes fréquentes
CREATE INDEX idx_consommation_user ON consommation(user_id);
CREATE INDEX idx_consommation_date ON consommation(date_consommation);
CREATE INDEX idx_consommation_user_date ON consommation(user_id, date_consommation);
CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);
CREATE INDEX idx_favorite_meals_user ON favorite_meals(user_id);
CREATE INDEX idx_favorite_meal_items_meal ON favorite_meal_items(favorite_meal_id);
CREATE INDEX idx_user_activities_user ON user_activities(user_id);
CREATE INDEX idx_user_activities_date ON user_activities(date_pratique);
CREATE INDEX idx_user_activities_activity ON user_activities(activity_id);
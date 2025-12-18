from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Initialisation de l'application FastAPI
app = FastAPI(
    title="Gainstracker API",
    description="API pour la gestion des macronutriments et suivi nutritionnel",
    version="1.0.0"
)

# Configuration CORS pour permettre les appels depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== MODÈLES DE DONNÉES ====================

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    poids: Optional[float] = Field(None, gt=0, description="Poids en kg")
    taille: Optional[float] = Field(None, gt=0, description="Taille en cm")
    objectif_calories: Optional[float] = Field(None, gt=0)
    objectif_proteines: Optional[float] = None
    objectif_glucides: Optional[float] = None
    objectif_lipides: Optional[float] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    poids: Optional[float]
    taille: Optional[float]
    imc: Optional[float]
    objectif_calories: Optional[float]
    created_at: datetime

class AlimentResponse(BaseModel):
    id: int
    nom: str
    proteines: float
    glucides: float
    lipides: float
    calories: float
    categorie: Optional[str]

class ConsommationCreate(BaseModel):
    aliment_id: int
    quantite: float = Field(..., gt=0, description="Quantité en grammes")
    type_repas: str = Field(..., description="petit-dejeuner, dejeuner, diner, collation")
    notes: Optional[str] = None

class ActivityCreate(BaseModel):
    activity_id: int
    duree: int = Field(..., gt=0, description="Durée en minutes")
    intensite: str = Field(..., description="faible, moderee, elevee")
    notes: Optional[str] = None

# ==================== ROUTES ====================

@app.get("/")
def root():
    """Route racine - Information sur l'API"""
    return {
        "message": "Bienvenue sur l'API Gainstracker",
        "version": "1.0.0",
        "documentation": "/docs"
    }

# ==================== CALCULATIONS ====================

@app.get("/calculations/imc")
def calculate_imc(poids: float, taille: float):
    """
    Calcule l'Indice de Masse Corporelle (IMC)
    - poids: en kilogrammes
    - taille: en mètres
    """
    if poids <= 0 or taille <= 0:
        raise HTTPException(status_code=400, detail="Le poids et la taille doivent être positifs")
    
    imc = poids / (taille ** 2)
    
    # Interprétation
    if imc < 18.5:
        categorie = "Maigreur"
    elif imc < 25:
        categorie = "Normal"
    elif imc < 30:
        categorie = "Surpoids"
    else:
        categorie = "Obésité"
    
    return {
        "imc": round(imc, 2),
        "categorie": categorie,
        "poids": poids,
        "taille": taille
    }

@app.get("/calculations/bmr")
def calculate_bmr(poids: float, taille: float, age: int, sexe: str):
    """
    Calcule le Métabolisme de Base (BMR) - Formule de Harris-Benedict révisée
    - poids: en kg
    - taille: en cm
    - age: en années
    - sexe: 'homme' ou 'femme'
    """
    if poids <= 0 or taille <= 0 or age <= 0:
        raise HTTPException(status_code=400, detail="Valeurs invalides")
    
    if sexe.lower() == "homme":
        bmr = 88.362 + (13.397 * poids) + (4.799 * taille) - (5.677 * age)
    elif sexe.lower() == "femme":
        bmr = 447.593 + (9.247 * poids) + (3.098 * taille) - (4.330 * age)
    else:
        raise HTTPException(status_code=400, detail="Sexe doit être 'homme' ou 'femme'")
    
    return {
        "bmr": round(bmr, 2),
        "description": "Calories nécessaires au repos",
        "unite": "kcal/jour"
    }

@app.get("/calculations/tdee")
def calculate_tdee(bmr: float, niveau_activite: str):
    """
    Calcule la Dépense Énergétique Totale Quotidienne (TDEE)
    - bmr: Métabolisme de base
    - niveau_activite: sedentaire, leger, modere, actif, tres_actif
    """
    multiplicateurs = {
        "sedentaire": 1.2,      # Peu ou pas d'exercice
        "leger": 1.375,          # Exercice léger 1-3 jours/semaine
        "modere": 1.55,          # Exercice modéré 3-5 jours/semaine
        "actif": 1.725,          # Exercice intense 6-7 jours/semaine
        "tres_actif": 1.9        # Exercice très intense, travail physique
    }
    
    if niveau_activite not in multiplicateurs:
        raise HTTPException(
            status_code=400,
            detail=f"Niveau d'activité doit être: {', '.join(multiplicateurs.keys())}"
        )
    
    tdee = bmr * multiplicateurs[niveau_activite]
    
    return {
        "tdee": round(tdee, 2),
        "bmr": bmr,
        "niveau_activite": niveau_activite,
        "multiplicateur": multiplicateurs[niveau_activite],
        "description": "Calories totales nécessaires par jour",
        "unite": "kcal/jour"
    }

@app.get("/calculations/macros")
def calculate_macros(calories_cibles: float, ratio_proteines: int = 30, 
                     ratio_glucides: int = 40, ratio_lipides: int = 30):
    """
    Calcule la répartition des macronutriments
    - calories_cibles: objectif calorique quotidien
    - ratio_proteines, ratio_glucides, ratio_lipides: pourcentages (total doit = 100)
    """
    if ratio_proteines + ratio_glucides + ratio_lipides != 100:
        raise HTTPException(status_code=400, detail="Les ratios doivent totaliser 100%")
    
    # 1g protéine = 4 kcal, 1g glucide = 4 kcal, 1g lipide = 9 kcal
    proteines_g = (calories_cibles * ratio_proteines / 100) / 4
    glucides_g = (calories_cibles * ratio_glucides / 100) / 4
    lipides_g = (calories_cibles * ratio_lipides / 100) / 9
    
    return {
        "calories_cibles": calories_cibles,
        "proteines": {
            "grammes": round(proteines_g, 1),
            "pourcentage": ratio_proteines,
            "calories": round(proteines_g * 4, 1)
        },
        "glucides": {
            "grammes": round(glucides_g, 1),
            "pourcentage": ratio_glucides,
            "calories": round(glucides_g * 4, 1)
        },
        "lipides": {
            "grammes": round(lipides_g, 1),
            "pourcentage": ratio_lipides,
            "calories": round(lipides_g * 9, 1)
        }
    }

# ==================== USERS ====================

@app.post("/users/register", response_model=dict)
def register_user(user: UserCreate):
    """Créer un nouveau compte utilisateur"""
    # TODO: Implémenter la logique de création en base de données
    return {
        "message": "Utilisateur créé avec succès",
        "username": user.username,
        "note": "TODO: Connexion à la base de données à implémenter"
    }

@app.get("/users/me")
def get_current_user():
    """Récupérer les informations de l'utilisateur connecté"""
    # TODO: Implémenter authentification et récupération depuis BDD
    return {
        "message": "Endpoint pour récupérer l'utilisateur actuel",
        "note": "TODO: Authentification à implémenter"
    }

# ==================== ALIMENTS ====================

@app.get("/aliments")
def list_aliments(limit: int = 50, offset: int = 0):
    """Lister tous les aliments disponibles"""
    # TODO: Récupérer depuis la base de données
    return {
        "message": "Liste des aliments",
        "limit": limit,
        "offset": offset,
        "note": "TODO: Connexion BDD à implémenter"
    }

@app.get("/aliments/{aliment_id}")
def get_aliment(aliment_id: int):
    """Récupérer les détails d'un aliment spécifique"""
    # TODO: Récupérer depuis la base de données
    return {
        "message": f"Détails de l'aliment {aliment_id}",
        "note": "TODO: Connexion BDD à implémenter"
    }

# ==================== CONSOMMATION ====================

@app.post("/consommation")
def add_consommation(consommation: ConsommationCreate):
    """Ajouter un aliment consommé"""
    # TODO: Enregistrer en base de données
    return {
        "message": "Consommation enregistrée",
        "aliment_id": consommation.aliment_id,
        "quantite": consommation.quantite,
        "note": "TODO: Connexion BDD à implémenter"
    }

@app.get("/consommation/today")
def get_today_consumption():
    """Récupérer la consommation du jour"""
    # TODO: Récupérer depuis la base de données
    return {
        "message": "Consommation du jour",
        "date": datetime.now().date(),
        "note": "TODO: Connexion BDD à implémenter"
    }

# ==================== ACTIVITIES ====================

@app.get("/activities")
def list_activities():
    """Lister toutes les activités sportives disponibles"""
    # TODO: Récupérer depuis la base de données
    return {
        "message": "Liste des activités",
        "note": "TODO: Connexion BDD à implémenter"
    }

@app.post("/activities/user")
def add_user_activity(activity: ActivityCreate):
    """Enregistrer une activité pratiquée par l'utilisateur"""
    # TODO: Enregistrer en base de données
    return {
        "message": "Activité enregistrée",
        "activity_id": activity.activity_id,
        "duree": activity.duree,
        "note": "TODO: Connexion BDD à implémenter"
    }

# Point d'entrée pour lancer l'application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

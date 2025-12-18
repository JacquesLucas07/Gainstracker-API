import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent)) # Ajouter le dossier parent au chemin de recherche Python
from lib.prog import UserCreate, UserResponse, AlimentResponse, ConsommationCreate, ActivityCreate
from datetime import datetime

print("="*50)
print("EXEMPLES D'UTILISATION DES MODÈLES PYDANTIC")
print("="*50)

# ==================== 1. UserCreate ====================
print("\n1. Création d'un utilisateur :")
new_user = UserCreate(
    username="john_doe",
    email="john@example.com",
    poids=75.5,
    taille=180,
    objectif_calories=2500,
    objectif_proteines=150,
    objectif_glucides=300,
    objectif_lipides=80
)
print(f"   Utilisateur : {new_user.username}")
print(f"   Email : {new_user.email}")
print(f"   Poids : {new_user.poids} kg")
print(f"   Objectif calories : {new_user.objectif_calories} kcal")

# Conversion en dictionnaire (utile pour l'API)
print(f"\n   En JSON : {new_user.model_dump()}")

# ==================== 2. UserResponse ====================
print("\n2. Réponse utilisateur (simulé) :")
user_response = UserResponse(
    id=1,
    username="john_doe",
    email="john@example.com",
    poids=75.5,
    taille=180,
    imc=23.3,
    objectif_calories=2500,
    created_at=datetime.now()
)
print(f"   ID : {user_response.id}")
print(f"   IMC : {user_response.imc}")
print(f"   Créé le : {user_response.created_at}")

# ==================== 3. AlimentResponse ====================
print("\n3. Informations sur un aliment :")
poulet = AlimentResponse(
    id=10,
    nom="Poulet grillé",
    proteines=31.0,
    glucides=0.0,
    lipides=3.6,
    calories=165,
    categorie="Viandes"
)
print(f"   Aliment : {poulet.nom}")
print(f"   Protéines : {poulet.proteines}g")
print(f"   Calories : {poulet.calories} kcal")

# ==================== 4. ConsommationCreate ====================
print("\n4. Enregistrement d'un repas :")
repas = ConsommationCreate(
    aliment_id=10,
    quantite=200.0,  # 200 grammes
    type_repas="dejeuner",
    notes="Poulet avec salade verte"
)
print(f"   Aliment ID : {repas.aliment_id}")
print(f"   Quantité : {repas.quantite}g")
print(f"   Type de repas : {repas.type_repas}")
print(f"   Notes : {repas.notes}")

# ==================== 5. ActivityCreate ====================
print("\n5. Enregistrement d'une activité :")
activity = ActivityCreate(
    activity_id=5,
    duree=45,  # 45 minutes
    intensite="moderee",
    notes="Course à pied matinale"
)
print(f"   Activité ID : {activity.activity_id}")
print(f"   Durée : {activity.duree} minutes")
print(f"   Intensité : {activity.intensite}")

# ==================== 6. Validation automatique ====================
print("\n6. Test de validation (erreurs) :")
try:
    # Tentative avec email invalide
    bad_user = UserCreate(
        username="ab",  # Trop court (min 3 caractères)
        email="pas_un_email",
        poids=-10  # Négatif !
    )
except Exception as e:
    print(f"   ❌ Erreur détectée : {type(e).__name__}")
    print(f"   Message : {str(e)[:100]}...")

print("\n" + "="*50)
print("✅ Les modèles Pydantic valident automatiquement")
print("   les données et génèrent des erreurs claires !")
print("="*50)
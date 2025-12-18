class User: #TODO : compléter la classe User
    def __init__(self, user_id, username, email=None):
        self.id = user_id
        self.username = username
        self.email = email
    
    def get_daily_macros(self, date):
        # Logique pour récupérer les macros du jour
        pass
    
    def add_meal(self, meal_data):
        # Logique pour ajouter un repas
        pass
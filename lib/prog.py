def imc(weight, height):
    """
    Calculate the Body Mass Index (BMI).
    :param weight: Weight in kilograms
    :param height: Height in centimeters
    :return: BMI value
    """
    height_in_meters = height / 100
    bmi = weight / (height_in_meters ** 2)
    return round(bmi, 2)


def bmr(weight, height, age, gender):
    """
    Calculate the Basal Metabolic Rate (BMR).
    :param weight: Weight in kilograms
    :param height: Height in centimeters
    :param age: Age in years
    :param gender: 'male' or 'female'
    :return: BMR value
    """
    if gender.lower() == 'male':            
        bmr_value = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    elif gender.lower() == 'female':
        bmr_value = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    else:
        raise ValueError("Gender must be 'male' or 'female'")
    return round(bmr_value, 2)


def tdee(bmr_value, activity_level):
    """
    Calculate the Total Daily Energy Expenditure (TDEE).
    :param bmr_value: Basal Metabolic Rate value
    :param activity_level: Activity level as a string
    :return: TDEE value
    """
    activity_multipliers = {
        'sedentary': 1.2,
        'lightly active': 1.375,
        'moderately active': 1.55,
        'very active': 1.725,
        'extra active': 1.9
    }
    
    if activity_level.lower() in activity_multipliers:
        tdee_value = bmr_value * activity_multipliers[activity_level.lower()]
    else:
        raise ValueError("Invalid activity level. Choose from: " + ", ".join(activity_multipliers.keys()))
    
    return round(tdee_value, 2)


def calorie_goal(tdee_value, goal):
    """
    Calculate daily calorie goal based on TDEE and fitness goal.
    :param tdee_value: Total Daily Energy Expenditure value
    :param goal: 'lose', 'maintain', or 'gain'
    :return: Daily calorie goal
    """
    if goal.lower() == 'lose':
        calorie_goal_value = tdee_value - 500
    elif goal.lower() == 'maintain':
        calorie_goal_value = tdee_value
    elif goal.lower() == 'gain':
        calorie_goal_value = tdee_value + 500
    else:
        raise ValueError("Goal must be 'lose', 'maintain', or 'gain'")
    
    return round(calorie_goal_value, 2)


def macro_distribution(calorie_goal_value, protein_ratio, fat_ratio, carb_ratio):
    """
    Calculate daily macronutrient distribution.
    :param calorie_goal_value: Daily calorie goal
    :param protein_ratio: Percentage of calories from protein
    :param fat_ratio: Percentage of calories from fat
    :param carb_ratio: Percentage of calories from carbohydrates
    :return: Dictionary with grams of protein, fat, and carbohydrates
    """
    if (protein_ratio + fat_ratio + carb_ratio) != 100:
        raise ValueError("The sum of protein, fat, and carbohydrate ratios must equal 100")
    
    protein_calories = (protein_ratio / 100) * calorie_goal_value
    fat_calories = (fat_ratio / 100) * calorie_goal_value
    carb_calories = (carb_ratio / 100) * calorie_goal_value
    
    protein_grams = protein_calories / 4
    fat_grams = fat_calories / 9
    carb_grams = carb_calories / 4
    
    return {
        'protein_grams': round(protein_grams, 2),
        'fat_grams': round(fat_grams, 2),
        'carb_grams': round(carb_grams, 2)
    }


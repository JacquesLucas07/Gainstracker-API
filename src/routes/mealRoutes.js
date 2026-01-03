const express = require('express');
const router = express.Router();
const MealController = require('../controllers/mealController');

// Routes consommation (repas)
router.post('/', MealController.addMeal);
router.get('/today', MealController.getTodayConsumption);
router.get('/history', MealController.getConsumptionHistory);
router.delete('/:meal_id', MealController.deleteMeal);

module.exports = router;

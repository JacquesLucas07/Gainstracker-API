const express = require('express');
const router = express.Router();
const FoodController = require('../controllers/foodController');

// Routes aliments
router.get('/', FoodController.listFoods);
router.get('/search', FoodController.searchFoods);
router.get('/:aliment_id', FoodController.getFood);
router.post('/', FoodController.createFood);
router.put('/:aliment_id', FoodController.updateFood);
router.delete('/:aliment_id', FoodController.deleteFood);

module.exports = router;

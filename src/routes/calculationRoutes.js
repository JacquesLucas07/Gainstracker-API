const express = require('express');
const router = express.Router();
const CalculationController = require('../controllers/calculationController');

// Routes pour les calculs
router.get('/imc', CalculationController.calculateIMC);
router.get('/bmr', CalculationController.calculateBMR);
router.get('/tdee', CalculationController.calculateTDEE);
router.get('/macros', CalculationController.calculateMacros);
router.get('/calories-burned', CalculationController.calculateCaloriesBurned);

module.exports = router;

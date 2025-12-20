const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const database = require('../config/db/database');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

/**
 * Contrôleur pour l'authentification
 * TODO: À implémenter complètement avec hashage des mots de passe
 */
class AuthController {
    /**
     * Inscription d'un nouvel utilisateur
     */
    static async register(req, res, next) {
        try {
            const { username, email, password, ...otherData } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Le nom d\'utilisateur, l\'email et le mot de passe sont requis'
                });
            }

            await database.connect();

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await database.get(
                'SELECT id FROM users WHERE username = ? OR email = ?',
                [username, email]
            );

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce nom d\'utilisateur ou email existe déjà'
                });
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer l'utilisateur
            const user = new User({ username, email, ...otherData });
            user.calculateIMC();

            const result = await database.run(`
                INSERT INTO users (username, email, password, poids, taille, imc)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                user.username, user.email, hashedPassword,
                user.poids, user.taille, user.imc
            ]);

            user.id = result.lastID;

            // Générer le token JWT
            const token = jwt.sign(
                { userId: user.id, username: user.username, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès',
                data: {
                    user: user.toJSON(),
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Connexion d'un utilisateur
     */
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email et mot de passe requis'
                });
            }

            await database.connect();

            // Trouver l'utilisateur
            const userData = await database.get(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (!userData || !userData.password) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }

            // Vérifier le mot de passe
            const isPasswordValid = await bcrypt.compare(password, userData.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }

            const user = new User(userData);

            // Générer le token JWT
            const token = jwt.sign(
                { userId: user.id, username: user.username, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.json({
                success: true,
                message: 'Connexion réussie',
                data: {
                    user: user.toJSON(),
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Vérifier le token JWT
     */
    static async verifyToken(req, res, next) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token requis'
                });
            }

            const decoded = jwt.verify(token, JWT_SECRET);

            res.json({
                success: true,
                message: 'Token valide',
                data: decoded
            });
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token invalide'
                });
            }

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expiré'
                });
            }

            next(error);
        }
    }

    /**
     * Rafraîchir le token JWT
     */
    static async refreshToken(req, res, next) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token requis'
                });
            }

            // Vérifier le token même s'il est expiré
            const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });

            // Générer un nouveau token
            const newToken = jwt.sign(
                { userId: decoded.userId, username: decoded.username, email: decoded.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.json({
                success: true,
                message: 'Token rafraîchi avec succès',
                data: {
                    token: newToken
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;

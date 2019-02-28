import { Router } from 'express';
export const api = Router();

// Require user to be authenticated
api.use((req, res, next) => {
    if (req.user) {
        return next();
    }
    return res.status(401).json({
        error: 'User not authenticated'
    });
});

api.get('/', (req, res) => {
    res.send('api works');
});
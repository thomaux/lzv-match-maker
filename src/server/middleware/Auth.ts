import { Request, Response, NextFunction } from "express";

export function userHasAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        return next();
    }
    return res.status(401).json({
        error: 'User not authenticated'
    });
}
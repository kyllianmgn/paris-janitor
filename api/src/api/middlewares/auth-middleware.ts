import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"

export const authMiddleware = async (req: Request, res: Response, next: any) => {
    console.log(req.headers)
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({error: "Unauthorized"})
    }

    const token = authHeader.split(" ")[1]
    if (token === null) {
        return res.status(401).json({error: "Unauthorized"})
    }

    try {
        (req as any).payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
    } catch (error) {
        return res.status(401).json({error: error})
    }

    next()
}

export const authzMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const payload = (req as any).payload;

    if (payload?.isSuperAdmin !== true) {
        return res.status(403).json({error: "Forbidden"});
    }

    return next();
};

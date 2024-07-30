import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"

export const isAuthenticated = async (req: Request, res: Response, next: any) => {
    const authHeader = req.cookies.authorization
    if (!authHeader) {
        return res.status(401).json({error: "Unauthorized"})
    }

    const token = authHeader.split(" ")[1]
    if (token === null) {
        return res.status(401).json({error: "Unauthorized"})
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
    } catch (error) {
        return res.status(401).json({error: error})
    }

    next()
}

export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    console.log(req.user)

    /*if (user?.isSuperAdmin !== true) {
        return res.status(403).json({error: "Forbidden"});
    }*/

    return next();
};

import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"
import {RequestUser} from "../../index";

export const isAuthenticated = async (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({error: "Unauthorized"})
    }

    const token = authHeader.split(" ")[1]
    if (token === null) {
        return res.status(401).json({error: "Unauthorized"})
    }

    try {
        const jsp = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
        req.user = jsp as RequestUser
    } catch (error) {
        return res.status(401).json({error: error})
    }

    next()
}

export enum UserRole{
    LANDLORD="LANDLORD",
    TRAVELER="TRAVELER",
    SERVICE_PROVIDER="SERVICE_PROVIDER"
}

export const isRole = (role: UserRole) => {
    return (req: Request, res: Response, next: NextFunction) => {
        switch (role) {
            case UserRole.LANDLORD:
                if (!req.user?.landlordId){
                    res.status(401).json({error: "Unauthorized"})
                    return;
                }
                break;
            case UserRole.TRAVELER:
                if (!req.user?.travelerId){
                    res.status(401).json({error: "Unauthorized"})
                    return;
                }
                break;
            case UserRole.SERVICE_PROVIDER:
                if (!req.user?.serviceProviderId){
                    res.status(401).json({error: "Unauthorized"})
                    return;
                }
                break;
        }
        next()
    }
}

export const isRoleOrAdmin = (role: UserRole) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user?.adminId){
            next()
            return;
        }
        switch (role) {
            case UserRole.LANDLORD:
                if (!req.user?.landlordId){
                    res.status(401).json({error: "Unauthorized"})
                    return;
                }
                break;
            case UserRole.TRAVELER:
                if (!req.user?.travelerId){
                    res.status(401).json({error: "Unauthorized"})
                    return;
                }
                break;
            case UserRole.SERVICE_PROVIDER:
                if (!req.user?.serviceProviderId){
                    res.status(401).json({error: "Unauthorized"})
                    return;
                }
                break;
        }
        next()
    }
}

export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.adminId){
        res.status(401).json({error: "Unauthorized"})
        return;
    }
    next()
};

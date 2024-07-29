import {Request, Response} from "express"

export const invalidPath = (_req: Request, res: Response) => {
    return res.status(404).send({"error": "path not found"})
}

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request,res: Response,next: NextFunction){
    // console.log(req.headers);
    const token = req.headers["authorization"]    
    if(!token){
        res.json({
            message: "No token found."
        })
        return;
    }
    const decoded = jwt.verify(token,JWT_SECRET);
    if(decoded) {
        // Fix the errors
        //@ts-ignore
        req.userId = decoded.id;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}
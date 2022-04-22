import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken"

interface IPayload {
    sub: string;
}

export async function ensureAuthenticateClient(
    request: Request, 
    response: Response, 
    next: NextFunction
    ) {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        return response.status(401).json({
            message: "Token missing"
        });
    }

        //Bearer 0435435-907908690
        //[0] - Bearer
        //[1] - 0435435-907908690
        const [,token ] = authHeader.split(" ")

        try {
            const { sub } = verify(token, "33d3d1b86c246fcecf9822f0015c0904") as IPayload;

            request.id_client = sub;

            return next();
        } catch(err) {
            return response.status(401).json({
                message: "Invalid token!",
            });
        }
    }

import express, {Request, Response, NextFunction} from "express";
import {get, identity, merge} from "lodash";

import { getUserBYSessionToken } from "../db/Users.model";

export const isAuthenticated = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const sessionToken = req.cookies['BACKEND-AUTH'];

        if(!sessionToken){
            res.status(403).send("Cannot Find Cookie");
            return;
        }

        const existingUser = await getUserBYSessionToken(sessionToken);
        if(!existingUser){
            res.status(403).send("Forbidden");
            return;
        }

        merge(req, {identity: existingUser});

        return next();
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
    }
}

export const isOwner = async(req: Request, res:Response, next:NextFunction) => {
    try {

        const {id} = req.params;
        
        const currentUserId = get(req, 'identity._id') as unknown as string;

        if(!currentUserId){
            res.status(403).send("Oops");
            return;
        }

        if(currentUserId.toString() != id){
            res.status(403).send("Oops Gain");
            return;
        }

        return next();
        
    } catch (error) {
        console.log(error);
    }
}
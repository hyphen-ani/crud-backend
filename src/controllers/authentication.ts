import express, {Request, Response} from "express";
import { createUser, getUserByEmail } from "../db/Users.model";
import { authentication, random } from "../helpers";

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).send("Need All Credentials");
            return;
        }

        const user = await getUserByEmail(email).select('+authentication.salt + authentication.password');

        if(!user){
            res.status(400).send("User Already Exists");
            return;
        }

        const expectedHash = authentication(user.authentication!.salt!, password);
        if(user.authentication!.password != expectedHash){
            res.status(403).send("Password Mismatch");
        }

        const salt = random();
        user.authentication!.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('BACKEND-AUTH', user.authentication!.sessionToken, {domain: 'localhost', path: '/'})
        res.status(200).send("User Login");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const {email, password, username} = req.body;

        if(!email || !password || !username){
            res.status(400).send("Need All Credentials");
        }

        const existingUser = await getUserByEmail(email);
        if(existingUser){
            res.status(400).send("User Already Exists");
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            },
        });

        res.status(200).json({
            message: `User Registered Successfully: ${user}`
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
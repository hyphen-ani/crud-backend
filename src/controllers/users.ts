import express, {Request, Response} from "express";
import { deleteById, getUserById, getUsers } from "../db/Users.model";

export const getAllUsers = async (req: Request, res: Response) => {
    try {

        const users = await getUsers();

        res.status(200).json(users);
        return;
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
        return;
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const deletedUser = await deleteById(id);
        res.status(200).send("User Deleted Successfully");
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Isssue");
        return
    }
}

export const updateUser = async (req:Request, res: Response) => {
    try {
        const {id} = req.params;
        const {username} = req.body;

        if(!username){
            res.status(403).send("Username not found");
            return;
        }

        const user = await getUserById(id);

        if (!user) {
            res.status(404).send("User not found");
            return;
        }


        user.username = username;
        await user.save();

        res.status(200).send("Updated User Successfully");
        return;
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
    }

    
}
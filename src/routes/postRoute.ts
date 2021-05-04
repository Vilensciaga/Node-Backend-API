import express, { Request, Response } from "express";
import { Post, postArray } from "../models/post";
import { User, userArray } from "../models/user";
import { userRouter } from './userRoute';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'


const postRouter = express.Router();

let postID = 1;


//Sends all post in the blog, last first
postRouter.get("/",(_req,res,next)=>
{
    res.status(200).send(postArray.sort((a,b)=>{
        return a.createdDate < b.createdDate?-1:a.createdDate > b.createdDate?1:0;
    }));
});


postRouter.get("/:postId",(req,res,next)=>
{
    let foundPost = findAndReturnPost(req,res);
    if(foundPost)
    {
        res.status(200).send(foundPost);
    }
    else
    {
        res.status(404).send({message:'Post does not exist', status:404});
    }
});


// Creates post for the current user
postRouter.post("/",(req,res,next)=>
{
    if(req.headers.token)
    {
        try
        {
            let tokenPayload = jwt.verify((req.headers.token as string).split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn') as {userId:string, firstName:string, iat: number, exp:number, sub:string};

        
                    let date = new Date();
                    let newPost = new Post(postID++, date.toString(), req.body.title, req.body.content, tokenPayload.userId, req.body.headerImage, date.toString());
                    postArray.push(newPost);
    
                    res.status(201).send(newPost);
                

        }
        catch(ex)
        { 
                console.log(ex);
                res.status(401).send({message:'Invalid Web Token'});
        }
    }
    else
    {
        res.status(401).send({message:'Missing Authentification Header'});
    }
});



postRouter.patch("/:postId",(req,res,next)=>
{
    if(req.headers.token)
    {
        try
        {
            let tokenPayload = jwt.verify((req.headers.token as string).split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn') as {userId:string, firstName:string, iat: number, exp:number, sub:string};


            {
                    let foundPost = findAndReturnPost(req, res);

                    if(foundPost !== undefined)
                    {
                        if(tokenPayload.userId === foundPost.userId)
                        {
                            let date = new Date();
                            if(req.body.content)
                            {
                                foundPost.content = req.body.content;
                            }
                            if(req.body.headerImage)
                            {
                                foundPost.headerImage = req.body.headerImage;
                            }

                            foundPost.lastUpdated = date.toString();
                            
                            res.status(202).send(foundPost); 
                        }
                        else
                        {
                            res.status(401).send({message: 'You can only modify your own post'});
                        }
                    }
                }

        }
        catch(ex)
        { 
                console.log(ex);
                res.status(401).send({message:'Invalid Web Token'});
        }
    }
    else
    {
        res.status(401).send({message:'Missing Authentification Header'});
    }
});






postRouter.delete("/:postId",(req,res,next)=>
{
    if(req.headers.token)
    {
        try
        {
            let tokenPayload = jwt.verify((req.headers.token as string).split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn') as {userId:string, firstName:string, iat: number, exp:number, sub:string};


            {
                    let foundPost = findAndReturnPost(req, res);

                    if(foundPost !== undefined)
                    {
                        if(tokenPayload.userId === foundPost.userId)
                        {
                            postArray.splice(postArray.findIndex(u=>u.postId === foundPost?.postId),1);
                            res.status(200).send({message:'Post Deleted'}); 
                        }
                        else
                        {
                            res.status(401).send({message: 'You can only delete your own post'});
                        }
                    }
                }

        }
        catch(ex)
        { 
                console.log(ex);
                res.status(401).send({message:'Invalid Web Token'});
        }
    }
    else
    {
        res.status(401).send({message:'Missing Authentification Header'});
    }
});















function findAndReturnPost(req:Request,res:Response): Post|undefined
{
    let foundpost = postArray.find(u=> u.postId === +req.params.postId);
    if( foundpost == undefined)
    {
        res.status(404).send({message:'Post does not exist', status:404});
    }

    return foundpost;
}




export {postRouter, findAndReturnPost};
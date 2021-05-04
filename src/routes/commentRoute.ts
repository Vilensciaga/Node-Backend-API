import express, { Request, Response } from "express";
import { Post, postArray} from "../models/post";
import { Comment, commentArray} from "../models/comment";
import { User, userArray } from "../models/user";
import { userRouter } from './userRoute';
import { postRouter } from './postRoute'; 
import { findAndReturnPost } from './postRoute'; 


import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'


const commentRouter = express.Router();

let commentID = 1;






// Returns all posts for the passed user
commentRouter.get("/:postId",(req,res,next)=>
{
    let foundPost = findAndReturnPost(req,res);
    const commentArray2:Comment[]=[];


    if(foundPost)
    {

    let numComments = 0;
    for( var i = 0; i < commentArray.length; i++){
        if(foundPost.postId === commentArray[i].postId )
        {
            numComments++;
            commentArray2.push(commentArray[i]);
        }
    }

    if(numComments == 0){
        res.status(200).send({message:'Post does not have any comments', status:200});
    }

    res.status(200).send(commentArray2.sort((a,b)=>{
        return a.commentDate < b.commentDate?-1:a.commentDate > b.commentDate?1:0;
    }));
    }
    else
    {
        res.status(404).send({message:'Post does not exist', status:404});
    }

    
});




// Creates comment for the current user on a given post id
commentRouter.post("/:postId",(req,res,next)=>
{
    if(req.headers.token)
    {
        try
        {
            let tokenPayload = jwt.verify((req.headers.token as string).split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn') as {userId:string, firstName:string, iat: number, exp:number, sub:string};

            let foundPost = findAndReturnPost(req,res);
            if(foundPost)
            {
                    let date = new Date();
                    let newComment = new Comment(commentID++, req.body.comment, tokenPayload.userId, +req.params.postId, date.toString());
                    commentArray.push(newComment);
    
                    res.status(201).send(newComment);
            }
            else
            {
                res.status(404).send({message: 'Post not found'});
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


commentRouter.delete("/:postId/:commentId",(req,res,next)=>
{
    if(req.headers.token)
    {
        try
        {
            let tokenPayload = jwt.verify((req.headers.token as string).split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn') as {userId:string, firstName:string, iat: number, exp:number, sub:string};


            {
                    let foundComment = findAndReturnComment(req, res);

                    if(foundComment !== undefined)
                    {
                        if(tokenPayload.userId === foundComment.userId)
                        {
                            commentArray.splice(commentArray.findIndex(u=>u.postId === foundComment?.postId && u.commentId === foundComment?.commentId),1);
                            res.status(200).send({message:'Comment Deleted'}); 
                        }
                        else
                        {
                            res.status(401).send({message: 'You can only delete your own comments'});
                        }
                    }
                    else
                    {
                        res.status(404).send({message: 'Comment not found'});
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


function findAndReturnComment(req:Request,res:Response): Comment|undefined
{
    let foundcomment = commentArray.find(u=> u.commentId === +req.params.commentId);
    if( foundcomment == undefined)
    {
        res.status(404).send({message:'Post does not exist', status:404});
    }

    return foundcomment;
}





export{commentRouter};
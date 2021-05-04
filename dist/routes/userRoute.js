"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const post_1 = require("../models/post");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
/*
    Responds to a Get request received at /Users
    returns an array of all available users
*/
userRouter.get("/", (_req, res, next) => {
    res.status(200).send(user_1.userArray.sort((a, b) => {
        return a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0;
    }));
});
/*
    Responds to a Get requests received at /Users/:userId where the userId portion is dynamic
    this returns a user if the user is found within the userArray matching the given :userId
    otherwise this returns status 404 user not found
*/
userRouter.get("/:userId", (req, res, next) => {
    let foundUser = findAndReturnUser(req, res);
    if (foundUser) {
        res.status(200).send(foundUser);
    }
    else {
        res.status(404).send({ message: 'User does not exist', status: 404 });
    }
});
/*
    Responds to a Post request recieved at /Users
    creates a new user record with the information provided if the userId provided
    isn't already in the system.
    If the userId provided already exists it returns an error 409 (Conflict)
    If all the required properties for a given user object aren't privided it returns status 406 UnAcceptable
*/
userRouter.post("/", (req, res, next) => {
    let newUser = user_1.userArray.find(u => u.userId.toLowerCase() === req.body.userId.toLowerCase());
    if (newUser != undefined) {
        res.status(409).send({ message: 'Duplicate userId', status: 409 });
    }
    else if (!validateEmail(req.body.emailAddress)) {
        res.status(409).send({ message: 'Valid email address required!' });
    }
    else if (req.body.userId && req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password) {
        bcrypt_1.default.genSalt(10, function (err, salt) {
            bcrypt_1.default.hash(req.body.password, salt, function (err, hash) {
                // Store hash in your password DB.
                newUser = new user_1.User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, hash);
                user_1.userArray.push(newUser);
                res.status(201).send(newUser);
            });
        });
    }
    else
        res.status(406).send({ message: 'userId,firstName,lastName and emailAddress are all required fields!' });
});
/*
    Responds to a Patch Request at /Users/:userId
    It looksup a user in the userArray given the dynamic userId passed in the url.
    If user is found updates are made according to the payload.
    If user isn't found status 404 (not Found) is returned.
*/
userRouter.patch("/:userId", (req, res, next) => {
    if (req.headers.token) {
        try {
            let tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn');
            if (tokenPayload.userId === req.params.userId) {
                let foundUser = findAndReturnUser(req, res);
                if (foundUser !== undefined) {
                    if (req.body.firstName) {
                        foundUser.firstName = req.body.firstName;
                    }
                    if (req.body.lastName) {
                        foundUser.lastName = req.body.lastName;
                    }
                    if (req.body.emailAddress) {
                        foundUser.emailAddress = req.body.emailAddress;
                    }
                    res.status(202).send(foundUser);
                }
            }
            else {
                res.status(401).send({ message: 'You can only modify your account' });
            }
        }
        catch (ex) {
            console.log(ex);
            res.status(401).send({ message: 'Invalid Web Token' });
        }
    }
    else {
        res.status(401).send({ message: 'Missing Authentification Header' });
    }
});
/*
    Responds to a Delete Request at endpoint /Users/:userId
    It looks for and removes the given userId (from the dynamic url segment) from the userArray
    If the user isn't found 404 (Not Found) status is returned.

userRouter.delete("/:userId", (req,res,next)=>{
    let foundUser = findAndReturnUser(req,res);
    if(foundUser!==undefined)
    {
        userArray.splice(userArray.findIndex(u=>u.userId===foundUser?.userId),1);
        res.status(200).send({message:'User Deleted'});
    }
    
});
*/
//user delete themselves using verification
userRouter.delete("/:userId", (req, res, next) => {
    if (req.headers.token) {
        try {
            let tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn');
            //console.log(tokenPayload); 
            if (tokenPayload.userId === req.params.userId) {
                let foundUser = findAndReturnUser(req, res);
                if (foundUser !== undefined) {
                    user_1.userArray.splice(user_1.userArray.findIndex(u => u.userId === foundUser?.userId), 1);
                    res.status(200).send({ message: 'User Deleted' });
                }
            }
            else {
                res.status(401).send({ message: 'You can only delete your account' });
            }
        }
        catch (ex) {
            console.log(ex);
            res.status(401).send({ message: 'Invalid Web Token' });
        }
    }
    else {
        res.status(401).send({ message: 'Missing Authentification Header' });
    }
});
//authentification
userRouter.get("/Login/:userId/:password", (req, res, next) => {
    let foundUser = findAndReturnUser(req, res);
    if (foundUser !== undefined) {
        console.log(req.params.password);
        console.log(foundUser.password);
        bcrypt_1.default.compare(req.params.password, foundUser.password, function (err, result) {
            // result == true
            if (result) {
                //authorization
                let token = jsonwebtoken_1.default.sign({ userId: foundUser?.userId, firstName: foundUser?.firstName }, 'lkjhsfdhkjfkhsjljfkjhsn', { expiresIn: 200, subject: foundUser?.userId });
                res.cookie("Authorization", token);
                res.status(200).send(token);
            }
            else {
                res.status(401).send({ message: 'Invalid Username and Password' });
            }
        });
    }
});
// Returns all posts for the passed user
userRouter.get("/Posts/:userId", (req, res, next) => {
    let foundUser = findAndReturnUser(req, res);
    const postArray2 = [];
    if (foundUser) {
        let numPosts = 0;
        for (var i = 0; i < post_1.postArray.length; i++) {
            if (foundUser.userId === post_1.postArray[i].userId) {
                numPosts++;
                postArray2.push(post_1.postArray[i]);
            }
        }
        if (numPosts == 0) {
            res.status(200).send({ message: 'User does not have any posts', status: 200 });
        }
        res.status(200).send(postArray2.sort((a, b) => {
            return a.createdDate < b.createdDate ? -1 : a.createdDate > b.createdDate ? 1 : 0;
        }));
    }
    else {
        res.status(404).send({ message: 'User does not exist', status: 404 });
    }
});
function findAndReturnUser(req, res) {
    let foundUser = user_1.userArray.find(u => u.userId.toLowerCase() === req.params.userId.toLowerCase());
    if (foundUser == undefined) {
        res.status(404).send({ message: 'User does not exist', status: 404 });
    }
    return foundUser;
}
function validateEmail(value) {
    var regex = RegExp("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$");
    var validEmail = regex.test(value);
    if (!validEmail) {
        return false;
    }
    else {
        return true;
    }
}
//# sourceMappingURL=userRoute.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAndReturnPost = exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const post_1 = require("../models/post");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const postRouter = express_1.default.Router();
exports.postRouter = postRouter;
let postID = 1;
//Sends all post in the blog, last first
postRouter.get("/", (_req, res, next) => {
    res.status(200).send(post_1.postArray.sort((a, b) => {
        return a.createdDate < b.createdDate ? -1 : a.createdDate > b.createdDate ? 1 : 0;
    }));
});
postRouter.get("/:postId", (req, res, next) => {
    let foundPost = findAndReturnPost(req, res);
    if (foundPost) {
        res.status(200).send(foundPost);
    }
    else {
        res.status(404).send({ message: 'Post does not exist', status: 404 });
    }
});
// Creates post for the current user
postRouter.post("/", (req, res, next) => {
    if (req.headers.token) {
        try {
            let tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn');
            let date = new Date();
            let newPost = new post_1.Post(postID++, date.toString(), req.body.title, req.body.content, tokenPayload.userId, req.body.headerImage, date.toString());
            post_1.postArray.push(newPost);
            res.status(201).send(newPost);
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
postRouter.patch("/:postId", (req, res, next) => {
    if (req.headers.token) {
        try {
            let tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn');
            {
                let foundPost = findAndReturnPost(req, res);
                if (foundPost !== undefined) {
                    if (tokenPayload.userId === foundPost.userId) {
                        let date = new Date();
                        if (req.body.content) {
                            foundPost.content = req.body.content;
                        }
                        if (req.body.headerImage) {
                            foundPost.headerImage = req.body.headerImage;
                        }
                        foundPost.lastUpdated = date.toString();
                        res.status(202).send(foundPost);
                    }
                    else {
                        res.status(401).send({ message: 'You can only modify your own post' });
                    }
                }
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
postRouter.delete("/:postId", (req, res, next) => {
    if (req.headers.token) {
        try {
            let tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn');
            {
                let foundPost = findAndReturnPost(req, res);
                if (foundPost !== undefined) {
                    if (tokenPayload.userId === foundPost.userId) {
                        post_1.postArray.splice(post_1.postArray.findIndex(u => u.postId === foundPost?.postId), 1);
                        res.status(200).send({ message: 'Post Deleted' });
                    }
                    else {
                        res.status(401).send({ message: 'You can only delete your own post' });
                    }
                }
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
function findAndReturnPost(req, res) {
    let foundpost = post_1.postArray.find(u => u.postId === +req.params.postId);
    if (foundpost == undefined) {
        res.status(404).send({ message: 'Post does not exist', status: 404 });
    }
    return foundpost;
}
exports.findAndReturnPost = findAndReturnPost;
//# sourceMappingURL=postRoute.js.map
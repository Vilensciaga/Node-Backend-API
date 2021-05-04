"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const comment_1 = require("../models/comment");
const postRoute_1 = require("./postRoute");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const commentRouter = express_1.default.Router();
exports.commentRouter = commentRouter;
let commentID = 1;
// Returns all posts for the passed user
commentRouter.get("/:postId", (req, res, next) => {
    let foundPost = postRoute_1.findAndReturnPost(req, res);
    const commentArray2 = [];
    if (foundPost) {
        let numComments = 0;
        for (var i = 0; i < comment_1.commentArray.length; i++) {
            if (foundPost.postId === comment_1.commentArray[i].postId) {
                numComments++;
                commentArray2.push(comment_1.commentArray[i]);
            }
        }
        if (numComments == 0) {
            res.status(200).send({ message: 'Post does not have any comments', status: 200 });
        }
        res.status(200).send(commentArray2.sort((a, b) => {
            return a.commentDate < b.commentDate ? -1 : a.commentDate > b.commentDate ? 1 : 0;
        }));
    }
    else {
        res.status(404).send({ message: 'Post does not exist', status: 404 });
    }
});
// Creates comment for the current user on a given post id
commentRouter.post("/:postId", (req, res, next) => {
    if (req.headers.token) {
        try {
            let tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn');
            let foundPost = postRoute_1.findAndReturnPost(req, res);
            if (foundPost) {
                let date = new Date();
                let newComment = new comment_1.Comment(commentID++, req.body.comment, tokenPayload.userId, +req.params.postId, date.toString());
                comment_1.commentArray.push(newComment);
                res.status(201).send(newComment);
            }
            else {
                res.status(404).send({ message: 'Post not found' });
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
commentRouter.delete("/:postId/:commentId", (req, res, next) => {
    if (req.headers.token) {
        try {
            let tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.split(' ')[1].toString(), 'lkjhsfdhkjfkhsjljfkjhsn');
            {
                let foundComment = findAndReturnComment(req, res);
                if (foundComment !== undefined) {
                    if (tokenPayload.userId === foundComment.userId) {
                        comment_1.commentArray.splice(comment_1.commentArray.findIndex(u => u.postId === foundComment?.postId && u.commentId === foundComment?.commentId), 1);
                        res.status(200).send({ message: 'Comment Deleted' });
                    }
                    else {
                        res.status(401).send({ message: 'You can only delete your own comments' });
                    }
                }
                else {
                    res.status(404).send({ message: 'Comment not found' });
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
function findAndReturnComment(req, res) {
    let foundcomment = comment_1.commentArray.find(u => u.commentId === +req.params.commentId);
    if (foundcomment == undefined) {
        res.status(404).send({ message: 'Post does not exist', status: 404 });
    }
    return foundcomment;
}
//# sourceMappingURL=commentRoute.js.map
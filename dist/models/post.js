"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postArray = exports.Post = void 0;
class Post {
    constructor(postId, createdDate, title, content, userId, headerImage, lastUpdated) {
        this.postId = postId;
        this.createdDate = createdDate;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.headerImage = headerImage;
        this.lastUpdated = lastUpdated;
    }
}
exports.Post = Post;
const postArray = [];
exports.postArray = postArray;
//# sourceMappingURL=post.js.map
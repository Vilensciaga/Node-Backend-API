class Comment
{
    commentId:number;
    comment:string;
    userId:string;
    postId:number;   
    commentDate:string;

    constructor(commentId:number, comment:string, userId:string, postId:number, commentDate:string)
    {
        this.commentId = commentId;
        this.comment = comment;
        this.userId=userId;
        this.postId = postId;
        this.commentDate = commentDate;
    
    }


}


const commentArray:Comment[]=[];
export {Comment, commentArray};
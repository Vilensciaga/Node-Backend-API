"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const userRoute_1 = require("./routes/userRoute");
const postRoute_1 = require("./routes/postRoute");
const commentRoute_1 = require("./routes/commentRoute");
// Credit to Professor Jose Gomez for the baseline
let app = express_1.default();
console.log(process.cwd());
//Registers a middleware that parses the requests and apopends it to our body and it calls next() in the end for JSON formatter requests.
app.use(body_parser_1.default.json());
//Registers a middldeware that parses the request and appends it to our body and it calls next() in the end
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', 'src/views');
// Directs all requests starting with /Users to the userRouter
app.use("/Users", userRoute_1.userRouter);
app.use("/Posts", postRoute_1.postRouter);
app.use("/Comments", commentRoute_1.commentRouter);
// This is default route it returns documentation of the API. It uses PUG to generate it.
app.use("/", (req, res, next) => {
    let apiEndPoints = [];
    apiEndPoints.push({ method: '[GET]', url: '/Users', description: 'Return a list of any user in the database (as a JSON array) with all their properties' });
    apiEndPoints.push({ method: '[POST]', url: '/Users', description: 'Creates a new user with the properties userId,firstName, lastName, emailAddress. Returns an error for duplicate users' });
    apiEndPoints.push({ method: '[GET]', url: '/Users/:userId', description: 'Returns a User object for the specified userId, returns 404 Error if the user isn\'t found' });
    apiEndPoints.push({ method: '[PATCH]', url: '/Users/:userId', description: 'Updates an existing user passed dynamically in the URl. Updatable properties include firstName, lastName, emailAddress. Returns 404 error if User is not found' });
    apiEndPoints.push({ method: '[DELETE]', url: '/Users/:userId', description: 'Deletes an existing user passed dynamically in the URL. If user isn\'t found it returns error 404' });
    apiEndPoints.push({ method: '[GET]', url: '/Users/login/:userId/:password', description: 'Rerurns a valid JSON Web Token if userId and password are correct, returns 401 Un-authorized otherwise' });
    apiEndPoints.push({ method: '[GET]', url: '/Users/Posts/:userId', description: 'Returns all posts for the passes in user' });
    apiEndPoints.push({ method: '[GET]', url: '/Posts', description: 'Returns all posts on the blog sorted from last in at first position' });
    apiEndPoints.push({ method: '[GET]', url: '/Posts/:postId', description: 'Returns a specific post based on given ID and status 200 under normal circumstances' });
    apiEndPoints.push({ method: '[POST]', url: '/Posts/', description: 'Create a new Post for the currently authentificated user, returns 401 Not authorized if the request is not properly authentificated, returns 201 (created) under normal circumstances' });
    apiEndPoints.push({ method: '[PATCH]', url: '/Posts/:postId', description: 'Updates an eisting post, no changes to the id or creation date are allowed, require authentification. Returns status 401 if request is not authorized, otherwise returns status 200' });
    apiEndPoints.push({ method: '[DELETE]', url: '/Posts/:postId', description: 'Deletes a given post and related comments, Requires authentification header with valid web token. Returns 401(Not Authorized) if not properly authentificated and 204 under normal circumstances' });
    apiEndPoints.push({ method: '[GET]', url: '/Comments/:postId', description: 'Returns all comments associated with a given post' });
    apiEndPoints.push({ method: '[POST]', url: '/Comments/:postId', description: 'Creates comments for a given post, return ststus 404 is post id not found' });
    apiEndPoints.push({ method: '[DELETE]', url: '/Comments/:postId/:commentId', description: 'Deletes a comment for a given post based on the passed parameters' });
    res.render('index', { API: apiEndPoints });
});
app.listen(3000);
//# sourceMappingURL=app.js.map
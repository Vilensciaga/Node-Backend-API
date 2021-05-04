"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userArray = exports.User = void 0;
class User {
    constructor(userId, firstName, lastName, emailAddress, password) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;
    }
    toJSON() {
        return new User(this.userId, this.firstName, this.lastName, this.emailAddress, '******');
    }
}
exports.User = User;
const userArray = [];
exports.userArray = userArray;
//# sourceMappingURL=user.js.map
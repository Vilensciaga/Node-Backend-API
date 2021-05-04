class User
{
    userId:string;
    firstName:string;
    lastName:string;
    emailAddress:string;   
    password:string;

    constructor(userId:string, firstName:string, lastName:string, emailAddress:string, password:string)
    {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName=lastName;
        this.emailAddress = emailAddress;
        this.password = password;
    
    }

    toJSON()
    {
        return new User(this.userId, this.firstName, this.lastName, this.emailAddress, '******')
    }
}


const userArray:User[]=[];
export {User, userArray};
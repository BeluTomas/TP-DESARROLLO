export interface User {
    _id:String,
    name:String,
    surname:String,
    email:String,
    avatar:String,
}
export interface UserR {
    user: User,
}
export interface UserL {
    users: User[],
}
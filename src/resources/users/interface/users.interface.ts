export interface IUser {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string;
    displayname?: string;
    mobile?: string;
    gender?: string;
    avatar?: string;
}

export interface IUserResponse {
    result?: IUser | IUser[];
    success: boolean;
    message: string;
}

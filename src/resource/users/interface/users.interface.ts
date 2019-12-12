export interface User {
    _id?: string;
    firstname: string;
    lastname: string;
    displayname: string;
    email: string;
    mobile: string;
    gender: string;
}

export interface UserResponse {
    result?: User | User[];
    success: boolean;
    message: string;
}

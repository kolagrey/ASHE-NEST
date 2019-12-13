export interface User {
    _id?: string;
    firstname: string;
    lastname: string;
    displayname: string;
    email: string;
    mobile: string;
    gender: string;
}

export interface UserSecurity {
    email: string;
    mobile: string;
    salt: string;
    hash: string;
}

export interface GenericResponse {
    result?: any;
    success?: boolean;
    message?: string;
}

export interface UserAuthResponse {
    isAuthenticated: boolean;
    token?: string;
    message?: string;
}

export interface AuthResponse {
    token?: string;
    success?: boolean;
    message?: string;
}

export interface UserResponse {
    result?: User | User[];
    success: boolean;
    message: string;
}

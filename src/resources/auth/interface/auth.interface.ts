export interface IUserSecurity {
    email: string;
    mobile: string;
    salt: string;
    hash: string;
}

export interface IGenericResponse {
    result?: any;
    success?: boolean;
    message?: string;
}

export interface IUserAuthResponse {
    isAuthenticated: boolean;
    token?: string;
    message?: string;
}

export interface IAuthResponse {
    token?: string;
    success?: boolean;
    message?: string;
}

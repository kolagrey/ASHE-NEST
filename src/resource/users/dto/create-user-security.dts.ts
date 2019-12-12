export class CreateUserSecurityDto {
    readonly email: string;
    readonly mobile: string;
    readonly salt: string;
    readonly hash: string;
}

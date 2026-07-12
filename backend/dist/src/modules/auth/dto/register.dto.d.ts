export declare enum RegisterRole {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER"
}
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    role: RegisterRole;
}

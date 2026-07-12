import { UserRole } from '@prisma/client';
export interface WsUser {
    sub: string;
    email: string;
    role: UserRole;
    name: string;
}
export interface WsJwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    name: string;
    iat?: number;
    exp?: number;
}

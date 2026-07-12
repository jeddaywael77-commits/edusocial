export declare class AuthTokensDto {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthResponseDto {
    user: any;
    tokens: AuthTokensDto;
}

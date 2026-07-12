declare const _default: (((() => {
    port: number;
    nodeEnv: string;
    apiPrefix: string;
    corsOrigin: string;
    uploadDir: string;
    maxFileSize: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    nodeEnv: string;
    apiPrefix: string;
    corsOrigin: string;
    uploadDir: string;
    maxFileSize: number;
}>) | ((() => {
    url: string | undefined;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    url: string | undefined;
}>) | ((() => {
    host: string;
    port: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    port: number;
}>) | ((() => {
    secret: string | undefined;
    expiration: string;
    refreshSecret: string | undefined;
    refreshExpiration: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    secret: string | undefined;
    expiration: string;
    refreshSecret: string | undefined;
    refreshExpiration: string;
}>))[];
export default _default;

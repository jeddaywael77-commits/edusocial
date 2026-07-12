export interface SecurityCheckResult {
    safe: boolean;
    flags: string[];
    sanitized?: string;
}
export declare class AiSecurityService {
    private readonly logger;
    checkInjection(input: string): SecurityCheckResult;
    filterPII(input: string): SecurityCheckResult;
    checkHarmfulContent(input: string): SecurityCheckResult;
    comprehensiveCheck(input: string, options?: {
        checkInjection?: boolean;
        filterPII?: boolean;
        checkHarmful?: boolean;
    }): SecurityCheckResult;
    sanitizeForLLM(input: string): string;
    logSecurityEvent(userId: string, type: string, flags: string[]): void;
}

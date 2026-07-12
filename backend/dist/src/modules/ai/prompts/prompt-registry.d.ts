export interface PromptTemplate {
    id: string;
    name: string;
    category: string;
    version: number;
    content: string;
    variables: string[];
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
    createdAt: Date;
    updatedAt: Date;
}
export type PromptBuilderFn = (...args: any[]) => string;
export declare class PromptRegistry {
    private static prompts;
    static register(template: PromptTemplate): void;
    static get(id: string): PromptTemplate | undefined;
    static getByCategory(category: string): PromptTemplate[];
    static render(id: string, variables: Record<string, string>): {
        system: string;
        user: string;
    };
}

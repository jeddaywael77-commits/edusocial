import { Injectable, Logger } from '@nestjs/common';

const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above)\s+instructions?/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\[\/INST\]/i,
  /forget\s+(everything|all|previous)/i,
  /act\s+as\s+if/i,
  /pretend\s+you\s+are/i,
  /override\s+(your|the|all)/i,
  /new\s+instructions?:/i,
  /admin\s+mode/i,
  /developer\s+mode/i,
];

const PII_PATTERNS = [
  { name: 'email', pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { name: 'phone', pattern: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g },
  { name: 'ssn', pattern: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g },
  { name: 'creditCard', pattern: /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g },
  { name: 'ip', pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
];

const HARMFUL_CONTENT_PATTERNS = [
  /how\s+to\s+(make|build|create)\s+(a\s+)?(bomb|weapon|explosive)/i,
  /suicide\s+(method|instructions?|how)/i,
  /self[-\s]harm\s+(instructions?|methods?)/i,
];

export interface SecurityCheckResult {
  safe: boolean;
  flags: string[];
  sanitized?: string;
}

@Injectable()
export class AiSecurityService {
  private readonly logger = new Logger(AiSecurityService.name);

  checkInjection(input: string): SecurityCheckResult {
    const flags: string[] = [];
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(input)) {
        flags.push(`injection:${pattern.source.slice(0, 30)}`);
      }
    }
    return { safe: flags.length === 0, flags };
  }

  filterPII(input: string): SecurityCheckResult {
    const flags: string[] = [];
    let sanitized = input;
    for (const { name, pattern } of PII_PATTERNS) {
      const matches = input.match(pattern);
      if (matches) {
        flags.push(`pii:${name}`);
        sanitized = sanitized.replace(pattern, `[REDACTED ${name.toUpperCase()}]`);
      }
    }
    return { safe: flags.length === 0, flags, sanitized };
  }

  checkHarmfulContent(input: string): SecurityCheckResult {
    const flags: string[] = [];
    for (const pattern of HARMFUL_CONTENT_PATTERNS) {
      if (pattern.test(input)) {
        flags.push(`harmful:${pattern.source.slice(0, 30)}`);
      }
    }
    return { safe: flags.length === 0, flags };
  }

  comprehensiveCheck(input: string, options: {
    checkInjection?: boolean;
    filterPII?: boolean;
    checkHarmful?: boolean;
  } = {}): SecurityCheckResult {
    const { checkInjection = true, filterPII = true, checkHarmful = true } = options;
    const allFlags: string[] = [];
    let sanitized = input;

    if (checkInjection) {
      const result = this.checkInjection(input);
      allFlags.push(...result.flags);
    }

    if (filterPII) {
      const result = this.filterPII(sanitized);
      allFlags.push(...result.flags);
      if (result.sanitized) sanitized = result.sanitized;
    }

    if (checkHarmful) {
      const result = this.checkHarmfulContent(sanitized);
      allFlags.push(...result.flags);
    }

    return {
      safe: allFlags.length === 0,
      flags: allFlags,
      sanitized,
    };
  }

  sanitizeForLLM(input: string): string {
    let result = input;
    // Remove zero-width characters
    result = result.replace(/[\u200B-\u200D\uFEFF]/g, '');
    // Normalize whitespace
    result = result.replace(/\s+/g, ' ').trim();
    return result;
  }

  logSecurityEvent(userId: string, type: string, flags: string[]): void {
    this.logger.warn(`Security event: user=${userId}, type=${type}, flags=${flags.join(',')}`);
  }
}

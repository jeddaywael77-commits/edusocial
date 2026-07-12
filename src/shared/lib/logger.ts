interface LogContext {
  endpoint?: string;
  method?: string;
  status?: number;
  userId?: string;
  [key: string]: unknown;
}

export function logApiError(
  message: string,
  error: unknown,
  context?: LogContext
): void {
  const timestamp = new Date().toISOString();
  const errorInfo =
    error instanceof Error
      ? { name: error.name, message: error.message }
      : { message: String(error) };

  console.error(
    JSON.stringify({
      level: "error",
      timestamp,
      ...context,
      error: errorInfo,
      message,
    })
  );
}

export function logAuthError(action: string, error: unknown): void {
  logApiError(`Auth error during: ${action}`, error, { endpoint: "auth" });
}

export function logInfo(message: string, context?: LogContext): void {
  const timestamp = new Date().toISOString();
  console.log(
    JSON.stringify({
      level: "info",
      timestamp,
      ...context,
      message,
    })
  );
}

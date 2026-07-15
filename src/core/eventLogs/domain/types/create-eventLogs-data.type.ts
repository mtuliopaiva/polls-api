export type CreateEventLogsData = {
  level: string;
  message: string;
  context?: string;
  stack?: string;
  metadata?: unknown;
};

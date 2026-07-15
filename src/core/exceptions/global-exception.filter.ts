import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EventLogsService } from '../eventLogs/service/eventLogs.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly eventLogsService: EventLogsService) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<
      Request & { user?: { uuid?: string; email?: string } }
    >();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : typeof exceptionResponse === 'object' &&
            exceptionResponse !== null &&
            'message' in exceptionResponse
          ? Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message.join(', ')
            : String(exceptionResponse.message)
          : exception instanceof Error
            ? exception.message
            : 'Internal server error';

    const stack = exception instanceof Error ? exception.stack : undefined;

    await this.eventLogsService.error({
      message,
      context: 'GlobalExceptionFilter',
      stack,
      metadata: {
        method: request.method,
        path: request.url,
        params: request.params,
        query: request.query,
        body: request.body,
        userUuid: request.user?.uuid,
        userEmail: request.user?.email,
        status,
      },
    });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

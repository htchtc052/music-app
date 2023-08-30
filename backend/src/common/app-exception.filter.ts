import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

export interface HttpExceptionResponse {
  statusCode: number;
  message: any;
  error: string;
}

export const getErrorMessage = <T>(exception: T): any => {
  if (exception instanceof HttpException) {
    const errorResponse = exception.getResponse();
    const errorMessage =
      (errorResponse as HttpExceptionResponse).message || exception.message;

    return errorMessage;
  } else {
    return String(exception);
  }
};

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    let message = `App error: ${exception!.stack.toString()}`;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();
      //это нужно, что бы получать ошибку и как строку и как объект в случае валидации
      message =
        (errorResponse as HttpExceptionResponse).message || exception.message;
    } else {
      //показываем в лог только ошибки приложения
      console.error(message);
    }
    const { httpAdapter } = this.httpAdapterHost;

    const responseBody = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { LoggerService } from '../logger/logger.service';
@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  constructor(private readonly elasticsearchService: ElasticsearchService) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization ? true : false;
    const requestInformation = {
      params: request.params,
      query: request.query,
      body: this.hidePrivateInformation(request.body),
      auth: auth,
    };

    const timeStartRequest = new Date();
    let log =
      `[${timeStartRequest.toLocaleString('en-US', { timeZone: 'UTC' })}] ` +
      `${this.colorizeLogToMagenta(`REQUEST`)}: {url: ${this.colorizeLogToGreen(
        request.url,
      )}, method: ${this.colorizeLogToGreen(request.method)}, ` +
      `detail:${JSON.stringify(requestInformation)}} `;
    const responseStatusCode = context.switchToHttp().getResponse().statusCode;
    const logEntry = {
      timestamp: new Date(),
      log,
    };

    return next.handle().pipe(
      tap(() => {
        const executionTime = Date.now() - timeStartRequest.getTime();
        log += `${this.colorizeLogToMagenta(
          `RESPONSE`,
        )}: {status: ${this.colorizeLogToYellow(
          responseStatusCode,
        )}, execution_time: ${this.colorizeLogToYellow(
          String(executionTime) + `ms`,
        )}}`;
        this.elasticsearchService.index({
          index: 'logs1', // Tên index để lưu log
          body: logEntry,
        });
        console.log(log);
      }),
    );
  }

  hidePrivateInformation(data: any) {
    const clonedData = { ...data };
    if (clonedData.password) {
      clonedData.password = '********';
    }
    return clonedData;
  }

  colorizeLogToGreen(string: string) {
    return `\x1b[4m\x1b[32m${string}\x1b[0m`;
  }

  colorizeLogToYellow(string: any) {
    return `\x1b[4m\x1b[33m${string}\x1b[0m`;
  }

  colorizeLogToMagenta(string: any) {
    return `\x1b[35m${string}\x1b[0m`;
  }
}

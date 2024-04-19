import {
  ArgumentsHost,
  BadRequestException,
  Catch
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class QueryErrorFilter extends BaseExceptionFilter {

  public catch(exception: any, host: ArgumentsHost): any {

    const context = host.switchToHttp();
    const response = context.getResponse();

    const detail = exception.detail;
    if (typeof detail === 'string' && detail.includes('already exists')) {
      const messageStart = exception.table.split('_').join(' ') + ' with';

      response.json(new BadRequestException(
        exception.detail.replace('Key', messageStart),
      ));
    }

    return super.catch(exception, host);
  }
}
import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    switch ((exception.driverError as any).code) {
      case "23505":
        response.json(new ConflictException('Resource already exists'));
        break
      default:
        response.json(new InternalServerErrorException());
    }
  }
}

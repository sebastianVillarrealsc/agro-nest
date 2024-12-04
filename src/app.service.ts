import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World! In Environment: ${process.env.ENVIRONMENT}`;
  }
}

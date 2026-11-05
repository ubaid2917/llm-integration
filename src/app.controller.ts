import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  HttpCode,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('summarize')
  async summarize(@Body('ticket') ticket: unknown) {
    if (typeof ticket !== 'string' || ticket.trim().length === 0) {
      throw new BadRequestException('ticket must be a non-empty string');
    }

    return { text: await this.appService.summarizeTicket(ticket.trim()) };
  }
}
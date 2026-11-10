import { Injectable } from '@nestjs/common';
import { AiService } from './ai/ai.service';

@Injectable()
export class AppService {
  constructor(private readonly aiService: AiService) {}

  summarizeTicket(ticket: string): Promise<string> {
    return this.aiService.generateText(
      ticket,
      'Summarize this customer support query in one or two lines.',
    );
  }
}
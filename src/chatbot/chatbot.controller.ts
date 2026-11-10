import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  async create(
    @Body() body: { userId?: unknown; message?: unknown },
  ): Promise<{ text: string }> {
    if (typeof body?.userId !== 'string' || body.userId.trim().length === 0) {
      throw new BadRequestException('userId must be a non-empty string');
    }

    if (typeof body.message !== 'string' || body.message.trim().length === 0) {
      throw new BadRequestException('message must be a non-empty string');
    }

    return {
      text: await this.chatbotService.processMessage(
        body.userId.trim(),
        body.message.trim(),
      ),
    };
  }
}
